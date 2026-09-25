import "server-only";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Player } from "./types";

/*
 * Two storage backends with the same interface:
 * - Supabase (when SUPABASE_URL + a service key are set, e.g. on Vercel): table `sih_players`, bucket `sih-media`.
 * - Local files under ./data (for running on your own computer).
 */

const DATA_DIR = path.join(process.cwd(), "data");
const PLAYERS_DIR = path.join(DATA_DIR, "players");
const MEDIA_DIR = path.join(DATA_DIR, "media");
const TABLE = "sih_players";
const BUCKET = "sih-media";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
const g = globalThis as unknown as { __sihSb?: SupabaseClient; __sihLocks?: Map<string, Promise<unknown>> };
const sb: SupabaseClient | null =
  supabaseUrl && supabaseKey ? (g.__sihSb ??= createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })) : null;

export const usingCloudStorage = !!sb;

export function playerIdFromName(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);
  return slug || "player";
}

// ---------- players ----------

function file(id: string) {
  return path.join(PLAYERS_DIR, `${id}.json`);
}

async function readRow(id: string): Promise<{ data: Player; version: number } | null> {
  if (sb) {
    const { data, error } = await sb.from(TABLE).select("data, version").eq("id", id).maybeSingle();
    if (error) throw new Error(`Load failed: ${error.message}`);
    return data ? { data: data.data as Player, version: data.version as number } : null;
  }
  try {
    return { data: JSON.parse(await fs.readFile(file(id), "utf8")) as Player, version: 0 };
  } catch {
    return null;
  }
}

export async function loadPlayer(id: string): Promise<Player | null> {
  return (await readRow(id))?.data ?? null;
}

async function writeLocal(p: Player) {
  await fs.mkdir(PLAYERS_DIR, { recursive: true });
  const tmp = `${file(p.id)}.${crypto.randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(p, null, 1));
  await fs.rename(tmp, file(p.id));
}

const locks = (g.__sihLocks ??= new Map());

/**
 * Read-modify-write one player. `fn` may run more than once (on Supabase, a concurrent write
 * from another server makes us re-read and retry), so it must only change the player object.
 */
export async function updatePlayer<T>(id: string, fn: (p: Player) => T | Promise<T>): Promise<{ player: Player; value: T }> {
  if (sb) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const row = await readRow(id);
      if (!row) throw new Error("Player not found");
      const value = await fn(row.data);
      const { data, error } = await sb
        .from(TABLE)
        .update({ data: row.data, version: row.version + 1, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("version", row.version)
        .select("id");
      if (error) throw new Error(`Save failed: ${error.message}`);
      if (data && data.length === 1) return { player: row.data, value };
      await new Promise((r) => setTimeout(r, 40 + Math.random() * 120 * (attempt + 1)));
    }
    throw new Error("Save conflict, please try again");
  }

  // Local: one queue per player so writes never interleave.
  const prev = locks.get(id) ?? Promise.resolve();
  let release!: () => void;
  const mine = new Promise<void>((r) => (release = r));
  locks.set(id, prev.then(() => mine));
  await prev.catch(() => {});
  try {
    const p = await loadPlayer(id);
    if (!p) throw new Error("Player not found");
    const value = await fn(p);
    await writeLocal(p);
    return { player: p, value };
  } finally {
    release();
    if (locks.get(id) === mine) locks.delete(id);
  }
}

export async function createPlayer(name: string): Promise<Player> {
  const id = playerIdFromName(name);
  const existing = await loadPlayer(id);
  if (existing) return existing;
  const p: Player = {
    id,
    name: name.trim().slice(0, 32),
    token: crypto.randomBytes(18).toString("hex"),
    createdAt: Date.now(),
    creatureName: "",
    creatureDesc: "",
    adventurerDesc: "",
    favouriteFood: "",
    biggestFear: "",
    phase: "hatch",
    island: 1,
    challenge: 0,
    attempts: 0,
    traits: { kind: 0, sneaky: 0, brave: 0, silly: 0 },
    log: [],
    journal: [],
    turns: { date: "", count: 0 },
    jobs: {},
    seen: [],
  };
  if (sb) {
    const { error } = await sb.from(TABLE).upsert({ id, data: p, version: 0 }, { onConflict: "id", ignoreDuplicates: true });
    if (error) throw new Error(`Create failed: ${error.message}`);
    return (await loadPlayer(id))!;
  }
  await writeLocal(p);
  return p;
}

// ---------- media (pictures and videos) ----------

const TYPES: Record<string, string> = { ".mp4": "video/mp4", ".png": "image/png", ".jpg": "image/jpeg" };
export const contentTypeOf = (fileName: string) => TYPES[path.extname(fileName)] ?? "application/octet-stream";

export async function saveMedia(playerId: string, fileName: string, data: Buffer) {
  if (sb) {
    const { error } = await sb.storage.from(BUCKET).upload(`${playerId}/${fileName}`, data, { contentType: contentTypeOf(fileName), upsert: true });
    if (error) throw new Error(`Upload failed: ${error.message}`);
    return;
  }
  await fs.mkdir(path.join(MEDIA_DIR, playerId), { recursive: true });
  await fs.writeFile(path.join(MEDIA_DIR, playerId, fileName), data);
}

export async function readMediaFile(playerId: string, fileName: string): Promise<Buffer> {
  if (sb) {
    const { data, error } = await sb.storage.from(BUCKET).download(`${playerId}/${fileName}`);
    if (error || !data) throw new Error(`Download failed: ${error?.message}`);
    return Buffer.from(await data.arrayBuffer());
  }
  return fs.readFile(path.join(MEDIA_DIR, playerId, fileName));
}

/** Cloud: a short-lived private link the browser can load directly (supports video seeking). */
export async function signedMediaUrl(playerId: string, fileName: string): Promise<string | null> {
  if (!sb) return null;
  const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(`${playerId}/${fileName}`, 60 * 60 * 6);
  if (error || !data) return null;
  return data.signedUrl;
}

export function localMediaPath(playerId: string, fileName: string) {
  return path.join(MEDIA_DIR, playerId, fileName);
}
