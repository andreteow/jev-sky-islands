import { after } from "next/server";
import { currentPlayer, unauthorized } from "@/lib/auth";
import { maybeFinishHatching, toPublic } from "@/lib/game";
import { pollVideos, syncJobs } from "@/lib/media";
import { loadPlayer } from "@/lib/store";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function GET() {
  const me = await currentPlayer();
  if (!me) return unauthorized();
  await maybeFinishHatching(me.id);
  // Check on movies and start any pictures/movies that are due, after answering the browser.
  after(async () => {
    await pollVideos(me.id);
    await syncJobs(me.id);
  });
  const p = await loadPlayer(me.id);
  return Response.json(toPublic(p!));
}
