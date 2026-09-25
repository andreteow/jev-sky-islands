"use client";

import type { PublicState } from "@/lib/types";
import type { VideoSlot } from "./api";

export default function Reel({ state, slots, onClose, onPlay }: { state: PublicState; slots: VideoSlot[]; onClose: () => void; onPlay: (key: string) => void }) {
  const portraits = [0, 1, 2, 3].map((k) => state.jobs[`portrait_creature_${k}`]).filter((j) => j?.url);
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Your movies" onClick={onClose}>
      <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">Memory reel</span>
            <h2>{state.player.creatureName}&rsquo;s movies</h2>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {!state.videosEnabled && <p className="note">Movie-making is switched off on this server (NO_VIDEO=1), so you&rsquo;ll see stills instead.</p>}
        <div className="reel">
          {slots.map((s) => {
            const j = state.jobs[s.key];
            const ready = j?.status === "done" && j.url;
            const making = j && (j.status === "preparing" || j.status === "rendering");
            return (
              <button key={s.key} type="button" className={`slot ${ready ? "ready" : ""}`} disabled={!ready} onClick={() => ready && onPlay(s.key)}>
                <span className="slot-img" style={{ backgroundImage: `url(${s.poster})` }}>
                  <span className="slot-badge">{ready ? "▶" : making ? "⏳" : j?.status === "failed" ? "⚠︎" : "🔒"}</span>
                </span>
                <span className="slot-label">{s.label}</span>
                <span className="slot-status">
                  {ready ? (state.seen.includes(s.key) ? "Watched" : "New!") : making ? (j.status === "rendering" ? "Filming…" : "Writing the scene…") : j?.status === "failed" ? "Retrying soon" : "Not yet"}
                </span>
              </button>
            );
          })}
        </div>
        {portraits.length > 0 && (
          <>
            <h3 className="sub">Portraits</h3>
            <div className="portrait-row">
              {portraits.map((j) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={j!.key} src={j!.url} alt={`${state.player.creatureName} portrait`} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
