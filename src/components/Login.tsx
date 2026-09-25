"use client";

import { useState } from "react";
import { api } from "./api";

export default function Login({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      await api.login(name, code);
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Couldn't sign in.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <video className="login-bg" src="/art/trailer.mp4" poster="/art/hero.jpg" autoPlay muted loop playsInline />
      <div className="login-shade" />
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">A game for friends</span>
        <h1>Sky Island Hatchlings</h1>
        <p>Hatch a creature. Talk your way across ten floating islands. Anything you type might just work.</p>
        <label htmlFor="name">Your name</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Andre" autoComplete="nickname" maxLength={32} required />
        <label htmlFor="code">Invite code</label>
        <input id="code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="From whoever invited you" autoCapitalize="characters" required />
        {err && <p className="form-error">{err}</p>}
        <button className="btn big" type="submit" disabled={busy}>
          {busy ? "Opening the sky…" : "Enter the sky"}
        </button>
        <p className="fine">Coming back? Use the same name to carry on where you left off.</p>
      </form>
    </main>
  );
}
