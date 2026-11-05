"use client";

import { useEffect, useState } from "react";
import { Plate } from "@/components/art/Plate";
import type { RecentTrack } from "@/lib/lastfm";

/** "3 min ago" style label, computed in the browser so cached pages stay accurate. */
function Ago({ at }: { at: number }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  const iso = new Date(at * 1000).toISOString();
  if (now === null) return <time dateTime={iso}>Recently</time>;
  const m = Math.max(0, Math.round((now - at * 1000) / 60_000));
  const text = m < 1 ? "Just now" : m < 60 ? `${m} min ago` : m < 60 * 24 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`;
  return <time dateTime={iso}>{text}</time>;
}

/** The last few tracks played, from Last.fm (see lib/lastfm.ts). */
export function RecentlyPlayed({ tracks }: { tracks: RecentTrack[] }) {
  return (
    <ul className="grid gap-8 md:grid-cols-3">
      {tracks.map((t, i) => (
        <li key={`${t.url}-${t.playedAt ?? "now"}`} data-reveal="up" data-delay={String(i * 0.1)}>
          <a href={t.url} target="_blank" rel="noreferrer" data-cursor="Listen" className="group block">
            <div className="relative aspect-square overflow-hidden border border-ivory/25 bg-coal">
              <div className="duotone-hover relative h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105">
                <Plate image={{ src: t.image, mono: false, variant: "vinyl", alt: t.album ? `${t.album} cover` : `${t.title} cover` }} showTag={false} className="h-full w-full" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
            </div>
            <p className="t-label mt-4 flex items-center gap-2 text-dust">
              {t.nowPlaying ? (
                <>
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lav opacity-60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lav" />
                  </span>
                  <span className="text-lav">Now playing</span>
                </>
              ) : t.playedAt ? (
                <Ago at={t.playedAt} />
              ) : null}
            </p>
            <p className="t-serif mt-1 text-4xl transition-colors group-hover:text-lav">{t.title}</p>
            <p className="mt-2 font-read text-ivory/70">
              {t.artist}
              {t.album && <span className="text-ivory/65"> · {t.album}</span>}
            </p>
            <span className="t-label mt-3 inline-block text-lav">On Last.fm ↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
