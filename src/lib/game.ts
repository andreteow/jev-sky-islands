import "server-only";
import crypto from "crypto";
import { ISLANDS } from "@/content/islands";
import type { Challenge } from "@/content/types";
import { env } from "./env";
import { judgeMove } from "./ai/jev";
import { chatJSON } from "./ai/openrouter";
import { loadPlayer, updatePlayer } from "./store";
import { currentStage, formName, personalitySummary, stageForIsland, topTrait } from "./forms";
import type { LogEntry, Player, PublicState, Trait, TurnResult } from "./types";
import { TRAITS } from "./types";

export const WORLD =
  "Sky Island Hatchlings: a whimsical, family-friendly world of floating sky islands. Captain Squallbeard and his sky pirates are stealing the Sky Songs that keep the islands afloat. A young adventurer and their newly hatched creature travel island to island to stop him.";

export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function fill(text: string, p: Player) {
  return text.replaceAll("{creature}", p.creatureName || "your creature").replaceAll("{player}", p.name);
}

function entry(p: Player, kind: LogEntry["kind"], text: string, extra: Partial<LogEntry> = {}): LogEntry {
  const ch = currentChallenge(p);
  return { id: crypto.randomBytes(6).toString("hex"), island: p.island, challengeId: ch?.id ?? "", kind, text, at: Date.now(), ...extra };
}

export function currentChallenge(p: Player): Challenge | undefined {
  return ISLANDS[p.island - 1]?.challenges[p.challenge];
}

export const WINS_NEEDED: Record<Challenge["difficulty"], number> = { easy: 1, medium: 2, hard: 2 };

function startChallenge(p: Player) {
  const ch = currentChallenge(p)!;
  p.attempts = 0;
  p.progress = 0;
  p.log.push(entry(p, "setup", fill(ch.setup, p), { speaker: ch.title }));
  p.log.push(entry(p, "npc", fill(ch.openingLine, p), { speaker: ch.npc.name, portrait: ch.npc.portrait }));
}

function startIsland(p: Player) {
  const isl = ISLANDS[p.island - 1];
  p.challenge = 0;
  p.log.push(entry(p, "island", `${isl.name}`, { speaker: isl.tagline }));
  startChallenge(p);
}

// ---------- hatch ----------

export async function hatch(
  playerId: string,
  input: { creatureName: string; creatureDesc: string; adventurerDesc: string; favouriteFood: string; biggestFear: string },
) {
  const clean = (s: string, n: number) => (s || "").toString().trim().slice(0, n);
  const creatureName = clean(input.creatureName, 24);
  const creatureDesc = clean(input.creatureDesc, 400);
  if (!creatureName || creatureDesc.length < 3) throw new Error("Give your creature a name and describe it.");
  const adventurerDesc = clean(input.adventurerDesc, 300);

  // Write the kid-friendly visual descriptions now so both portraits use the same ones.
  const vis = await chatJSON<{ creature: string; adventurer: string }>(
    `You turn a player's own words into short visual descriptions for a family-friendly storybook fantasy game. Keep every detail the player asked for (colours, shape, features) unless it is unsafe; then pick the closest cute alternative. The creature is a small newly hatched baby. Reply as JSON {"creature": string, "adventurer": string}, one or two sentences each, purely visual (no names, no story).`,
    JSON.stringify({ creature_words: creatureDesc, adventurer_words: adventurerDesc || "a young adventurer with an orange scarf and aviator goggles" }),
  ).catch(() => null);

  await updatePlayer(playerId, (p) => {
    if (p.phase !== "hatch") return;
    Object.assign(p, {
      creatureName,
      creatureDesc,
      adventurerDesc,
      favouriteFood: clean(input.favouriteFood, 80),
      biggestFear: clean(input.biggestFear, 80),
      creatureVisual: vis?.creature,
      adventurerVisual: vis?.adventurer,
      phase: "hatching",
    });
  });
}

/** Once the hatchling portrait exists, drop the player onto island 1. */
export async function maybeFinishHatching(playerId: string) {
  const p = await loadPlayer(playerId);
  if (!p || p.phase !== "hatching" || p.jobs.portrait_creature_0?.status !== "done") return;
  await updatePlayer(playerId, (pl) => {
    if (pl.phase !== "hatching") return;
    pl.phase = "playing";
    pl.island = 1;
    startIsland(pl);
  });
}

// ---------- turns ----------

const BASE: Record<Challenge["difficulty"], number> = { easy: 12, medium: 2, hard: -6 };

export function computeChance(
  difficulty: Challenge["difficulty"],
  r: TurnResult["readings"],
  top: Trait | null,
  attempts: number,
): { chance: number; breakdown: TurnResult["breakdown"] } {
  const b: TurnResult["breakdown"] = [];
  b.push({ label: `Starting chance (${difficulty})`, value: BASE[difficulty] });
  b.push({ label: "Would it work? (Jev)", value: Math.round(50 * r.works) });
  b.push({ label: "Fits this character (Jev)", value: Math.round(6 * r.fit) });
  if (top && r.approach === top) b.push({ label: `Matches your creature's ${top} side`, value: 8 });
  if (r.usesCreature > 0.5) b.push({ label: "Teamwork with your creature", value: 6 });
  if (attempts > 0) b.push({ label: "Learning from earlier tries", value: Math.min(12, attempts * 4) });
  if (r.approach === "rude") b.push({ label: "Rudeness", value: -15 });
  let chance = b.reduce((s, x) => s + x.value, 0);
  if (r.impossible > 0.6) {
    b.push({ label: "That's not how this world works", value: 3 - chance });
    chance = 3;
  }
  return { chance: Math.max(3, Math.min(95, Math.round(chance))), breakdown: b };
}

function pointsFor(r: TurnResult["readings"]): Partial<Record<Trait, number>> {
  const pts: Partial<Record<Trait, number>> = {};
  for (const t of TRAITS) {
    const n = Math.round((r.approachProbs[t] ?? 0) * 3);
    if (n > 0) pts[t] = n;
  }
  const rude = Math.round((r.approachProbs.rude ?? 0) * 2);
  if (rude > 0) pts.kind = (pts.kind ?? 0) - rude;
  return pts;
}

export class TurnError extends Error {}

export async function takeTurn(playerId: string, rawText: string) {
  const text = (rawText || "").toString().trim().slice(0, 400);
  if (!text) throw new TurnError("Type what you want to do.");
  const p = await loadPlayer(playerId);
  if (!p) throw new TurnError("Player not found.");
  if (p.phase !== "playing") throw new TurnError("You can't do that right now.");
  const t = today();
  const used = p.turns.date === t ? p.turns.count : 0;
  if (used >= env.dailyTurnLimit) throw new TurnError(`You've used all ${env.dailyTurnLimit} turns for today. Come back tomorrow!`);

  const isl = ISLANDS[p.island - 1];
  const ch = currentChallenge(p)!;
  const recent = p.log
    .filter((e) => e.challengeId === ch.id && (e.kind === "player" || e.kind === "npc" || e.kind === "narration"))
    .slice(-8)
    .map((e) => ({ who: e.kind === "player" ? "player" : e.kind === "npc" ? e.speaker ?? "npc" : "narrator", said: e.text }));

  const readings = await judgeMove({
    world: WORLD,
    island: `${isl.name}: ${isl.setting}`,
    challenge: { title: ch.title, setup: fill(ch.setup, p), goal: fill(ch.goal, p), what_works: fill(ch.whatWorks, p) },
    npc: { name: ch.npc.name, what: ch.npc.what, personality: ch.npc.personality, soft_spot: ch.npc.softSpot, dislikes: ch.npc.dislikes },
    creature: { name: p.creatureName, personality_so_far: personalitySummary(p.traits) },
    recent_conversation: recent,
    player_move: text,
  });

  const anyTraits = TRAITS.some((x) => p.traits[x] > 0);
  const top = anyTraits ? topTrait(p.traits) : null;
  let result: TurnResult;
  if (readings.inappropriate > 0.7) {
    result = { chance: 0, roll: 0, success: false, blocked: true, readings, points: {}, breakdown: [] };
  } else {
    const { chance, breakdown } = computeChance(ch.difficulty, readings, top, p.attempts);
    const roll = crypto.randomInt(1, 101);
    result = { chance, roll, success: roll <= chance, readings, points: pointsFor(readings), breakdown };
  }

  const needed = WINS_NEEDED[ch.difficulty];
  const progressBefore = p.progress ?? 0;
  const completes = result.success && progressBefore + 1 >= needed;
  if (result.success && !completes) result.partial = true;
  const giveHint = !result.success && !result.blocked && p.attempts + 1 >= 3 && (p.attempts + 1) % 3 === 0;
  const isFinal = completes && p.challenge === 2;

  // Luna writes the character's reply and the narration for the outcome Jev + the dice decided.
  const story = await chatJSON<{ npc_line: string; narration: string; creature_reaction: string; journal: string; hint: string }>(
    `You are the narrator of ${WORLD}\nWrite the result of the player's move. The OUTCOME IS ALREADY DECIDED by the dice — never change it. Stay in character, be funny and warm, family friendly, short. The player's creature is ${p.creatureName} (${formName(stageForIsland(p.island), p.path)} form; personality: ${personalitySummary(p.traits)}; favourite food: ${p.favouriteFood || "unknown"}; fear: ${p.biggestFear || "unknown"}). If the move was blocked as inappropriate, the creature gently refuses and suggests trying something else. If the move tried to cheat (impossible powers), make the world gently laugh it off. Reply JSON {"npc_line": string (what ${ch.npc.name} says back, max 2 sentences, may be "" if they would not speak), "narration": string (1-3 sentences, second person, what happens), "creature_reaction": string (a very short action/sound by ${p.creatureName}, e.g. "*Pip puffs up proudly*"), "journal": string (ONLY if the goal is fully reached: one past-tense sentence recording what the player did, naming characters, else ""), "hint": string (ONLY if asked for a hint: ${p.creatureName} gives a gentle nudge in its own voice based on the hint notes, else "")}.`,
    JSON.stringify({
      island: isl.name,
      challenge: { title: ch.title, goal: fill(ch.goal, p), hint_notes: giveHint ? fill(ch.hint, p) : undefined },
      character: ch.npc,
      recent_conversation: recent.slice(-6),
      player_move: text,
      outcome: result.blocked
        ? "BLOCKED (inappropriate)"
        : result.partial
          ? `PARTIAL SUCCESS: it works and ${ch.npc.name} warms up noticeably, but the goal is NOT reached yet (${progressBefore + 1} of ${needed}); end with ${ch.npc.name} needing a bit more convincing`
          : result.success
            ? "SUCCESS: the goal is fully reached"
            : "FAIL",
      cheating: readings.impossible > 0.6,
      move_style: readings.approach,
      is_final_challenge_of_island: isFinal,
      give_hint: giveHint,
    }),
    { maxTokens: 700 },
  ).catch(() => ({
    npc_line: "",
    narration: result.success ? "It works! The way forward opens." : "It doesn't quite work. Maybe try something else?",
    creature_reaction: "",
    journal: result.success ? `${ch.title}: succeeded.` : "",
    hint: giveHint ? fill(ch.hint, p) : "",
  }));

  const { player } = await updatePlayer(playerId, (pl) => {
    if (pl.phase !== "playing" || currentChallenge(pl)?.id !== ch.id) throw new TurnError("The game moved on — refresh.");
    pl.turns = { date: t, count: (pl.turns.date === t ? pl.turns.count : 0) + 1 };
    pl.log.push(entry(pl, "player", text, { speaker: pl.name, result }));
    if (story.npc_line) pl.log.push(entry(pl, "npc", story.npc_line, { speaker: ch.npc.name, portrait: ch.npc.portrait }));
    if (story.narration) pl.log.push(entry(pl, "narration", story.narration));
    if (story.creature_reaction) pl.log.push(entry(pl, "creature", story.creature_reaction, { speaker: pl.creatureName }));
    for (const [k, v] of Object.entries(result.points)) pl.traits[k as Trait] = Math.max(0, pl.traits[k as Trait] + (v ?? 0));
    if (result.partial) {
      pl.progress = progressBefore + 1;
    } else if (result.success) {
      pl.journal.push({ island: pl.island, challengeId: ch.id, text: story.journal || `${ch.title}: ${text}` });
      if (pl.challenge < 2) {
        pl.challenge += 1;
        startChallenge(pl);
      } else {
        pl.phase = "island_complete";
        if ([3, 6, 10].includes(pl.island)) pl.pendingEvolution = pl.island === 3 ? 1 : pl.island === 6 ? 2 : 3;
      }
    } else if (!result.blocked) {
      pl.attempts += 1;
      if (giveHint) pl.log.push(entry(pl, "hint", story.hint || fill(ch.hint, pl), { speaker: pl.creatureName }));
    }
  });
  return { result, player };
}

/** Leave the island-complete screen: move to the next island (or finish the game). */
export async function advance(playerId: string) {
  await updatePlayer(playerId, (p) => {
    if (p.phase !== "island_complete") return;
    p.pendingEvolution = undefined;
    if (p.island >= 10) {
      p.phase = "finished";
      return;
    }
    p.island += 1;
    p.phase = "playing";
    startIsland(p);
  });
}

export async function markSeen(playerId: string, key: string) {
  await updatePlayer(playerId, (p) => {
    if (!p.seen.includes(key)) p.seen.push(key);
  });
}

// ---------- public view ----------

export function toPublic(p: Player): PublicState {
  const url = (file?: string) => (file ? `/api/media/${p.id}/${file}` : undefined);
  const stage = p.phase === "hatch" || p.phase === "hatching" ? 0 : currentStage(p);
  // Show the newest finished portrait at or below the current stage.
  let portrait: string | undefined;
  for (let k = stage; k >= 0; k--) {
    const j = p.jobs[`portrait_creature_${k}`];
    if (j?.status === "done") {
      portrait = url(j.file);
      break;
    }
  }
  const t = today();
  const used = p.turns.date === t ? p.turns.count : 0;
  const jobs: PublicState["jobs"] = {};
  for (const j of Object.values(p.jobs)) jobs[j.key] = { key: j.key, kind: j.kind, status: j.status, url: url(j.file), error: j.error };
  return {
    player: {
      name: p.name,
      creatureName: p.creatureName,
      phase: p.phase,
      island: p.island,
      challenge: p.challenge,
      attempts: p.attempts,
      progress: p.progress ?? 0,
      winsNeeded: (() => {
        const c = currentChallenge(p);
        return c ? WINS_NEEDED[c.difficulty] : 1;
      })(),
      traits: p.traits,
      path: p.path,
      stage,
      formName: formName(stage, p.path),
      portrait,
      adventurerPortrait: url(p.jobs.portrait_adventurer?.file),
      turnsLeft: Math.max(0, env.dailyTurnLimit - used),
      turnLimit: env.dailyTurnLimit,
      pendingEvolution: p.pendingEvolution,
    },
    log: p.log.slice(-160),
    journal: p.journal,
    jobs,
    seen: p.seen,
    videosEnabled: env.videosEnabled,
  };
}
