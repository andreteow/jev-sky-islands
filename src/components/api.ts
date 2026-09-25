import type { PublicState, TurnResult } from "@/lib/types";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function req<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Something went wrong (${res.status})`, res.status);
  return data as T;
}

export const api = {
  state: () => req<PublicState>("/api/state"),
  login: (name: string, code: string) => req<{ ok: true }>("/api/login", { name, code }),
  logout: () => req<{ ok: true }>("/api/logout", {}),
  hatch: (b: { creatureName: string; creatureDesc: string; adventurerDesc: string; favouriteFood: string; biggestFear: string }) =>
    req<PublicState>("/api/hatch", b),
  turn: (text: string) => req<{ result: TurnResult; state: PublicState }>("/api/turn", { text }),
  advance: () => req<PublicState>("/api/advance", {}),
  seen: (key: string) => req<{ ok: true }>("/api/seen", { key }),
};

export interface VideoSlot {
  key: string;
  label: string;
  poster: string;
}

export function videoSlots(islands: { n: number; name: string; scene: string }[]): VideoSlot[] {
  const evoNames = ["", "Evolution: Explorer", "Evolution: Final form", "Evolution: Legendary"];
  return [
    { key: "video_hatch", label: "The Hatching", poster: "/art/egg.jpg" },
    ...islands.flatMap((i) => {
      const s: VideoSlot[] = [{ key: `video_intro_${i.n}`, label: `Island ${i.n}: ${i.name}`, poster: i.scene }];
      const k = i.n === 3 ? 1 : i.n === 6 ? 2 : i.n === 10 ? 3 : 0;
      if (k) s.push({ key: `video_evo_${k}`, label: evoNames[k], poster: i.scene });
      return s;
    }),
    { key: "video_ending", label: "The Ending", poster: "/art/scene_10.jpg" },
  ];
}
