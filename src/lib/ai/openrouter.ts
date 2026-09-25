import "server-only";
import { env, MODELS } from "../env";

const URL = "https://openrouter.ai/api/v1/chat/completions";

async function post(body: unknown, timeoutMs: number) {
  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.openrouterKey}`,
      "Content-Type": "application/json",
      "X-Title": "Sky Island Hatchlings",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

/** Ask GPT-6 Luna for a JSON object. Retries once on bad JSON or a network error. */
export async function chatJSON<T>(system: string, user: string, opts: { maxTokens?: number } = {}): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await post(
        {
          model: MODELS.text,
          response_format: { type: "json_object" },
          max_tokens: opts.maxTokens ?? 900,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        },
        60_000,
      );
      const content: string = r.choices?.[0]?.message?.content ?? "";
      const start = content.indexOf("{");
      const end = content.lastIndexOf("}");
      return JSON.parse(content.slice(start, end + 1)) as T;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

/** Generate one image with GPT Image 2. `refs` are PNG/JPEG buffers used as visual references. */
export async function generateImage(prompt: string, aspect: "1:1" | "16:9", refs: { data: Buffer; mime: string }[] = []): Promise<Buffer> {
  const content: unknown[] = [{ type: "text", text: prompt }];
  for (const r of refs) {
    content.push({ type: "image_url", image_url: { url: `data:${r.mime};base64,${r.data.toString("base64")}` } });
  }
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await post(
        {
          model: MODELS.image,
          modalities: ["image", "text"],
          image_config: { aspect_ratio: aspect },
          messages: [{ role: "user", content }],
        },
        300_000,
      );
      const url: string | undefined = r.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (!url) throw new Error(`No image returned: ${JSON.stringify(r).slice(0, 300)}`);
      return Buffer.from(url.split(",", 2)[1], "base64");
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}
