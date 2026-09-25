import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { createPlayer } from "@/lib/store";
import { COOKIE } from "@/lib/auth";

export async function POST(req: Request) {
  const { name, code } = (await req.json().catch(() => ({}))) as { name?: string; code?: string };
  const n = (name ?? "").trim();
  if (n.length < 2 || !/[a-z0-9]/i.test(n)) return Response.json({ error: "Type a name (at least 2 letters)." }, { status: 400 });
  if ((code ?? "").trim().toUpperCase() !== env.inviteCode.toUpperCase())
    return Response.json({ error: "That invite code isn't right. Ask whoever invited you." }, { status: 403 });
  const p = await createPlayer(n);
  (await cookies()).set(COOKIE, `${p.id}.${p.token}`, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
  return Response.json({ ok: true });
}
