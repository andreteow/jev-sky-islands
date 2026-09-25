import "server-only";
import { env, MODELS } from "../env";
import type { Approach, Readings } from "../types";

const URL = "https://api.typesafe.ai/v1/systemone";

type Answer =
  | { type: "noul"; noul: number }
  | { type: "choice"; choice: string; confidence: number; probabilities: Record<string, number> }
  | { type: "score"; score: number; confidence: number; probabilities: Record<string, number> };

const QUESTIONS = {
  works: {
    type: "noul",
    instructions:
      "Given the situation in `challenge`, who `npc` is (their personality, soft spot and dislikes) and what has already happened in `recent_conversation`, would `player_move` plausibly achieve `challenge.goal`? Use `challenge.what_works` as the referee's notes.",
    criteria: {
      true: "This move would plausibly succeed at the goal with this character in this situation",
      false: "This move would likely fail, backfire, or does not really address the goal",
    },
  },
  approach: {
    type: "choice",
    instructions: "Which style best describes how the player tries to reach the goal in `player_move`?",
    criteria: {
      kind: "Gentle, generous, friendly, helpful or caring",
      sneaky: "Tricking, bluffing, distracting, sneaking or deceiving",
      brave: "Bold, daring, confident, standing their ground or taking a risk",
      silly: "Goofy, absurd, playful, joking or performing",
      rude: "Insulting, mean, bullying or disrespectful",
    },
  },
  fit: {
    type: "score",
    instructions: "How cleverly is `player_move` tailored to this specific character and situation (their soft spot, dislikes and what is going on)?",
    criteria: [
      "Generic, or ignores who the character is",
      "Somewhat tailored to the character",
      "Clearly uses something specific about the character or situation",
      "Very clever, uses the character's personality and situation perfectly",
    ],
  },
  impossible: {
    type: "noul",
    instructions:
      "Does `player_move` try to skip the challenge by declaring impossible or unfair things, such as teleporting, suddenly having magic powers or items the player was never given, instantly winning, controlling someone's mind, or deciding the other character's reaction for them?",
    criteria: {
      true: "The move cheats by declaring an impossible ability, item or outcome",
      false: "The move is an attempt the player could really make in this world",
    },
  },
  uses_creature: {
    type: "noul",
    instructions: "Does `player_move` have `creature.name` (the player's companion creature) actively help?",
  },
  inappropriate: {
    type: "noul",
    instructions:
      "Is `player_move` inappropriate for a family-friendly game, e.g. sexual content, slurs, graphic violence or real-world cruelty? Mild cartoon rudeness or silly insults are NOT inappropriate.",
  },
} as const;

export interface JudgeInput {
  world: string;
  island: string;
  challenge: { title: string; setup: string; goal: string; what_works: string };
  npc: { name: string; what: string; personality: string; soft_spot: string; dislikes: string };
  creature: { name: string; personality_so_far: string };
  recent_conversation: { who: string; said: string }[];
  player_move: string;
}

export async function judgeMove(state: JudgeInput): Promise<Readings & { inappropriate: number }> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${env.typesafeKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ state, model: MODELS.jev, questions: QUESTIONS }),
        signal: AbortSignal.timeout(30_000),
      });
      const text = await res.text();
      if (!res.ok) throw new Error(`Jev ${res.status}: ${text.slice(0, 300)}`);
      const a = (JSON.parse(text) as { answers: Record<string, Answer> }).answers;
      const noul = (k: string) => (a[k]?.type === "noul" ? (a[k] as { noul: number }).noul : 0);
      const appr = a.approach as Extract<Answer, { type: "choice" }>;
      const fit = a.fit as Extract<Answer, { type: "score" }>;
      return {
        works: noul("works"),
        approach: appr.choice as Approach,
        approachProbs: appr.probabilities as Readings["approachProbs"],
        fit: fit.score,
        impossible: noul("impossible"),
        usesCreature: noul("uses_creature"),
        inappropriate: noul("inappropriate"),
      };
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
