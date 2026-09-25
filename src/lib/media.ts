import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { ISLANDS } from "@/content/islands";
import { env } from "./env";
import { chatJSON, generateImage } from "./ai/openrouter";
import { getStatus, submitImageToVideo, submitReferenceVideo, uploadFile } from "./ai/higgsfield";
import { loadPlayer, readMediaFile, saveMedia, updatePlayer } from "./store";
import os from "os";
import { PATH_FORMS, formName, personalitySummary, stageForIsland, topTrait } from "./forms";
import type { Job, Player } from "./types";

const ART_DIR = path.join(process.cwd(), "public");
const STYLE =
  "Style: bright whimsical storybook video-game art, painterly with clean readable shapes, soft pastel sky palette, warm sunlight, high detail, charming and friendly. No text, no letters, no watermark, no UI.";

const run = promisify(execFile);

/** Shrink a downloaded clip (~13MB → ~3MB) and move its index to the front so it starts playing instantly. Returns the original if ffmpeg isn't available (e.g. on Vercel). */
async function webOptimise(raw: Buffer, name: string): Promise<Buffer> {
  const tmpIn = path.join(os.tmpdir(), `${name}-${Date.now()}.raw.mp4`);
  const tmpOut = path.join(os.tmpdir(), `${name}-${Date.now()}.mp4`);
  try {
    await fs.writeFile(tmpIn, raw);
    await run("ffmpeg", ["-loglevel", "error", "-y", "-i", tmpIn, "-c:v", "libx264", "-crf", "24", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-c:a", "aac", "-b:a", "128k", tmpOut], { timeout: 180_000 });
    return await fs.readFile(tmpOut);
  } catch {
    return raw;
  } finally {
    await fs.unlink(tmpIn).catch(() => {});
    await fs.unlink(tmpOut).catch(() => {});
  }
}

const g = globalThis as unknown as { __sihRunning?: Set<string> };
const running = (g.__sihRunning ??= new Set<string>());

// ---------- which jobs should exist ----------

function done(p: Player, key: string) {
  return p.jobs[key]?.status === "done";
}

/** Reached the third challenge of island n (or later). Next-island media starts here so it is ready on arrival. */
function reachedFinale(p: Player, n: number) {
  if (p.phase === "finished") return true;
  return p.island > n || (p.island === n && (p.challenge >= 2 || p.phase === "island_complete"));
}

export function wantedJobs(p: Player): { key: string; kind: "image" | "video" }[] {
  const out: { key: string; kind: "image" | "video" }[] = [];
  if (!p.creatureDesc) return out;
  out.push({ key: "portrait_creature_0", kind: "image" }, { key: "portrait_adventurer", kind: "image" });
  const base = done(p, "portrait_creature_0") && done(p, "portrait_adventurer");
  if (!base) return out;
  out.push({ key: "video_hatch", kind: "video" }, { key: "video_intro_1", kind: "video" });

  // Evolution portraits: after islands 3, 6, 10 (started at that island's final challenge).
  const evoIsland = [0, 3, 6, 10];
  for (let k = 1; k <= 3; k++) {
    if (reachedFinale(p, evoIsland[k]) && done(p, `portrait_creature_${k - 1}`)) {
      out.push({ key: `portrait_creature_${k}`, kind: "image" });
      if (done(p, `portrait_creature_${k}`)) out.push({ key: `video_evo_${k}`, kind: "video" });
    }
  }
  // Island intros 2..10.
  for (let n = 2; n <= 10; n++) {
    if (reachedFinale(p, n - 1) && done(p, `portrait_creature_${stageForIsland(n)}`)) {
      out.push({ key: `video_intro_${n}`, kind: "video" });
    }
  }
  if (p.phase === "finished" && done(p, "portrait_creature_3")) out.push({ key: "video_ending", kind: "video" });
  return out;
}

/** Create any missing jobs and start them. Also restarts jobs orphaned by a server restart and retries failures. */
const STALE_MS = 7 * 60_000;

/** Decide which jobs to create, restart or retry. Mutates `p` and returns the keys to start. */
function planJobs(p: Player, now: number): string[] {
  const toStart: string[] = [];
  for (const w of wantedJobs(p)) {
    const j = p.jobs[w.key];
    if (!j) {
      p.jobs[w.key] = { key: w.key, kind: w.kind, status: "preparing", attempts: 0, createdAt: now, updatedAt: now };
      if (w.key === "portrait_creature_2") p.path = topTrait(p.traits);
      toStart.push(w.key);
    } else if (j.status === "preparing" && !running.has(`${p.id}:${w.key}`) && now - j.updatedAt > STALE_MS) {
      j.updatedAt = now; // orphaned (a server stopped mid-way): claim it and restart
      toStart.push(w.key);
    } else if (j.status === "failed" && j.attempts < 3 && now - j.updatedAt > 20_000) {
      Object.assign(j, { status: "preparing", updatedAt: now, error: undefined });
      toStart.push(w.key);
    }
  }
  return toStart;
}

/** Create any missing jobs and run them. Callers wrap this in after() so it continues after the response. */
export async function syncJobs(playerId: string): Promise<void> {
  const now = Date.now();
  const current = await loadPlayer(playerId);
  if (!current || planJobs(structuredClone(current), now).length === 0) return; // nothing to do: skip the write
  const { value: toStart } = await updatePlayer(playerId, (p) => planJobs(p, now));
  await Promise.all(toStart.map((key) => runJob(playerId, key)));
}

// ---------- running jobs ----------

async function setJob(playerId: string, key: string, patch: Partial<Job>) {
  await updatePlayer(playerId, (p) => {
    const j = p.jobs[key];
    if (j) Object.assign(j, patch, { updatedAt: Date.now() });
  });
}

async function runJob(playerId: string, key: string) {
  const id = `${playerId}:${key}`;
  if (running.has(id)) return;
  running.add(id);
  try {
    await setJob(playerId, key, { status: "preparing" });
    const p = await loadPlayer(playerId);
    if (!p) return;
    if (key.startsWith("portrait_")) await makePortrait(p, key);
    else if (!env.videosEnabled) await setJob(playerId, key, { status: "done", meta: { skipped: true } });
    else await startVideo(p, key);
    await syncJobs(playerId); // a finished portrait may unlock the next job
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[job ${id}]`, msg);
    await updatePlayer(playerId, (p) => {
      const j = p.jobs[key];
      if (j) Object.assign(j, { status: "failed", error: msg.slice(0, 300), attempts: j.attempts + 1, updatedAt: Date.now() });
    }).catch(() => {});
  } finally {
    running.delete(id);
  }
}

/** Poll Seedance for rendering videos and download finished ones. */
export async function pollVideos(playerId: string) {
  const p = await loadPlayer(playerId);
  if (!p) return;
  const now = Date.now();
  const due = Object.values(p.jobs).filter((j) => j.status === "rendering" && j.statusUrl && now - (j.lastPoll ?? 0) > 8000);
  await Promise.all(
    due.map(async (j) => {
      const id = `${playerId}:poll:${j.key}`;
      if (running.has(id)) return;
      running.add(id);
      try {
        await setJob(playerId, j.key, { lastPoll: Date.now() });
        const s = await getStatus(j.statusUrl!);
        if (s.status === "completed" && s.video?.url) {
          const res = await fetch(s.video.url, { signal: AbortSignal.timeout(120_000) });
          if (!res.ok) throw new Error(`download ${res.status}`);
          const file = `${j.key}.mp4`;
          await saveMedia(playerId, file, await webOptimise(Buffer.from(await res.arrayBuffer()), `${playerId}-${j.key}`));
          await setJob(playerId, j.key, { status: "done", file });
        } else if (s.status === "failed" || s.status === "nsfw" || s.status === "canceled") {
          await updatePlayer(playerId, (pl) => {
            const jj = pl.jobs[j.key];
            if (jj) Object.assign(jj, { status: "failed", error: s.error || s.status, attempts: jj.attempts + 1, updatedAt: Date.now() });
          });
        }
      } catch (e) {
        console.error(`[poll ${j.key}]`, e instanceof Error ? e.message : e);
      } finally {
        running.delete(id);
      }
    }),
  );
}

// ---------- portraits ----------

async function readArt(publicPath: string) {
  const data = await fs.readFile(path.join(ART_DIR, publicPath));
  return { data, mime: publicPath.endsWith(".png") ? "image/png" : "image/jpeg" };
}

async function readMedia(p: Player, key: string) {
  const file = p.jobs[key]?.file;
  if (!file) throw new Error(`${key} not ready`);
  const data = await readMediaFile(p.id, file);
  return { data, mime: file.endsWith(".png") ? "image/png" : "image/jpeg" };
}

async function ensureVisuals(p: Player): Promise<{ creature: string; adventurer: string }> {
  if (p.creatureVisual && p.adventurerVisual) return { creature: p.creatureVisual, adventurer: p.adventurerVisual };
  const r = await chatJSON<{ creature: string; adventurer: string }>(
    `You turn a player's own words into short visual descriptions for a family-friendly storybook fantasy game. Keep every detail the player asked for (colours, shape, features) unless it is unsafe; then pick the closest cute alternative. The creature is a small newly hatched baby. Reply as JSON {"creature": string, "adventurer": string}, one or two sentences each, purely visual (no names, no story).`,
    JSON.stringify({
      creature_words: p.creatureDesc,
      adventurer_words: p.adventurerDesc || "a young adventurer with an orange scarf and aviator goggles",
    }),
  );
  await updatePlayer(p.id, (pl) => {
    pl.creatureVisual = r.creature;
    pl.adventurerVisual = r.adventurer;
  });
  p.creatureVisual = r.creature;
  p.adventurerVisual = r.adventurer;
  return r;
}

function journalText(p: Player, max = 12) {
  return p.journal.slice(-max).map((j) => `Island ${j.island}: ${j.text}`).join("\n") || "(nothing yet)";
}

async function makePortrait(p: Player, key: string) {
  const vis = await ensureVisuals(p);
  let prompt: string;
  let refs: { data: Buffer; mime: string }[] = [];
  if (key === "portrait_adventurer") {
    prompt = `Character portrait of the player's adventurer: ${vis.adventurer} Full body, friendly heroic pose, centered, on a soft pastel sky background with floating islands. ${STYLE}`;
  } else if (key === "portrait_creature_0") {
    prompt = `Character portrait of ${p.creatureName}, a tiny newly hatched baby creature: ${vis.creature} A few bits of purple-spotted eggshell on its head. Sitting happily on a mossy rock. Full body, centered, on a soft pastel sky gradient background with clouds. ${STYLE}`;
  } else {
    const k = Number(key.split("_").pop());
    const prev = await readMedia(p, `portrait_creature_${k - 1}`);
    refs = [prev];
    const path_ = p.path ?? topTrait(p.traits);
    const detail = await chatJSON<{ detail: string }>(
      `You design one small personal detail for an evolved game creature so it reflects the player's journey. Reply JSON {"detail": string} with one short visual detail (an accessory, marking or keepsake) that refers to something from the journal. Family friendly.`,
      `Creature: ${p.creatureName}. Personality: ${personalitySummary(p.traits)}.\nJournal:\n${journalText(p)}`,
    ).catch(() => ({ detail: "" }));
    const keep = `Keep it clearly the SAME creature as the reference image: same colours, same face and eyes, same wings and tail shapes, just evolved.`;
    if (k === 1) {
      prompt = `Character portrait of ${p.creatureName} after its first evolution, the Explorer form: the creature from the reference image grown to a playful puppy-sized adventurer, longer wings now able to glide, confident happy grin, mid-hop. ${detail.detail} ${keep} Full body, centered, pastel sky background. ${STYLE}`;
    } else if (k === 2) {
      const f = PATH_FORMS[path_];
      prompt = `Character portrait of ${p.creatureName}'s evolution into the ${f.name} form (${path_} path): the creature from the reference image now bigger and ${f.look}. ${detail.detail} ${keep} Full body, centered, on a ${f.colour} sky background. ${STYLE}`;
    } else {
      const f = PATH_FORMS[path_];
      prompt = `Character portrait of ${p.creatureName}'s final LEGENDARY form, the Legendary ${f.name}: the creature from the reference image now majestic and awe-inspiring, radiant glowing aura, ${f.look}, even grander with shimmering sky-light patterns in its fur. ${detail.detail} ${keep} Full body, heroic, centered, epic ${f.colour} sky background with floating islands. ${STYLE}`;
    }
  }
  const img = await generateImage(prompt, "1:1", refs);
  const file = `${key}.png`;
  await saveMedia(p.id, file, img);
  await setJob(p.id, key, { status: "done", file, prompt });
}

// ---------- videos ----------

const VIDEO_SYSTEM = `You write prompts for Seedance 2.5, an AI video model, for a whimsical family-friendly storybook fantasy game set on floating sky islands. Write ONE vivid 10-second cinematic clip: camera moves, action beats in order, lighting, and a sound design line (music style, effects, and at most one short spoken line or creature sound). The clip must feel personal: weave in specific things this player did or said (from the journal and details) so they recognise their own story. Refer to reference images exactly as instructed. Under 110 words. Reply as JSON {"prompt": string}.`;

async function videoPrompt(p: Player, brief: string): Promise<string> {
  const ctx = [
    `Player (the adventurer): ${p.name}. Looks: ${p.adventurerVisual}.`,
    `Creature: ${p.creatureName}. Looks: ${p.creatureVisual}. Personality so far: ${personalitySummary(p.traits)}.`,
    `Creature's favourite food: ${p.favouriteFood || "unknown"}. Biggest fear: ${p.biggestFear || "unknown"}.`,
    `Journal of what the player did so far:\n${journalText(p)}`,
    `The clip to write:\n${brief}`,
  ].join("\n");
  const r = await chatJSON<{ prompt: string }>(VIDEO_SYSTEM, ctx);
  return r.prompt;
}

async function uploadMedia(p: Player, key: string) {
  const m = await readMedia(p, key);
  return uploadFile(m.data, m.mime as "image/png" | "image/jpeg");
}
async function uploadArt(publicPath: string) {
  const m = await readArt(publicPath);
  return uploadFile(m.data, m.mime as "image/png" | "image/jpeg");
}

async function startVideo(p: Player, key: string) {
  let prompt: string;
  let sub;
  if (key === "video_hatch") {
    prompt = await videoPrompt(
      p,
      `The magical hatching moment. It starts on the glowing speckled egg in its mossy nest on a floating island (first frame) and ends on the baby creature ${p.creatureName} (last frame). The egg wobbles, light bursts through cracks, the shell pops and ${p.creatureName} tumbles out, blinks and greets the world in a way that matches the player's description. Gentle, magical, joyful.`,
    );
    const [start, end] = await Promise.all([uploadArt("/art/egg.png"), uploadMedia(p, "portrait_creature_0")]);
    sub = await submitImageToVideo({ prompt, image_url: start, end_image_url: end });
  } else if (key.startsWith("video_evo_")) {
    const k = Number(key.split("_").pop());
    const path_ = p.path ?? topTrait(p.traits);
    const from = formName(k - 1, path_);
    const to = formName(k, path_);
    prompt = await videoPrompt(
      p,
      `Evolution cinematic: ${p.creatureName} transforms from its ${from} form (first frame) into its ${to} form (last frame). A swirl of light shaped by its personality (${personalitySummary(p.traits)}) wraps around it, it grows and changes, then strikes a proud pose. Include a nod to one memorable thing from the journal.`,
    );
    const [start, end] = await Promise.all([uploadMedia(p, `portrait_creature_${k - 1}`), uploadMedia(p, `portrait_creature_${k}`)]);
    sub = await submitImageToVideo({ prompt, image_url: start, end_image_url: end });
  } else if (key.startsWith("video_intro_")) {
    const n = Number(key.split("_").pop());
    const isl = ISLANDS[n - 1];
    const stage = stageForIsland(n);
    const refs = [uploadMedia(p, `portrait_creature_${stage}`), uploadMedia(p, "portrait_adventurer"), uploadArt(isl.scene)];
    if (isl.main.portrait) refs.push(uploadArt(isl.main.portrait));
    const prev = n > 1 ? ISLANDS[n - 2] : null;
    prompt = await videoPrompt(
      p,
      `Island ${n} intro: "${isl.name}". ${isl.setting}\nThe creature ${p.creatureName} (${formName(stage, p.path)} form) is the character in image 1; the adventurer is the character in image 2; the place looks like image 3${
        isl.main.portrait ? `; ${isl.main.name} (${isl.main.what}) is the character in image 4 and appears at the end` : ""
      }.\n${
        prev
          ? `Open with a quick callback to how the player left the previous island (${prev.name}) based on the journal, then fly/arrive at ${isl.name}.`
          : `This is the very first adventure right after hatching: ${p.creatureName}'s first steps and first flight attempt, arriving to meet ${isl.main.name}.`
      } End on an intriguing hint of the island's challenge.`,
    );
    const urls = await Promise.all(refs);
    sub = await submitReferenceVideo({ prompt, image_urls: urls, aspect_ratio: "16:9" });
  } else if (key === "video_ending") {
    const refs = await Promise.all([uploadMedia(p, "portrait_creature_3"), uploadMedia(p, "portrait_adventurer"), uploadArt("/art/scene_10.jpg"), uploadArt("/art/npc_squallbeard.jpg")]);
    prompt = await videoPrompt(
      p,
      `The victory ending movie. The Legendary creature ${p.creatureName} is the character in image 1, the adventurer is image 2, the defeated pirate fortress is image 3 and Captain Squallbeard is image 4. Show how they beat Squallbeard (from the journal), the stolen treasures floating back to the islands, and a triumphant flight across the sky islands with friends they met waving. Epic, emotional, joyful finale.`,
    );
    sub = await submitReferenceVideo({ prompt, image_urls: refs, aspect_ratio: "16:9" });
  } else {
    throw new Error(`Unknown job ${key}`);
  }
  await setJob(p.id, key, { status: "rendering", requestId: sub.request_id, statusUrl: sub.status_url, prompt, lastPoll: Date.now() });
}
