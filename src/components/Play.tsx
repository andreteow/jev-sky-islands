"use client";

import { useEffect, useRef, useState } from "react";
import type { LogEntry, PublicState, TurnResult } from "@/lib/types";
import { api } from "./api";
import Meter, { type MeterPhase } from "./Meter";
import type { IslandInfo } from "./types";

const TRAIT_META = [
  { key: "kind", label: "Kind" },
  { key: "sneaky", label: "Sneaky" },
  { key: "brave", label: "Brave" },
  { key: "silly", label: "Silly" },
] as const;

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Props {
  state: PublicState;
  islands: IslandInfo[];
  onState: (s: PublicState) => void;
  onBusy: (b: boolean) => void;
  onOpenReel: () => void;
  onOpenMap: () => void;
  onPlayClip: (key: string) => void;
  onLogout: () => void;
}

export default function Play({ state, islands, onState, onBusy, onOpenReel, onOpenMap, onPlayClip, onLogout }: Props) {
  const p = state.player;
  const isl = islands[p.island - 1];
  const ch = isl.challenges[Math.min(p.challenge, 2)];
  const [text, setText] = useState("");
  const [phase, setPhase] = useState<MeterPhase>("idle");
  const [result, setResult] = useState<TurnResult | null>(null);
  const [pendingMove, setPendingMove] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [state.log.length, pendingMove]);

  async function submit(e?: React.FormEvent) {
    e?.preventDefault();
    const move = text.trim();
    if (!move || phase === "judging" || phase === "meter" || phase === "dice") return;
    setErr("");
    setPendingMove(move);
    setText("");
    setResult(null);
    setPhase("judging");
    onBusy(true);
    try {
      const { result: r, state: next } = await api.turn(move);
      setResult(r);
      if (!r.blocked) {
        setPhase("meter");
        await wait(1300);
        setPhase("dice");
        await wait(1200);
      }
      setPhase("done");
      await wait(r.success ? 700 : 300);
      setPendingMove(null);
      onState(next);
      setPhase("idle");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
      setText(move);
      setPendingMove(null);
      setPhase("idle");
    } finally {
      onBusy(false);
      inputRef.current?.focus();
    }
  }

  const islandLog = state.log.filter((e) => e.island === p.island);
  const maxTrait = Math.max(8, ...Object.values(p.traits));
  const intro = state.jobs[`video_intro_${p.island}`];
  const introReady = intro?.status === "done" && intro.url;
  const newMovies = Object.values(state.jobs).filter((j) => j.kind === "video" && j.status === "done" && j.url && !state.seen.includes(j.key)).length;
  const working = phase === "judging" || phase === "meter" || phase === "dice";
  // Between turns, the meter shows the latest move on record (also after a reload or a turn on another device).
  const lastLogged = [...state.log].reverse().find((e) => e.kind === "player" && e.result)?.result ?? null;
  const meterResult = working || phase === "done" ? result : lastLogged;
  const meterPhase: MeterPhase = working ? phase : meterResult ? "done" : "idle";

  return (
    <main className="play">
      <header className="topbar">
        <div className="brand">Sky Island Hatchlings</div>
        <ol className="dots" aria-label={`Island ${p.island} of 10`}>
          {islands.map((i) => (
            <li key={i.n} className={i.n < p.island ? "done" : i.n === p.island ? "here" : ""} title={i.n <= p.island ? i.name : `Island ${i.n}`} />
          ))}
        </ol>
        <div className="top-actions">
          <span className="turns" title="Turns left today">
            ⚡ {p.turnsLeft}/{p.turnLimit}
          </span>
          <button className="pill" type="button" onClick={onOpenMap}>
            🗺 Map
          </button>
          <button className="pill" type="button" onClick={onOpenReel}>
            🎬 Movies{newMovies > 0 && <span className="badge">{newMovies}</span>}
          </button>
          <button className="pill ghost" type="button" onClick={onLogout} title="Sign out">
            ⎋
          </button>
        </div>
      </header>

      <div className="play-grid">
        <section className="stage">
          <div className="scene" style={{ backgroundImage: `url(${isl.scene})` }}>
            <div className="scene-shade" />
            <div className="scene-top">
              <span className="island-tag">Island {p.island} · {isl.name}</span>
              {introReady ? (
                <button className="pill glass" type="button" onClick={() => onPlayClip(`video_intro_${p.island}`)}>
                  ▶ Island movie
                </button>
              ) : state.videosEnabled && intro && intro.status !== "failed" ? (
                <span className="pill glass">⏳ Island movie is filming…</span>
              ) : null}
            </div>
            <div className="scene-bottom">
              {ch.npc.portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="npc" src={ch.npc.portrait} alt={ch.npc.name} />
              ) : (
                <span className="npc npc-initial">{ch.npc.name.slice(0, 1)}</span>
              )}
              <div className="goal-card">
                <span className="eyebrow">
                  Challenge {p.challenge + 1} of 3 · {ch.title}
                </span>
                <p>{ch.goal}</p>
                {p.winsNeeded > 1 && (
                  <span className="stars" aria-label={`${p.progress} of ${p.winsNeeded} successes`}>
                    {Array.from({ length: p.winsNeeded }, (_, i) => (
                      <span key={i} className={i < p.progress ? "on" : ""}>★</span>
                    ))}
                    <small>{p.progress === 0 ? `Needs ${p.winsNeeded} successes` : "Almost there!"}</small>
                  </span>
                )}
                {p.attempts > 0 && <small>{p.attempts} {p.attempts === 1 ? "try" : "tries"} so far. Each try raises your chance a little.</small>}
              </div>
            </div>
          </div>

          <div className="log" ref={logRef} aria-live="polite">
            {islandLog.map((e) => (
              <LogItem key={e.id} e={e} state={state} />
            ))}
            {pendingMove && (
              <div className="msg player pending">
                <div className="bubble">
                  <span className="who">{p.name}</span>
                  {pendingMove}
                </div>
              </div>
            )}
          </div>

          <form className="composer" onSubmit={submit}>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submit();
                }
              }}
              placeholder={`What do you do or say? Anything goes… (${p.creatureName} can help too)`}
              maxLength={400}
              rows={2}
              disabled={working || p.turnsLeft <= 0}
              aria-label="Your move"
            />
            <button className="btn" type="submit" disabled={working || !text.trim() || p.turnsLeft <= 0}>
              {working ? "…" : "Try it"}
            </button>
          </form>
          {err && <p className="form-error">{err}</p>}
          {p.turnsLeft <= 0 && <p className="form-error">You&rsquo;ve used all your turns for today. {p.creatureName} is taking a nap. Come back tomorrow!</p>}
        </section>

        <aside className="side">
          <Meter result={meterResult} phase={meterPhase} npcName={ch.npc.name} />

          <section className="creature-card">
            <div className="creature-top">
              {p.portrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.portrait} alt={p.creatureName} />
              ) : (
                <span className="creature-placeholder">🥚</span>
              )}
              <div>
                <h2>{p.creatureName}</h2>
                <span className="form-name">{p.formName} form</span>
                <small className="muted">{nextEvolution(p.island)}</small>
              </div>
            </div>
            <ul className="traits">
              {TRAIT_META.map((t) => (
                <li key={t.key}>
                  <span>{t.label}</span>
                  <span className="bar">
                    <span className={`bar-fill t-${t.key}`} style={{ width: `${(100 * p.traits[t.key]) / maxTrait}%` }} />
                  </span>
                  <b>{p.traits[t.key]}</b>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  );
}

function nextEvolution(island: number) {
  if (island <= 3) return `Evolves after island 3`;
  if (island <= 6) return `Your play style decides its form after island 6`;
  return `Legendary form after island 10`;
}

function LogItem({ e, state }: { e: LogEntry; state: PublicState }) {
  const p = state.player;
  switch (e.kind) {
    case "island":
      return (
        <div className="msg island">
          <span className="eyebrow">Island {e.island}</span>
          <h3>{e.text}</h3>
          <p>{e.speaker}</p>
        </div>
      );
    case "setup":
      return (
        <div className="msg setup">
          <span className="chip">{e.speaker}</span>
          <p>{e.text}</p>
        </div>
      );
    case "npc":
      return (
        <div className="msg from-npc">
          {e.portrait ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="avatar" src={e.portrait} alt="" />
          ) : (
            <span className="avatar initial">{(e.speaker ?? "?").slice(0, 1)}</span>
          )}
          <div className="bubble">
            <span className="who">{e.speaker}</span>“{e.text}”
          </div>
        </div>
      );
    case "player":
      return (
        <div className="msg player">
          <div className="bubble">
            <span className="who">{e.speaker}</span>
            {e.text}
          </div>
          {e.result && !e.result.blocked && (
            <span className={`roll-chip ${e.result.success ? "win" : "lose"}`}>
              {e.result.chance}% · rolled {e.result.roll} · {e.result.partial ? "progress ★" : e.result.success ? "success" : "missed"}
            </span>
          )}
        </div>
      );
    case "narration":
      return <p className="msg narration">{e.text}</p>;
    case "creature":
      return (
        <div className="msg creature">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {p.portrait && <img className="avatar small" src={p.portrait} alt="" />}
          <span>{e.text}</span>
        </div>
      );
    case "hint":
      return (
        <div className="msg hint">
          <span className="eyebrow">💡 {e.speaker} has an idea</span>
          <p>{e.text}</p>
        </div>
      );
    default:
      return <p className="msg narration">{e.text}</p>;
  }
}
