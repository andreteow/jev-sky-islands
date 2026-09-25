"use client";

import type { PublicState } from "@/lib/types";
import type { IslandInfo } from "./types";

export default function Ending({ state, islands, onPlay, onReel }: { state: PublicState; islands: IslandInfo[]; onPlay: (key: string) => void; onReel: () => void }) {
  const p = state.player;
  const ending = state.jobs.video_ending;
  const legendary = state.jobs.portrait_creature_3;
  const traits = Object.entries(p.traits).sort((a, b) => b[1] - a[1]);
  return (
    <main className="ending" style={{ backgroundImage: "url(/art/hero.jpg)" }}>
      <div className="ending-card">
        <span className="eyebrow">The Sky Songs are free</span>
        <h1>You did it, {p.name}!</h1>
        <div className="ending-hero">
          {legendary?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={legendary.url} alt={`${p.creatureName}, legendary form`} />
          ) : (
            <span className="evo-pending">
              <span className="spinner" /> Drawing {p.creatureName}&rsquo;s legendary form…
            </span>
          )}
          <div>
            <h2>{p.creatureName}</h2>
            <p className="form-name">{p.formName}</p>
            <ul className="trait-summary">
              {traits.map(([t, v]) => (
                <li key={t}>
                  <span className={`chip t-${t}`}>{t}</span> {v}
                </li>
              ))}
            </ul>
            {ending?.status === "done" && ending.url ? (
              <button className="btn big" type="button" onClick={() => onPlay("video_ending")}>
                ▶ Watch your ending movie
              </button>
            ) : state.videosEnabled ? (
              <p className="fine">
                <span className="spinner" /> Your personal ending movie is being made from everything you did. It takes a few minutes, so stay on this page.
              </p>
            ) : null}
            <button className="btn ghost" type="button" onClick={onReel}>
              🎬 All your movies
            </button>
          </div>
        </div>
        <h3 className="sub">Your journey</h3>
        <ol className="journey">
          {islands.map((i) => (
            <li key={i.n}>
              <b>{i.name}</b>
              <ul>
                {state.journal
                  .filter((j) => j.island === i.n)
                  .map((j) => (
                    <li key={j.challengeId}>{j.text}</li>
                  ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
