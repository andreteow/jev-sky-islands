import { ISLANDS } from "@/content/islands";
import Game from "@/components/Game";
import type { IslandInfo } from "@/components/types";

// Only what the player is allowed to see (no referee notes or soft spots).
const islands: IslandInfo[] = ISLANDS.map((i) => ({
  n: i.n,
  name: i.name,
  tagline: i.tagline,
  scene: i.scene,
  main: { name: i.main.name, what: i.main.what, portrait: i.main.portrait },
  challenges: i.challenges.map((c) => ({ id: c.id, title: c.title, goal: c.goal, npc: { name: c.npc.name, portrait: c.npc.portrait } })),
}));

export default function Page() {
  return <Game islands={islands} />;
}
