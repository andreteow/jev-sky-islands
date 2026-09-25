export interface IslandInfo {
  n: number;
  name: string;
  tagline: string;
  scene: string;
  main: { name: string; what: string; portrait?: string };
  challenges: { id: string; title: string; goal: string; npc: { name: string; portrait?: string } }[];
}
