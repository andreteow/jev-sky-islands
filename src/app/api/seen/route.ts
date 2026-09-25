import { currentPlayer, unauthorized } from "@/lib/auth";
import { markSeen } from "@/lib/game";

export async function POST(req: Request) {
  const me = await currentPlayer();
  if (!me) return unauthorized();
  const { key } = (await req.json()) as { key: string };
  if (typeof key === "string" && key.length < 40) await markSeen(me.id, key);
  return Response.json({ ok: true });
}
