import { after } from "next/server";
import { currentPlayer, errorResponse, unauthorized } from "@/lib/auth";
import { hatch, toPublic } from "@/lib/game";
import { syncJobs } from "@/lib/media";
import { loadPlayer } from "@/lib/store";

export const maxDuration = 300;

export async function POST(req: Request) {
  const me = await currentPlayer();
  if (!me) return unauthorized();
  try {
    await hatch(me.id, await req.json());
    after(() => syncJobs(me.id)); // e.g. reaching a finale challenge starts the next island's media
    return Response.json(toPublic((await loadPlayer(me.id))!));
  } catch (e) {
    return errorResponse(e);
  }
}
