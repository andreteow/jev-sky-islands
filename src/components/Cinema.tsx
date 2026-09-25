"use client";

import { useEffect, useRef, useState } from "react";

export interface CinemaClip {
  key: string;
  url: string;
  title: string;
}

export default function Cinema({ clip, onClose }: { clip: CinemaClip; onClose: () => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // Try with sound; browsers may refuse until the player has clicked something, so fall back to muted.
    v.muted = false;
    v.play().catch(() => {
      v.muted = true;
      setMuted(true);
      void v.play().catch(() => {});
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clip.url, onClose]);

  return (
    <div className="cinema" role="dialog" aria-modal="true" aria-label={clip.title}>
      <div className="cinema-inner">
        <div className="cinema-title">
          <span className="eyebrow">Your movie</span>
          <h2>{clip.title}</h2>
        </div>
        <video ref={ref} src={clip.url} playsInline controls onEnded={onClose} />
        <div className="cinema-actions">
          {muted && (
            <button
              className="btn ghost"
              type="button"
              onClick={() => {
                if (ref.current) ref.current.muted = false;
                setMuted(false);
              }}
            >
              🔊 Turn sound on
            </button>
          )}
          <button className="btn" type="button" onClick={onClose}>
            Continue ▶
          </button>
        </div>
      </div>
    </div>
  );
}
