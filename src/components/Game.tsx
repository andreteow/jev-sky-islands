"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { PublicState } from "@/lib/types";
import { ApiError, api, videoSlots } from "./api";
import type { IslandInfo } from "./types";
import Login from "./Login";
import Hatch, { Reveal } from "./Hatch";
import Play from "./Play";
import Cinema, { type CinemaClip } from "./Cinema";
import IslandComplete from "./IslandComplete";
import Ending from "./Ending";
import Reel from "./Reel";
import MapView from "./MapView";

export default function Game({ islands }: { islands: IslandInfo[] }) {
  const [state, setState] = useState<PublicState | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [cinema, setCinema] = useState<CinemaClip | null>(null);
  const [panel, setPanel] = useState<"reel" | "map" | null>(null);
  const [toasts, setToasts] = useState<{ id: number; text: string; key?: string }[]>([]);
  const [busy, setBusy] = useState(false); // a turn animation is running
  const [reveal, setReveal] = useState(false);
  const prevJobs = useRef<PublicState["jobs"] | null>(null);
  const prevPhase = useRef<string | null>(null);
  const slots = useMemo(() => videoSlots(islands), [islands]);
  const labelOf = useCallback((key: string) => slots.find((s) => s.key === key)?.label ?? key, [slots]);

  const refresh = useCallback(async () => {
    try {
      const s = await api.state();
      setState(s);
      setAuthed(true);
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) setAuthed(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial load
    void refresh();
  }, [refresh]);

  // Poll faster while something is being made.
  const working = !!state && (state.player.phase === "hatching" || Object.values(state.jobs).some((j) => j.status === "preparing" || j.status === "rendering"));
  useEffect(() => {
    if (!authed) return;
    const t = setInterval(() => {
      if (!busy) void refresh();
    }, working ? 4000 : 15000);
    return () => clearInterval(t);
  }, [authed, working, busy, refresh]);

  // Escape closes the map / movies panels.
  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel]);

  // Celebrate the moment the egg hatches.
  useEffect(() => {
    const ph = state?.player.phase ?? null;
     
    if (prevPhase.current === "hatching" && ph === "playing") setReveal(true);
    prevPhase.current = ph;
  }, [state?.player.phase]);

  // Announce newly finished movies.
  useEffect(() => {
    if (!state) return;
    const prev = prevJobs.current;
    prevJobs.current = state.jobs;
    if (!prev) return;
    for (const j of Object.values(state.jobs)) {
      if (j.kind === "video" && j.status === "done" && j.url && prev[j.key]?.status !== "done") {
        const id = Date.now() + Math.random();
         
        setToasts((t) => [...t, { id, text: `🎬 “${labelOf(j.key)}” is ready`, key: j.key }]);
        setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 20000);
      }
    }
  }, [state, labelOf]);

  const openClip = useCallback(
    (key: string) => {
      const j = state?.jobs[key];
      if (!j?.url) return;
      setCinema({ key, url: j.url, title: labelOf(key) });
    },
    [state, labelOf],
  );

  // Auto-play the current island's intro (and the hatching movie) the first time it's ready.
  useEffect(() => {
    if (!state || cinema || busy || panel || reveal || state.player.phase !== "playing") return;
    const seen = new Set(state.seen);
    for (const key of ["video_hatch", `video_intro_${state.player.island}`]) {
      const j = state.jobs[key];
      if (j?.status === "done" && j.url && !seen.has(key)) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to polled data
        setCinema({ key, url: j.url, title: labelOf(key) });
        return;
      }
    }
  }, [state, cinema, busy, panel, reveal, labelOf]);

  const closeCinema = useCallback(() => {
    if (cinema) {
      const key = cinema.key;
      setState((s) => (s && !s.seen.includes(key) ? { ...s, seen: [...s.seen, key] } : s));
      void api.seen(key);
    }
    setCinema(null);
  }, [cinema]);

  if (authed === null) return <div className="boot">Loading the sky…</div>;
  if (!authed || !state) return <Login onDone={refresh} />;

  const p = state.player;
  const logout = async () => {
    await api.logout();
    setState(null);
    setAuthed(false);
  };

  let screen: React.ReactNode;
  if (p.phase === "hatch" || p.phase === "hatching") {
    screen = <Hatch state={state} onState={setState} />;
  } else if (p.phase === "finished") {
    screen = <Ending state={state} islands={islands} onPlay={openClip} onReel={() => setPanel("reel")} />;
  } else {
    screen = (
      <Play
        state={state}
        islands={islands}
        onState={setState}
        onBusy={setBusy}
        onOpenReel={() => setPanel("reel")}
        onOpenMap={() => setPanel("map")}
        onPlayClip={openClip}
        onLogout={logout}
      />
    );
  }

  return (
    <>
      {screen}
      {p.phase === "island_complete" && !busy && (
        <IslandComplete state={state} islands={islands} onPlay={openClip} onContinue={async () => setState(await api.advance())} />
      )}
      {reveal && <Reveal state={state} onClose={() => setReveal(false)} />}
      {panel === "reel" && <Reel state={state} slots={slots} onClose={() => setPanel(null)} onPlay={openClip} />}
      {panel === "map" && <MapView state={state} islands={islands} onClose={() => setPanel(null)} />}
      {cinema && <Cinema clip={cinema} onClose={closeCinema} />}
      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <button
            key={t.id}
            className="toast"
            type="button"
            onClick={() => {
              if (t.key) openClip(t.key);
              setToasts((all) => all.filter((x) => x.id !== t.id));
            }}
          >
            {t.text} <span>Watch ▶</span>
          </button>
        ))}
      </div>
    </>
  );
}
