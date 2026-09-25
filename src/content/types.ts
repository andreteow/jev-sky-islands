export type Difficulty = "easy" | "medium" | "hard";

export interface Character {
  name: string;
  /** Short "what they are", e.g. "a big bridge troll". */
  what: string;
  /** Visual description used for art and video prompts. */
  look: string;
  personality: string;
  /** What genuinely wins them over. Jev sees this as part of the situation. */
  softSpot: string;
  /** What annoys them or backfires. */
  dislikes: string;
  /** Path under /public, if a portrait exists. */
  portrait?: string;
}

export interface Challenge {
  id: string; // e.g. "2-1"
  title: string;
  /** Who the player is dealing with in this challenge. */
  npc: Character;
  /** Narrator text shown when the challenge starts (2-3 sentences, second person). */
  setup: string;
  /** What the NPC (or situation) says first. */
  openingLine: string;
  /** Plain statement of what the player must achieve. Shown to the player. */
  goal: string;
  /** Extra guidance for the referee about what kinds of moves could plausibly work. Hidden from the player. */
  whatWorks: string;
  /** The hint the creature gives after 3 failed attempts. */
  hint: string;
  difficulty: Difficulty;
}

export interface Island {
  n: number; // 1..10
  name: string;
  tagline: string;
  /** Path under /public for the island background art (16:9). */
  scene: string;
  /** Description of the place for video prompts. */
  setting: string;
  main: Character;
  challenges: [Challenge, Challenge, Challenge];
}
