import { after } from "next/server";
import { currentPlayer, unauthorized } from "@/lib/auth";
import { advance, toPublic } from "@/lib/game";
import { syncJobs } from "@/lib/media";
import { loadPlayer } from "@/lib/store";

export const maxDuration = 300;

export async function POST() {
  const me = await currentPlayer();
  if (!me) return unauthorized();
  await advance(me.id);
  after(() => syncJobs(me.id)); // e.g. reaching a finale challenge starts the next island's media
  return Response.json(toPublic((await loadPlayer(me.id))!));
}
