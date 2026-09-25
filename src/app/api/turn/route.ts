import { after } from "next/server";
import { currentPlayer, errorResponse, unauthorized } from "@/lib/auth";
import { TurnError, takeTurn, toPublic } from "@/lib/game";
import { syncJobs } from "@/lib/media";
import { loadPlayer } from "@/lib/store";

export const maxDuration = 300;

export async function POST(req: Request) {
  const me = await currentPlayer();
  if (!me) return unauthorized();
  try {
    const { text } = (await req.json()) as { text: string };
    const { result } = await takeTurn(me.id, text);
    after(() => syncJobs(me.id)); // e.g. reaching a finale challenge starts the next island's media
    return Response.json({ result, state: toPublic((await loadPlayer(me.id))!) });
  } catch (e) {
    if (!(e instanceof TurnError)) console.error("[turn]", e);
    return errorResponse(e instanceof TurnError ? e : new Error("The sky spirits hiccupped. Try that again in a moment."), e instanceof TurnError ? 400 : 502);
  }
}
