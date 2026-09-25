"use client";

import { useState } from "react";
import type { PublicState } from "@/lib/types";
import type { IslandInfo } from "./types";
import { formName } from "@/lib/forms";

export default function IslandComplete({
  state,
  islands,
  onPlay,
  onContinue,
}: {
  state: PublicState;
  islands: IslandInfo[];
  onPlay: (key: string) => void;
  onContinue: () => Promise<void>;
}) {
  const p = state.player;
  const isl = islands[p.island - 1];
  const next = islands[p.island];
  const [going, setGoing] = useState(false);
  const k = p.pendingEvolution;
  const before = k ? state.jobs[`portrait_creature_${k - 1}`] : undefined;
  const after = k ? state.jobs[`portrait_creature_${k}`] : undefined;
  const evoVideo = k ? state.jobs[`video_evo_${k}`] : undefined;
  const entries = state.journal.filter((j) => j.island === p.island);
  const evoReady = !k || after?.status === "done";

  return (
    <div className="modal complete" role="dialog" aria-modal="true" aria-label={`${isl.name} complete`}>
      <div className="modal-card">
        <span className="eyebrow">Island {p.island} complete</span>
        <h2>{isl.name} ✓</h2>
        <ul className="journal">
          {entries.map((j) => (
            <li key={j.challengeId}>{j.text}</li>
          ))}
        </ul>

        {k && (
          <section className="evolution">
            <h3>{p.creatureName} is evolving!</h3>
            <div className="evo-pair">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {before?.url && <img src={before.url} alt="Before" />}
              <span className="evo-arrow">➜</span>
              {after?.status === "done" && after.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="evo-new" src={after.url} alt="After" />
              ) : (
                <span className="evo-pending">
                  <span className="spinner" />
                  Transforming…
                </span>
              )}
            </div>
            <p className="evo-name">
              {after?.status === "done" ? (
                <>
                  New form: <b>{formName(k, p.path)}</b>
                  {k >= 2 && p.path && <> · shaped by your {p.path} side</>}
                </>
              ) : (
                "Your creature's new look is being drawn. This takes about a minute."
              )}
            </p>
            {evoVideo?.status === "done" && evoVideo.url ? (
              <button className="btn ghost" type="button" onClick={() => onPlay(`video_evo_${k}`)}>
                ▶ Watch the evolution movie
              </button>
            ) : state.videosEnabled ? (
              <p className="fine">🎬 The evolution movie is being made. It will appear in your Movies when it&rsquo;s ready.</p>
            ) : null}
          </section>
        )}

        <button
          className="btn big"
          type="button"
          disabled={going || !evoReady}
          onClick={async () => {
            setGoing(true);
            try {
              await onContinue();
            } finally {
              setGoing(false);
            }
          }}
        >
          {!evoReady ? "Waiting for the evolution…" : next ? `Fly to island ${next.n}: ${next.name} ▶` : "See the ending ▶"}
        </button>
      </div>
    </div>
  );
}
