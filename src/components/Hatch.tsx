"use client";

import { useEffect, useState } from "react";
import type { PublicState } from "@/lib/types";
import { api } from "./api";

const LINES = [
  "The egg is wobbling…",
  "Something inside is humming a tune…",
  "A tiny crack! Then another…",
  "Granny Wren is knitting a very small scarf…",
  "Warm light is leaking through the shell…",
  "Almost there. Something is definitely kicking…",
];

export default function Hatch({ state, onState }: { state: PublicState; onState: (s: PublicState) => void }) {
  const [f, setF] = useState({ creatureName: "", creatureDesc: "", favouriteFood: "", biggestFear: "", adventurerDesc: "" });
  const [err, setErr] = useState("");
  const [sending, setSending] = useState(false);
  const [line, setLine] = useState(0);
  const hatching = state.player.phase === "hatching";

  useEffect(() => {
    if (!hatching) return;
    const t = setInterval(() => setLine((l) => (l + 1) % LINES.length), 3500);
    return () => clearInterval(t);
  }, [hatching]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setSending(true);
    try {
      onState(await api.hatch(f));
    } catch (e) {
      setErr(e instanceof Error ? e.message : "The egg didn't respond. Try again.");
    } finally {
      setSending(false);
    }
  }

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  if (hatching || sending) {
    const failed = state.jobs.portrait_creature_0?.status === "failed";
    return (
      <main className="hatching" style={{ backgroundImage: "url(/art/scene_1.jpg)" }}>
        <div className="hatching-card">
          <div className="egg-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="egg" src="/art/egg.jpg" alt="Your egg" />
            <span className="egg-glow" />
          </div>
          <h1>{state.player.creatureName || f.creatureName || "Your egg"} is hatching</h1>
          <p className="hatch-line" key={line}>
            {failed ? "The egg is being stubborn — trying again…" : LINES[line]}
          </p>
          <p className="fine">This takes about a minute. Your hatching movie gets made in the background and will pop up when it&rsquo;s ready.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="hatch" style={{ backgroundImage: "url(/art/scene_1.jpg)" }}>
      <form className="hatch-card" onSubmit={submit}>
        <span className="eyebrow">Hi {state.player.name}! Before the adventure…</span>
        <h1>Describe the creature inside your egg</h1>
        <p>Use your own words. Whatever you write is what hatches, and it shapes every picture and movie in your story.</p>

        <label htmlFor="desc">What does it look like?</label>
        <textarea
          id="desc"
          rows={3}
          value={f.creatureDesc}
          onChange={set("creatureDesc")}
          maxLength={400}
          required
          placeholder="e.g. Small and fluffy, teal like the sea, with huge eyes, leaf-shaped wings and a tail like a little cloud."
        />
        <div className="row2">
          <div>
            <label htmlFor="cname">Its name</label>
            <input id="cname" value={f.creatureName} onChange={set("creatureName")} maxLength={24} required placeholder="e.g. Pip" />
          </div>
          <div>
            <label htmlFor="food">Favourite food</label>
            <input id="food" value={f.favouriteFood} onChange={set("favouriteFood")} maxLength={80} placeholder="e.g. honey cookies" />
          </div>
        </div>
        <label htmlFor="fear">What is it secretly scared of?</label>
        <input id="fear" value={f.biggestFear} onChange={set("biggestFear")} maxLength={80} placeholder="e.g. thunder, or being left alone" />
        <label htmlFor="adv">And you, the adventurer: what do you look like? (optional)</label>
        <input id="adv" value={f.adventurerDesc} onChange={set("adventurerDesc")} maxLength={300} placeholder="e.g. Curly red hair, a yellow raincoat and big boots" />
        {err && <p className="form-error">{err}</p>}
        <button className="btn big" type="submit">
          🥚 Hatch!
        </button>
      </form>
    </main>
  );
}

export function Reveal({ state, onClose }: { state: PublicState; onClose: () => void }) {
  return (
    <div className="modal reveal" role="dialog" aria-modal="true" aria-label="Your creature hatched">
      <div className="reveal-card">
        <div className="burst" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {state.player.portrait && <img src={state.player.portrait} alt={state.player.creatureName} />}
        <span className="eyebrow">It hatched!</span>
        <h1>Meet {state.player.creatureName}</h1>
        <p>Every move you make will shape who {state.player.creatureName} becomes. Kind, sneaky, brave or silly: it&rsquo;s up to you.</p>
        <button className="btn big" type="button" onClick={onClose} autoFocus>
          Begin the adventure ▶
        </button>
      </div>
    </div>
  );
}
