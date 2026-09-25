"use client";

import { useEffect, useState } from "react";
import type { TurnResult } from "@/lib/types";

export type MeterPhase = "idle" | "judging" | "meter" | "dice" | "done";

const APPROACH_LABEL: Record<string, string> = { kind: "Kind", sneaky: "Sneaky", brave: "Brave", silly: "Silly", rude: "Rude" };

function reduced() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function Meter({ result, phase, npcName }: { result: TurnResult | null; phase: MeterPhase; npcName: string }) {
  const [shown, setShown] = useState(0);
  const [die, setDie] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  // Count the percentage up while the bar fills.
  useEffect(() => {
    if (!result || phase === "judging" || phase === "idle") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset between turns
      setShown(0);
      return;
    }
    if (phase !== "meter" || reduced()) {
      setShown(result.chance);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      setShown(Math.round(result.chance * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [result, phase]);

  // Tumble the die, then land on the real roll.
  useEffect(() => {
    if (!result || phase === "judging" || phase === "idle" || phase === "meter") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset between turns
      setDie(null);
      return;
    }
    if (phase !== "dice" || reduced()) {
      setDie(result.roll);
      return;
    }
    const t = setInterval(() => setDie(1 + Math.floor(Math.random() * 100)), 70);
    return () => clearInterval(t);
  }, [result, phase]);

  const r = result;
  const showFill = r && phase !== "judging" && phase !== "idle";
  const landed = r && phase === "done";

  return (
    <section className={`meter-panel ${landed ? (r.success ? "win" : r.blocked ? "" : "lose") : ""}`} aria-label="Jev Meter">
      <div className="meter-head">
        <span className="lbl">Jev Meter</span>
        <span className="pct">{phase === "judging" ? "…" : r && !r.blocked ? `${shown}%` : "–"}</span>
      </div>
      <div className="meter">
        <div className="fill" style={{ width: showFill && !r.blocked ? `${r.chance}%` : "0%" }} />
        <div className="ticks" />
        {die !== null && r && !r.blocked && <div className={`rollmark ${phase === "dice" ? "moving" : ""}`} style={{ left: `calc(${die}% - 2px)` }} />}
      </div>
      <div className="meter-foot">
        {phase === "idle" && !r && <span className="muted">Type a move. Jev works out your chance of success against {npcName}.</span>}
        {phase === "judging" && <span className="judging">Jev is judging your move…</span>}
        {r && phase !== "judging" && !r.blocked && (
          <>
            <span className="die" aria-label="Dice roll">🎲 {die ?? "?"}</span>
            {landed && <span className={`verdict ${r.success ? "win" : "lose"}`}>{r.partial ? "PROGRESS ★" : r.success ? "SUCCESS!" : "Not this time"}</span>}
          </>
        )}
        {r && r.blocked && landed && <span className="verdict lose">Let&rsquo;s keep it friendly. Try something else!</span>}
      </div>
      {r && landed && !r.blocked && (
        <>
          <div className="readings">
            <div>
              <span className="q">Would it work?</span>
              <span className="a">{Math.round(r.readings.works * 100)}%</span>
            </div>
            <div>
              <span className="q">Style</span>
              <span className="a">{APPROACH_LABEL[r.readings.approach] ?? r.readings.approach}</span>
            </div>
            <div>
              <span className="q">Fit (0–3)</span>
              <span className="a">{r.readings.fit.toFixed(1)}</span>
            </div>
          </div>
          <div className="points">
            {Object.entries(r.points).map(([t, v]) => (
              <span key={t} className={`chip t-${t}`}>
                {v! > 0 ? "+" : ""}
                {v} {APPROACH_LABEL[t]}
              </span>
            ))}
          </div>
          <button className="linkish" type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
            {open ? "Hide" : "How was this worked out?"}
          </button>
          {open && (
            <ul className="breakdown">
              {r.breakdown.map((b) => (
                <li key={b.label}>
                  <span>{b.label}</span>
                  <b>
                    {b.value > 0 ? "+" : ""}
                    {b.value}
                  </b>
                </li>
              ))}
              <li className="total">
                <span>Chance (kept between 3 and 95)</span>
                <b>{r.chance}%</b>
              </li>
              <li>
                <span>You rolled (need {r.chance} or lower)</span>
                <b>{r.roll}</b>
              </li>
            </ul>
          )}
        </>
      )}
    </section>
  );
}
