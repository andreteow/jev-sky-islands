import "server-only";
import { env } from "../env";

const BASE = "https://api.higgsfield.ai";
// Higgsfield sits behind Cloudflare, which rejects requests without a normal-looking user agent.
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) SkyIslandHatchlings/1.0";

function headers() {
  return {
    Authorization: `Key ${env.higgsfieldKey}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": UA,
  };
}

async function call<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url.startsWith("http") ? url : BASE + url, {
    method: body === undefined ? "GET" : "POST",
    headers: headers(),
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(60_000),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Higgsfield ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text) as T;
}

/** Upload a local file so Seedance can read it; returns a public URL. */
export async function uploadFile(data: Buffer, contentType: "image/jpeg" | "image/png"): Promise<string> {
  const up = await call<{ public_url: string; upload_url: string; upload_headers: Record<string, string> }>(
    "/files/generate-upload-url",
    { content_type: contentType },
  );
  const put = await fetch(up.upload_url, { method: "PUT", headers: up.upload_headers, body: new Uint8Array(data) });
  if (!put.ok) throw new Error(`Upload failed ${put.status}`);
  return up.public_url;
}

export interface Submitted {
  request_id: string;
  status_url: string;
}

export function submitReferenceVideo(args: { prompt: string; image_urls: string[]; aspect_ratio?: string; duration?: number }) {
  return call<Submitted>("/bytedance/seedance-2.5/reference-to-video", {
    prompt: args.prompt,
    image_urls: args.image_urls,
    aspect_ratio: args.aspect_ratio ?? "16:9",
    duration: args.duration ?? 10,
    resolution: "720p",
    generate_audio: true,
  });
}

export function submitImageToVideo(args: { prompt: string; image_url: string; end_image_url?: string; duration?: number }) {
  return call<Submitted>("/bytedance/seedance-2.5/image-to-video", {
    prompt: args.prompt,
    image_url: args.image_url,
    ...(args.end_image_url ? { end_image_url: args.end_image_url } : {}),
    duration: args.duration ?? 10,
    resolution: "720p",
    generate_audio: true,
  });
}

export interface RequestStatus {
  status: "queued" | "in_progress" | "nsfw" | "failed" | "completed" | "canceled";
  error?: string | null;
  video?: { url: string };
}

export function getStatus(statusUrl: string) {
  return call<RequestStatus>(statusUrl);
}
