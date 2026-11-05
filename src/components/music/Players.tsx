"use client";

import { Plate } from "@/components/art/Plate";
import { fmt, useAudio } from "./AudioProvider";
import { Eq, Waveform } from "./Visualisers";

export function PlayIcon({ playing, className = "h-3.5 w-3.5" }: { playing: boolean; className?: string }) {
  return playing ? (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <rect x="2" y="1" width="3" height="10" fill="currentColor" />
      <rect x="7" y="1" width="3" height="10" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 12 12" className={className} aria-hidden="true">
      <path d="M2.5 1 L 11 6 L 2.5 11Z" fill="currentColor" />
    </svg>
  );
}

/** Compact "now playing" card for the homepage music feature. */
export function FeaturePlayer() {
  const { current, playing, toggle, time, duration, seek, next, prev, tracks } = useAudio();
  const pct = duration ? (time / duration) * 100 : 0;
  const multiple = tracks.filter((t) => t.src).length > 1;

  if (!current)
    return (
      <div className="relative border border-[var(--line-strong)] bg-ink/60 p-6 backdrop-blur-sm">
        <p className="t-label text-ivory/80">Not available to listen to yet.</p>
      </div>
    );

  return (
    <div className="relative border border-[var(--line-strong)] bg-ink/60 p-3 backdrop-blur-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <button
          type="button"
          onClick={() => toggle()}
          aria-label={playing ? `Pause ${current.title}` : `Play ${current.title}`}
          data-cursor={playing ? "Pause" : "Play"}
          className="group relative aspect-[1.27] w-full shrink-0 overflow-hidden sm:w-[10.5vw] sm:min-w-[7.5rem]"
        >
          <Plate image={current.cover} showTag={false} className="h-full w-full transition-transform duration-700 group-hover:scale-105" sizes="160px" />
          <span className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-colors group-hover:bg-ink/30">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ivory/90 text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              <PlayIcon playing={playing} />
            </span>
          </span>
        </button>

        <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="t-label flex items-center gap-2 text-ivory/80">
                <PlayIcon playing={playing} className="h-2.5 w-2.5 text-lav" />
                {playing ? "Now playing" : "Ready to play"}
              </p>
              <p className="mt-3 truncate font-sans text-base text-ivory">{current.title}</p>
              <p className="t-label mt-1 text-dust">
                {current.artist}
                {current.placeholder && <span className="ml-2 text-[0.6875rem] normal-case tracking-normal text-dust">· Demo audio — not a finished release.</span>}
              </p>
            </div>
            <Eq bars={10} className="mt-1 hidden sm:flex" />
          </div>

          <div>
            <input
              type="range"
              className="psy-range"
              min={0}
              max={duration || 1}
              step={0.1}
              value={time}
              disabled={!duration}
              aria-label="Seek"
              style={{ ["--p" as string]: `${pct}%` }}
              onChange={(e) => seek(parseFloat(e.target.value))}
            />
            <div className="t-label mt-1 flex items-center justify-between text-ivory/70">
              <span>
                {fmt(time)} <span className="text-dust">/</span> {duration ? fmt(duration) : "--:--"}
              </span>
              <span className="flex items-center gap-1">
                {multiple && (
                  <button type="button" onClick={prev} className="px-2 py-1 hover:text-lav" aria-label="Previous track">
                    ←
                  </button>
                )}
                <button type="button" onClick={() => toggle()} className="px-2 py-1 hover:text-lav">
                  {playing ? "Pause" : "Play"}
                </button>
                {multiple && (
                  <button type="button" onClick={next} className="px-2 py-1 hover:text-lav" aria-label="Next track">
                    →
                  </button>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Full track list with per-track waveform, for /music. */
/** Track rows with waveforms; `album` limits the list to one album. */
export function TrackList({ album }: { album?: string } = {}) {
  const { tracks: all, current, playing, toggle, time, duration } = useAudio();
  const tracks = album ? all.filter((t) => t.album === album) : all;
  if (!tracks.length) return <p className="t-label border-t hairline pt-6 text-ivory/70">Not available to listen to yet.</p>;
  return (
    <ol className="border-t hairline">
      {tracks.map((t, i) => {
        const active = current?.id === t.id;
        return (
          <li key={t.id} id={t.id} className="grid scroll-mt-28 grid-cols-[3.5rem_1fr] items-center gap-4 border-b hairline py-5 md:grid-cols-[5rem_minmax(0,16rem)_1fr_7rem] md:gap-8">
            <button
              type="button"
              disabled={!t.src}
              onClick={() => toggle(t.id)}
              aria-label={t.src ? `${active && playing ? "Pause" : "Play"} ${t.title}` : `${t.title} — not available to listen to yet`}
              data-cursor={t.src ? (active && playing ? "Pause" : "Play") : undefined}
              className="group relative aspect-square w-full overflow-hidden disabled:opacity-50"
            >
              <Plate image={t.cover} showTag={false} className="h-full w-full" sizes="80px" />
              {t.src && (
                <span className={`absolute inset-0 flex items-center justify-center bg-ink/40 text-ivory transition-opacity ${active && playing ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
                  <PlayIcon playing={active && playing} />
                </span>
              )}
            </button>
            <div className="min-w-0">
              <p className="t-label text-dust">{String(i + 1).padStart(2, "0")}</p>
              <p className={`t-serif truncate text-3xl ${active ? "text-lav" : "text-ivory"}`}>{t.title}</p>
              <p className="t-label mt-1 text-ivory/60">{t.artist}</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              {t.src ? (
                <Waveform trackId={t.id} src={t.src} peaks={t.peaks} />
              ) : t.url ? (
                <a href={t.url} target="_blank" rel="noreferrer" className="t-label block border border-dashed border-[var(--line-strong)] px-4 py-4 text-ivory/80 hover:border-lav hover:text-lav">
                  Listen on SoundCloud ↗
                </a>
              ) : (
                <p className="t-label border border-dashed border-[var(--line-strong)] px-4 py-4 text-dust">Not available to listen to yet.</p>
              )}
              {t.note && <p className="t-label mt-2 text-[0.75rem] text-dust">{t.note}</p>}
            </div>
            <p className="t-label hidden text-right text-ivory/70 md:block">
              {active && duration ? `${fmt(time)} / ${fmt(duration)}` : t.duration ?? (t.src ? "—" : "")}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

/** Small persistent player once something has been played. */
export function MiniPlayer() {
  const { started, current, playing, toggle, stop, time, duration } = useAudio();
  if (!started || !current) return null;
  const pct = duration ? (time / duration) * 100 : 0;
  return (
    <div className="fixed bottom-4 left-4 z-[85] flex max-w-[calc(100vw-2rem)] items-center gap-3 overflow-hidden border border-[var(--line-strong)] bg-ink/85 py-2 pl-2 pr-3 backdrop-blur-md">
      <button type="button" onClick={() => toggle()} aria-label={playing ? "Pause" : "Play"} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lav text-ink" data-magnetic="0.3">
        <PlayIcon playing={playing} />
      </button>
      <div className="min-w-0">
        <p className="truncate font-sans text-xs text-ivory">{current.title}</p>
        <p className="t-label text-[0.75rem] text-dust">
          {fmt(time)} / {duration ? fmt(duration) : "--:--"}
        </p>
      </div>
      <Eq bars={5} className="h-5" />
      <button type="button" onClick={stop} aria-label="Close player" className="t-label ml-1 px-1 text-dust hover:text-ivory">
        ×
      </button>
      <span className="absolute bottom-0 left-0 h-[2px] bg-lav" style={{ width: `${pct}%` }} aria-hidden="true" />
    </div>
  );
}
