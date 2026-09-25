import "server-only";

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name} in .env.local`);
  return v;
}

export const env = {
  get openrouterKey() {
    return need("OPENROUTER_API_KEY");
  },
  get typesafeKey() {
    return need("TYPESAFE_API_KEY");
  },
  get higgsfieldKey() {
    return need("HIGGSFIELD_API_KEY");
  },
  get inviteCode() {
    // SKYPIP is only a local-computer default; online deployments must set their own secret code.
    if (process.env.INVITE_CODE) return process.env.INVITE_CODE;
    if (process.env.VERCEL) throw new Error("INVITE_CODE is not set");
    return "SKYPIP";
  },
  get dailyTurnLimit() {
    return Number(process.env.DAILY_TURN_LIMIT || 120);
  },
  /** Set NO_VIDEO=1 to show stills instead of making Seedance videos (saves credits while developing). */
  get videosEnabled() {
    return process.env.NO_VIDEO !== "1";
  },
};

export const MODELS = {
  text: "openai/gpt-6-luna",
  image: "openai/gpt-5.4-image-2",
  jev: "jev-latest",
  videoRef: "bytedance/seedance-2.5/reference-to-video",
  videoI2V: "bytedance/seedance-2.5/image-to-video",
} as const;
