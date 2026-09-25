"use client";

import type { PublicState } from "@/lib/types";
import type { IslandInfo } from "./types";

export default function MapView({ state, islands, onClose }: { state: PublicState; islands: IslandInfo[]; onClose: () => void }) {
  const cur = state.player.phase === "finished" ? 11 : state.player.island;
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Map" onClick={onClose}>
      <div className="modal-card wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <span className="eyebrow">The Wind Map</span>
            <h2>Your journey</h2>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="map-img" src="/art/map.jpg" alt="Map of the ten sky islands" />
        <ol className="map-list">
          {islands.map((i) => (
            <li key={i.n} className={i.n < cur ? "done" : i.n === cur ? "here" : "locked"}>
              <span className="num">{i.n}</span>
              <span>
                <b>{i.n <= cur ? i.name : "???"}</b>
                <small>{i.n < cur ? "Complete ✓" : i.n === cur ? `You are here · challenge ${state.player.challenge + 1} of 3` : "Locked"}</small>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
