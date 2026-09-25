import { promises as fs } from "fs";
import { currentPlayer, unauthorized } from "@/lib/auth";
import { contentTypeOf, localMediaPath, signedMediaUrl, usingCloudStorage } from "@/lib/store";

export async function GET(req: Request, ctx: RouteContext<"/api/media/[id]/[file]">) {
  const { id, file } = await ctx.params;
  const me = await currentPlayer();
  if (!me || me.id !== id) return unauthorized();
  if (!/^[a-z0-9_]+\.(mp4|png|jpg)$/.test(file)) return new Response("Not found", { status: 404 });

  if (usingCloudStorage) {
    // Send the browser straight to a private, time-limited storage link (fast, and supports video seeking).
    const url = await signedMediaUrl(id, file);
    return url ? Response.redirect(url, 302) : new Response("Not found", { status: 404 });
  }

  const full = localMediaPath(id, file);
  let stat;
  try {
    stat = await fs.stat(full);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const type = contentTypeOf(file);
  const range = req.headers.get("range");
  const fh = await fs.open(full, "r");
  try {
    if (range) {
      const m = /bytes=(\d*)-(\d*)/.exec(range);
      const start = m?.[1] ? Number(m[1]) : 0;
      const end = m?.[2] ? Math.min(Number(m[2]), stat.size - 1) : stat.size - 1;
      const buf = Buffer.alloc(end - start + 1);
      await fh.read(buf, 0, buf.length, start);
      return new Response(new Uint8Array(buf), {
        status: 206,
        headers: { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${stat.size}`, "Accept-Ranges": "bytes", "Content-Length": String(buf.length) },
      });
    }
    const buf = await fh.readFile();
    return new Response(new Uint8Array(buf), { headers: { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Length": String(stat.size), "Cache-Control": "private, max-age=3600" } });
  } finally {
    await fh.close();
  }
}
