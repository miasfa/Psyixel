"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Track } from "@/content/types";

type AudioState = {
  tracks: Track[];
  /** Undefined when no tracks are published yet. */
  current: Track | undefined;
  index: number;
  playing: boolean;
  started: boolean;
  time: number;
  duration: number;
  /** Play a track by id (or resume the current one). Tracks without `src` are ignored. */
  play: (id?: string) => void;
  pause: () => void;
  toggle: (id?: string) => void;
  seek: (seconds: number) => void;
  next: () => void;
  prev: () => void;
  stop: () => void;
  /** Fills `out` with 0–1 frequency levels (silent when nothing plays). */
  levels: (out: Float32Array) => void;
};

const AudioCtx = createContext<AudioState | null>(null);

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio must be used inside <AudioProvider>");
  return ctx;
}

/**
 * One shared <audio> element for the whole site, so playback continues across
 * page transitions. Nothing ever autoplays — playback starts on user action only.
 */
export function AudioProvider({ tracks, children }: { tracks: Track[]; children: ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const buf = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playable = useMemo(() => tracks.map((t, i) => (t.src ? i : -1)).filter((i) => i >= 0), [tracks]);

  useEffect(() => {
    const el = new Audio();
    el.preload = "metadata";
    audio.current = el;
    const onTime = () => setTime(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    return () => {
      el.pause();
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  const load = useCallback(
    (i: number) => {
      const el = audio.current;
      const src = tracks[i]?.src;
      if (!el || !src) return false;
      if (!el.src.endsWith(src)) {
        el.src = src;
        setTime(0);
        setDuration(0);
      }
      setIndex(i);
      return true;
    },
    [tracks],
  );

  // Analyser is created lazily on first play (browsers require a user gesture).
  const ensureAnalyser = useCallback(() => {
    if (analyser.current || !audio.current) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ac = new Ctx();
      const node = ac.createAnalyser();
      node.fftSize = 64;
      node.smoothingTimeConstant = 0.78;
      ac.createMediaElementSource(audio.current).connect(node);
      node.connect(ac.destination);
      analyser.current = node;
      buf.current = new Uint8Array(node.frequencyBinCount);
    } catch {
      /* visualiser is optional */
    }
  }, []);

  const play = useCallback(
    (id?: string) => {
      const i = id ? tracks.findIndex((t) => t.id === id) : index;
      if (i < 0 || !load(i)) return;
      ensureAnalyser();
      void (analyser.current?.context as AudioContext | undefined)?.resume();
      setStarted(true);
      void audio.current?.play().catch(() => setPlaying(false));
    },
    [tracks, index, load, ensureAnalyser],
  );

  const pause = useCallback(() => audio.current?.pause(), []);
  const toggle = useCallback(
    (id?: string) => {
      const same = !id || tracks[index]?.id === id;
      if (same && playing) pause();
      else play(id);
    },
    [tracks, index, playing, play, pause],
  );
  const seek = useCallback((s: number) => {
    if (audio.current && Number.isFinite(s)) audio.current.currentTime = s;
  }, []);
  const step = useCallback(
    (dir: 1 | -1) => {
      if (!playable.length) return;
      const pos = playable.indexOf(index);
      const nextIdx = playable[(pos + dir + playable.length) % playable.length];
      const wasPlaying = playing;
      load(nextIdx);
      if (wasPlaying) void audio.current?.play();
    },
    [playable, index, playing, load],
  );
  const stop = useCallback(() => {
    audio.current?.pause();
    setStarted(false);
  }, []);

  useEffect(() => {
    const el = audio.current;
    if (!el) return;
    const onEnd = () => step(1);
    el.addEventListener("ended", onEnd);
    return () => el.removeEventListener("ended", onEnd);
  }, [step]);

  const levels = useCallback(
    (out: Float32Array) => {
      const a = analyser.current;
      const b = buf.current;
      if (!a || !b || !playing) {
        out.fill(0);
        return;
      }
      a.getByteFrequencyData(b);
      for (let i = 0; i < out.length; i++) out[i] = b[Math.min(b.length - 1, i + 1)] / 255;
    },
    [playing],
  );

  const value: AudioState = {
    tracks,
    current: tracks[index],
    index,
    playing,
    started,
    time,
    duration,
    play,
    pause,
    toggle,
    seek,
    next: () => step(1),
    prev: () => step(-1),
    stop,
    levels,
  };

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export const fmt = (s: number) => {
  if (!Number.isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};
