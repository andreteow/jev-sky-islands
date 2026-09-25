import type { Player, Trait } from "./types";
import { TRAITS } from "./types";

export const PATH_FORMS: Record<Trait, { name: string; look: string; colour: string }> = {
  kind: {
    name: "Bloomguardian",
    look: "gentle and majestic, wings turned into big petal-feather wings with blossoms, a glowing flower-crown mane, a soft golden aura, little birds happily resting on it",
    colour: "warm peach and gold",
  },
  sneaky: {
    name: "Shadowtrick",
    look: "sleek, fox-like and cunning, deeper fur colours with midnight-blue mask markings around the eyes, swept-back wings worn like a cape, a mischievous half-smile",
    colour: "dusky lavender twilight",
  },
  brave: {
    name: "Stormwing",
    look: "a powerful small dragon-griffin with broad strong wings crackling with tiny sparks, a scarf blowing in the wind, a determined heroic stance",
    colour: "bright sunlit storm",
  },
  silly: {
    name: "Jesterwing",
    look: "bouncy and bursting with mischief, rainbow-tipped curly wings, a floppy jester-like crest with bells, cheeks puffed in a giggle, confetti sparkles around it",
    colour: "candy-bright rainbow",
  },
};

/** Which creature form appears on a given island (evolutions happen after islands 3, 6 and 10). */
export function stageForIsland(n: number): number {
  return n >= 7 ? 2 : n >= 4 ? 1 : 0;
}

export function currentStage(p: Player): number {
  if (p.phase === "finished") return 3;
  return stageForIsland(p.island);
}

export function topTrait(traits: Record<Trait, number>): Trait {
  return [...TRAITS].sort((a, b) => traits[b] - traits[a])[0];
}

export function formName(stage: number, path?: Trait): string {
  if (stage === 0) return "Hatchling";
  if (stage === 1) return "Explorer";
  const f = PATH_FORMS[path ?? "kind"].name;
  return stage === 2 ? f : `Legendary ${f}`;
}

export function personalitySummary(traits: Record<Trait, number>): string {
  const total = TRAITS.reduce((s, t) => s + Math.max(0, traits[t]), 0);
  if (total === 0) return "brand new, no personality yet";
  const parts = [...TRAITS]
    .filter((t) => traits[t] > 0)
    .sort((a, b) => traits[b] - traits[a])
    .map((t) => `${t} ${Math.round((100 * traits[t]) / total)}%`);
  return parts.join(", ");
}
