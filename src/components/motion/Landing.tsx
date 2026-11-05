"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { tornPath } from "@/components/art/Torn";
import { site } from "@/content/site";
import { worlds } from "@/content/worlds";
import { getLenis, ScrollTrigger } from "@/lib/motion";

const UNDER = tornPath(41, ["bottom"], 4, 30);
const SHEET = tornPath(42, ["bottom"], 4, 30);

/**
 * Landing reel, played once per session when the visit starts on the homepage
 * (the boot script in layout.tsx adds html.psy-landing; reduced motion never
 * gets it). The choreography is pure CSS (globals.css, "Landing reel"), so it
 * starts on first paint without waiting for hydration:
 * the five worlds develop like frames on a contact sheet under a lavender
 * light-table scan, the tagline surfaces, then the sheet tears away and the
 * hero's own entrance takes over (it waits for "psy:landed").
 * This component only hands off when the tear finishes, and handles Skip:
 * any key, a click, or the button jump straight to the tear.
 */
export function Landing() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    const under = el?.querySelector<HTMLElement>("[data-under]");
    if (!el || !under || !html.classList.contains("psy-landing")) return;
    getLenis()?.stop();

    // The hero's entrance starts while the sheet is still tearing away, so there's no dark pause.
    let handed = false;
    const handOff = () => {
      if (handed) return;
      handed = true;
      window.dispatchEvent(new Event("psy:landed"));
    };
    let soon: number | undefined;
    const onStart = (e: AnimationEvent) => {
      if (e.animationName === "land-tear-sheet") soon = window.setTimeout(handOff, 150);
    };
    const end = () => {
      if (!html.classList.contains("psy-landing")) return;
      try {
        sessionStorage.setItem("psy-landed", "1");
      } catch {}
      html.classList.remove("psy-landing", "psy-landing-skip");
      getLenis()?.start();
      ScrollTrigger.refresh();
      handOff();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === under && e.animationName.startsWith("land-tear")) end();
    };
    const skip = () => html.classList.add("psy-landing-skip");
    // Safety net: if animation events never arrive (e.g. a background tab), finish anyway.
    const timer = window.setTimeout(end, 4000);

    under.addEventListener("animationend", onEnd);
    el.addEventListener("animationstart", onStart);
    window.addEventListener("keydown", skip);
    el.addEventListener("pointerdown", skip);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(soon);
      under.removeEventListener("animationend", onEnd);
      el.removeEventListener("animationstart", onStart);
      window.removeEventListener("keydown", skip);
      el.removeEventListener("pointerdown", skip);
    };
  }, []);

  const words = site.tagline.split(" ");

  return (
    <div ref={root} className="landing fixed inset-0 z-[115]" aria-hidden="true">
      <div data-under className="absolute inset-x-0 -top-[2vh] bottom-[-6vh] bg-lav" style={{ clipPath: UNDER }} />
      <div data-sheet className="absolute inset-x-0 -top-[2vh] bottom-[-6vh] overflow-hidden bg-ink" style={{ clipPath: SHEET }}>
        <div className="landing-glow absolute inset-0" />

        <div data-chrome className="t-label gutter absolute inset-x-0 top-[calc(2vh+1.5rem)] flex items-center justify-between text-ivory/70">
          <span className="font-sans text-[0.95rem] font-bold tracking-[0.42em] text-ivory">PSYIXEL —</span>
          <span className="flex items-center gap-1">
            <span className="landing-count relative block h-[1.6em] overflow-hidden">
              <span className="block">
                {["00", "01", "02", "03", "04", "05"].map((n) => (
                  <span key={n} className="block h-[1.6em]">
                    {n}
                  </span>
                ))}
              </span>
            </span>
            / 05
          </span>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[6vh] px-[var(--gutter)]">
          {/* contact sheet */}
          <div className="relative w-full max-w-[1100px]">
            <span data-scan className="pointer-events-none absolute -inset-y-[12%] left-0 z-10 w-[10%] bg-gradient-to-r from-transparent via-lav/35 to-transparent mix-blend-screen" />
            <ul className="grid grid-cols-5 gap-[1.6vw]">
              {worlds.map((w, i) => (
                <li key={w.key} style={{ ["--i" as string]: i }}>
                  <div data-frame className="relative aspect-[9/16] overflow-hidden border border-ivory/60 bg-coal p-[3px] sm:aspect-[3/4]">
                    <div className="relative h-full w-full overflow-hidden">
                      {w.cover.src && <Image data-develop src={w.cover.src} alt="" fill priority sizes="20vw" className="object-cover" />}
                    </div>
                  </div>
                  <p data-caption className="t-label mt-2 flex justify-between text-[0.625rem] text-ivory/70 md:text-[0.6875rem]">
                    <span>{w.index}</span>
                    <span className="hidden sm:inline">{w.title}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <p data-tag className="t-serif text-center text-[clamp(1.9rem,4.4vw,4rem)] leading-[1.05] text-ivory">
            {words.map((wd, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                <span className="inline-block" style={{ ["--i" as string]: i }}>
                  {wd}&nbsp;
                </span>
              </span>
            ))}
          </p>
        </div>

        <button type="button" data-chrome onClick={() => document.documentElement.classList.add("psy-landing-skip")} className="t-label absolute bottom-[calc(6vh+1.5rem)] right-[var(--gutter)] text-ivory/60 transition-colors hover:text-lav">
          Skip intro
        </button>
      </div>
    </div>
  );
}
