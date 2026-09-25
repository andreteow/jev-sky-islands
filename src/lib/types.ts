export type Trait = "kind" | "sneaky" | "brave" | "silly";
export type Approach = Trait | "rude";
export const TRAITS: Trait[] = ["kind", "sneaky", "brave", "silly"];

export type Phase = "hatch" | "hatching" | "playing" | "island_complete" | "finished";

export interface Readings {
  works: number; // Jev noul: would this achieve the goal
  approach: Approach;
  approachProbs: Partial<Record<Approach, number>>;
  fit: number; // Jev score 0..3
  impossible: number; // Jev noul
  usesCreature: number; // Jev noul
}

export interface TurnResult {
  chance: number;
  roll: number;
  success: boolean;
  /** Success that moved the challenge forward but didn't finish it yet. */
  partial?: boolean;
  blocked?: boolean; // inappropriate / impossible move
  readings: Readings;
  points: Partial<Record<Trait, number>>;
  breakdown: { label: string; value: number }[];
}

export type LogKind = "setup" | "npc" | "player" | "narration" | "creature" | "hint" | "system" | "island";

export interface LogEntry {
  id: string;
  island: number;
  challengeId: string;
  kind: LogKind;
  text: string;
  speaker?: string;
  portrait?: string;
  result?: TurnResult;
  at: number;
}

export type JobStatus = "preparing" | "rendering" | "done" | "failed";

export interface Job {
  key: string;
  kind: "image" | "video";
  status: JobStatus;
  file?: string; // relative to the player's media folder
  requestId?: string;
  statusUrl?: string;
  prompt?: string;
  error?: string;
  attempts: number;
  createdAt: number;
  updatedAt: number;
  lastPoll?: number;
  meta?: Record<string, unknown>;
}

export interface Player {
  id: string;
  name: string;
  token: string;
  createdAt: number;
  creatureName: string;
  creatureDesc: string;
  adventurerDesc: string;
  favouriteFood: string;
  biggestFear: string;
  /** Kid-friendly visual descriptions written by the text model at hatch time. */
  creatureVisual?: string;
  adventurerVisual?: string;
  phase: Phase;
  island: number; // 1..10
  challenge: number; // 0..2
  attempts: number; // failed tries on the current challenge
  progress?: number; // successes so far on the current challenge
  traits: Record<Trait, number>;
  path?: Trait; // decided at the island-6 evolution
  log: LogEntry[];
  journal: { island: number; challengeId: string; text: string }[];
  turns: { date: string; count: number };
  jobs: Record<string, Job>;
  seen: string[];
  /** Evolution stage waiting to be shown on the island-complete screen. */
  pendingEvolution?: number;
}

export interface PublicJob {
  key: string;
  kind: "image" | "video";
  status: JobStatus;
  url?: string;
  error?: string;
}

export interface PublicState {
  player: {
    name: string;
    creatureName: string;
    phase: Phase;
    island: number;
    challenge: number;
    attempts: number;
    progress: number;
    winsNeeded: number;
    traits: Record<Trait, number>;
    path?: Trait;
    stage: number;
    formName: string;
    portrait?: string;
    adventurerPortrait?: string;
    turnsLeft: number;
    turnLimit: number;
    pendingEvolution?: number;
  };
  log: LogEntry[];
  journal: Player["journal"];
  jobs: Record<string, PublicJob>;
  seen: string[];
  videosEnabled: boolean;
}
