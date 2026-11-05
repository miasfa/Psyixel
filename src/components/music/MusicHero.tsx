"use client";

import { useEffect, useRef } from "react";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { reducedMotion } from "@/lib/motion";
import { seeded } from "@/lib/random";
import { fmt, useAudio } from "./AudioProvider";
import { PlayIcon } from "./Players";
import { Eq } from "./Visualisers";

/*
 * /music hero, laid out from references/inner-pages/music-visual-concept.png
 * (1440 × 945, ~33px outer frame subtracted). Desktop positions are concept
 * px ÷ 14.4 (vw). Everything here is live: the record spins while audio plays,
 * the waveform follows the analyser, and the panel is the site's real player.
 */

const N = 120; // waveform points
const BASE = (() => {
  const r = seeded(31);
  // A burst shape like the concept: busy in the middle-left, trailing off to the right.
  return Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const env = Math.exp(-((t - 0.38) ** 2) / 0.05) * 0.85 + Math.exp(-((t - 0.68) ** 2) / 0.012) * 0.6 + 0.05;
    return (0.25 + r() * 0.75) * env * (i % 2 ? 1 : -1);
  });
})();

function wavePath(values: ArrayLike<number>, w = 1000, h = 200) {
  let d = "";
  for (let i = 0; i < values.length; i++) d += `${i ? "L" : "M"}${((i / (values.length - 1)) * w).toFixed(1)} ${(h / 2 - values[i] * (h / 2)).toFixed(1)}`;
  return d;
}

function Waveform() {
  const { levels, playing } = useAudio();
  const path = useRef<SVGPathElement>(null);

  useEffect(() => {
    const el = path.current;
    if (!el) return;
    if (reducedMotion()) {
      el.setAttribute("d", wavePath(BASE));
      return;
    }
    const bins = new Float32Array(32);
    const out = new Float32Array(N);
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      if (playing) levels(bins);
      for (let i = 0; i < N; i++) {
        // Spread the analyser's bins across the line, low frequencies near the left burst.
        const live = playing ? bins[Math.min(31, Math.floor(Math.sqrt(i / N) * 20))] : 0;
        const breathe = 0.82 + 0.18 * Math.sin(t * 1.6 + i * 0.35);
        out[i] = BASE[i] * breathe * (playing ? 1 + live * 0.9 : 1);
      }
      el.setAttribute("d", wavePath(out));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, levels]);

  return (
    <svg viewBox="0 0 1000 200" preserveAspectRatio="none" aria-hidden="true" className="h-full w-full overflow-visible">
      <path ref={path} d={wavePath(BASE)} fill="none" stroke="var(--color-lav)" strokeWidth="2.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

/** A record drawn in CSS: fine grooves, a fixed light sheen, a textured lavender label. */
function Vinyl({ spinning }: { spinning: boolean }) {
  return (
    <div aria-hidden="true" className="relative aspect-square w-full rounded-full shadow-[0_0_80px_rgba(0,0,0,0.8)]">
      <div
        className={`vinyl-spin absolute inset-0 rounded-full ${spinning ? "" : "[animation-play-state:paused]"}`}
        style={{
          background:
            "repeating-radial-gradient(circle at center, #080708 0 2px, #2c292c 2.6px 3.2px, #0d0c0d 3.8px 6px), repeating-radial-gradient(circle at center, transparent 0 46px, rgba(236,229,216,0.16) 47px 48px, transparent 49px 61px), radial-gradient(circle, #191719 0 31%, #0b0a0b 32%)",
        }}
      >
        {/* label */}
        <div className="absolute inset-[35.2%] overflow-hidden rounded-full bg-lav">
          <div className="absolute inset-0 opacity-50 mix-blend-multiply" style={{ background: "url('/images/wordmark-ink.webp') 0 0 / 220%" }} />
          <span className="t-label absolute left-[12%] top-1/2 -translate-y-1/2 text-[0.55vw] text-ink/50">⟜</span>
          <span className="t-label absolute left-1/2 top-[14%] -translate-x-1/2 text-[0.62vw] tracking-[0.3em] text-ink/60">Psyixel</span>
          <span className="t-label absolute bottom-[14%] left-1/2 -translate-x-1/2 text-[0.5vw] text-ink/45">33⅓</span>
          <span className="absolute left-1/2 top-1/2 h-[9%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
        </div>
      </div>
      {/* sheen stays put while the record turns */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full mix-blend-screen"
        style={{
          background:
            "conic-gradient(from 195deg, transparent 0deg, rgba(236,229,216,0.55) 20deg, rgba(236,229,216,0.12) 38deg, transparent 52deg, transparent 150deg, rgba(236,229,216,0.22) 185deg, transparent 215deg, transparent 300deg, rgba(236,229,216,0.18) 330deg, transparent 350deg)",
          WebkitMaskImage: "radial-gradient(circle, transparent 29.5%, #000 30.5%)",
          maskImage: "radial-gradient(circle, transparent 29.5%, #000 30.5%)",
        }}
      />
    </div>
  );
}

export function MusicHero() {
  const { current, playing, toggle, time, duration, seek } = useAudio();
  const pct = duration ? (time / duration) * 100 : 0;
  const canPlay = Boolean(current?.src);

  return (
    <section aria-labelledby="music-title" className="gutter relative overflow-hidden pb-16 pt-24 md:h-[63.4vw] md:min-h-[620px] md:px-0 md:pb-0 md:pt-0">
      {/* record, cut by the right edge */}
      <div className="pointer-events-none relative left-[52%] w-[100vw] md:absolute md:left-[63.2vw] md:top-[-6.9vw] md:ml-0 md:w-[69.2vw]">
        <div data-reveal="scale" data-start="top bottom" data-delay="0.15">
          <Vinyl spinning={playing} />
        </div>
      </div>

      <h1 id="music-title" className="relative z-10 -mt-[70vw] md:absolute md:left-[5.4vw] md:top-[7.8vw] md:mt-0">
        <SplitText as="span" className="t-poster block text-[34vw] tracking-[0.015em] md:text-[16vw]" lines={["Music"]} />
      </h1>

      <p data-reveal="up" data-delay="0.2" className="t-serif relative z-10 mt-4 text-[8.4vw] leading-[1.06] text-ivory md:absolute md:left-[5.9vw] md:top-[25.1vw] md:mt-0 md:whitespace-nowrap md:text-[3.25vw] md:leading-[3.9vw]">
        Some things take
        <br className="max-md:hidden" /> shape as sound.
      </p>

      {/* live waveform */}
      <div className="relative z-10 mt-8 h-[22vw] md:absolute md:left-[38.2vw] md:top-[24.2vw] md:mt-0 md:h-[8.4vw] md:w-[46.2vw]">
        <Waveform />
      </div>

      {/* player panel */}
      {current ? (
        <div
          data-reveal="up"
          data-start="top bottom"
          data-delay="0.35"
          className="relative z-10 mt-10 border-2 border-ivory/55 bg-ink/70 p-4 backdrop-blur-[2px] md:absolute md:left-[5.4vw] md:top-[41.7vw] md:mt-0 md:h-[17.5vw] md:w-[90.2vw] md:p-0"
        >
          <div className="grid gap-5 md:block">
            <button
              type="button"
              onClick={() => toggle()}
              disabled={!canPlay}
              aria-label={playing ? `Pause ${current.title}` : `Play ${current.title}`}
              data-cursor={playing ? "Pause" : "Play"}
              className="group relative block aspect-[262/200] w-full border-2 border-ivory/80 md:absolute md:left-[3.2vw] md:top-[1.5vw] md:w-[18.1vw]"
            >
              <Plate image={current.cover} showTag={false} className="h-full w-full" sizes="(max-width: 768px) 90vw, 18vw" priority />
              <span className={`absolute inset-0 flex items-center justify-center bg-ink/40 transition-opacity duration-500 ${playing ? "opacity-0 group-hover:opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"}`}>
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-ivory/80 text-ivory">
                  <PlayIcon playing={playing} className="h-4 w-4" />
                </span>
              </span>
            </button>
  
            <div className="md:absolute md:left-[25.8vw] md:top-[1.6vw] md:w-[35.5vw]">
              <button
                type="button"
                onClick={() => toggle()}
                disabled={!canPlay}
                className="t-label flex items-center gap-3 text-sm tracking-[0.16em] text-ivory transition-colors hover:text-lav md:text-[1.5vw]"
              >
                <PlayIcon playing={playing} className="h-3 w-3 md:h-[1vw] md:w-[1vw]" />
                {playing ? "Now playing" : canPlay ? "Ready to play" : "Not available to listen to yet."}
              </button>
              <span className="mt-3 block h-[2px] w-full bg-ivory/30 md:mt-[1.1vw] md:w-[25.5vw]" />
              <p className="t-label mt-4 text-base normal-case leading-[1.2] tracking-[0.12em] text-ivory md:mt-[1vw] md:text-[1.62vw]">{current.title}</p>
              <p className="t-label mt-1 text-sm leading-[1.2] tracking-[0.14em] text-ivory/75 md:mt-[0.6vw] md:text-[1.5vw]">
                {current.artist}
                {current.placeholder && <span className="ml-3 text-[0.6875rem] normal-case tracking-normal text-dust md:text-[max(0.6875rem,0.8vw)]">· Demo audio — not a finished release.</span>}
              </p>
              <input
                type="range"
                className="psy-range mt-4 md:mt-[0.83vw] md:w-[35.4vw]"
                min={0}
                max={duration || 1}
                step={0.1}
                value={time}
                disabled={!duration}
                aria-label="Seek"
                style={{ ["--p" as string]: `${pct}%` }}
                onChange={(e) => seek(parseFloat(e.target.value))}
              />
              <p className="t-label mt-3 text-base leading-[1.2] tracking-[0.12em] text-ivory/85 md:mt-[1vw] md:text-[1.6vw]">
                {fmt(time)} <span className="text-ivory/50">/</span> {duration ? fmt(duration) : "--:--"}
              </p>
            </div>
  
            <div className="hidden md:absolute md:left-[71.8vw] md:top-[5.4vw] md:block md:h-[6.7vw] md:w-[17.4vw]">
              <Eq bars={15} className="!h-full justify-between" barClassName="w-[0.7vw]" />
            </div>
          </div>
        </div>
      ) : (
        <div data-reveal="up" data-start="top bottom" data-delay="0.35" className="relative z-10 mt-10 border-2 border-ivory/55 bg-ink/70 p-4 backdrop-blur-[2px] md:absolute md:left-[5.4vw] md:top-[41.7vw] md:mt-0 md:h-[17.5vw] md:w-[90.2vw] md:p-0 flex items-center md:px-[3.2vw]">
          <p className="t-label text-ivory/80 md:text-[1.2vw]">Not available to listen to yet.</p>
        </div>
      )}
    </section>
  );
}
