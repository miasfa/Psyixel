"use client";

import { useEffect, useRef, useState } from "react";
import { reducedMotion } from "@/lib/motion";
import { seeded } from "@/lib/random";
import { useAudio } from "./AudioProvider";

const IDLE = (() => {
  const r = seeded(14);
  return Array.from({ length: 24 }, () => 0.15 + r() * 0.55);
})();

/** Live equaliser bars driven by the shared analyser; rests as a static skyline. */
export function Eq({ bars = 12, className = "", barClassName = "w-[4px]" }: { bars?: number; className?: string; barClassName?: string }) {
  const { levels, playing } = useAudio();
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current;
    if (!playing || reducedMotion()) {
      els.forEach((el, i) => el && (el.style.transform = `scaleY(${IDLE[i % IDLE.length]})`));
      return;
    }
    const data = new Float32Array(bars);
    let raf = 0;
    const loop = () => {
      levels(data);
      els.forEach((el, i) => el && (el.style.transform = `scaleY(${Math.max(0.08, data[i])})`));
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [playing, levels, bars]);

  return (
    <div aria-hidden="true" className={`flex h-10 items-end gap-[3px] ${className}`}>
      {Array.from({ length: bars }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className={`block h-full origin-bottom bg-lav transition-transform duration-100 ${barClassName} ${playing ? "" : "eq-idle"}`}
          style={{ transform: `scaleY(${IDLE[i % IDLE.length]})`, animationDelay: `${-i * 0.37}s`, animationDuration: `${1.6 + (i % 4) * 0.45}s` }}
        />
      ))}
    </div>
  );
}

const peakCache = new Map<string, number[]>();

async function computePeaks(src: string, count: number) {
  const key = `${src}:${count}`;
  const hit = peakCache.get(key);
  if (hit) return hit;
  const res = await fetch(src);
  const raw = await res.arrayBuffer();
  const Ctx = window.OfflineAudioContext ?? (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  const ac = new Ctx(1, 1, 22050);
  const audio = await ac.decodeAudioData(raw);
  const data = audio.getChannelData(0);
  const block = Math.floor(data.length / count);
  const peaks: number[] = [];
  for (let i = 0; i < count; i++) {
    let max = 0;
    for (let j = i * block; j < (i + 1) * block; j += 16) max = Math.max(max, Math.abs(data[j]));
    peaks.push(max);
  }
  const top = Math.max(...peaks, 0.001);
  const norm = peaks.map((p) => p / top);
  peakCache.set(key, norm);
  return norm;
}

/**
 * Interactive waveform computed from the actual audio file. Click/drag or use
 * arrow keys to seek. Only seeks when this track is the one loaded.
 */
export function Waveform({ trackId, src, count = 96, peaks: given }: { trackId: string; src: string; count?: number; peaks?: number[] }) {
  const { current, time, duration, seek, play, playing } = useAudio();
  const [computed, setPeaks] = useState<number[] | null>(null);
  // Precomputed peaks (scripts/import-music.mjs) avoid downloading the track just to draw it.
  const peaks = given ?? computed;
  const isCurrent = current?.id === trackId;
  const progress = isCurrent && duration ? time / duration : 0;

  useEffect(() => {
    if (given) return;
    let alive = true;
    computePeaks(src, count)
      .then((p) => alive && setPeaks(p))
      .catch(() => alive && setPeaks(IDLE.concat(IDLE, IDLE, IDLE).slice(0, count)));
    return () => {
      alive = false;
    };
  }, [src, count, given]);

  const seekTo = (ratio: number) => {
    if (!isCurrent) {
      play(trackId);
      return;
    }
    seek(Math.max(0, Math.min(1, ratio)) * duration);
  };

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={Math.round(isCurrent ? duration : 0)}
      aria-valuenow={Math.round(isCurrent ? time : 0)}
      data-cursor={isCurrent ? "Seek" : "Play"}
      className="group relative flex h-14 w-full items-center gap-[2px]"
      onPointerDown={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        seekTo((e.clientX - r.left) / r.width);
      }}
      onKeyDown={(e) => {
        if (!isCurrent) return;
        if (e.key === "ArrowRight") seek(Math.min(duration, time + 5));
        if (e.key === "ArrowLeft") seek(Math.max(0, time - 5));
      }}
    >
      {(peaks ?? Array.from({ length: count }, () => 0.08)).map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={`block flex-1 rounded-full transition-colors duration-300 ${i / count < progress ? "bg-lav" : "bg-ivory/25 group-hover:bg-ivory/40"}`}
          style={{ height: `${Math.max(6, p * 100)}%` }}
        />
      ))}
    </div>
  );
}
