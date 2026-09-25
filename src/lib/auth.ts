import "server-only";
import { cookies } from "next/headers";
import { loadPlayer } from "./store";
import type { Player } from "./types";

export const COOKIE = "sih_player";

export async function currentPlayer(): Promise<Player | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [id, token] = raw.split(".");
  const p = id ? await loadPlayer(id) : null;
  return p && p.token === token ? p : null;
}

export function unauthorized() {
  return Response.json({ error: "Please sign in." }, { status: 401 });
}

export function errorResponse(e: unknown, status = 400) {
  const msg = e instanceof Error ? e.message : String(e);
  return Response.json({ error: msg }, { status });
}
