"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { CollageCutout } from "@/components/art/CollageCutout";
import { FlowerCut, RockShard, Sparkle, TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { Portrait } from "@/components/art/Portrait";
import { Torn } from "@/components/art/Torn";
import { Wordmark } from "@/components/art/Wordmark";
import type { Placement, PortraitConfig } from "@/content/hero";
import { heroSlotPlacement as slots } from "@/content/hero";
import { heroCollage, site } from "@/content/site";
import { worlds } from "@/content/worlds";
import type { CollageAsset } from "@/lib/collage";
import { gsap, reducedMotion } from "@/lib/motion";

// Intro: each letter swings up from a slight tilt (the traced letterforms carry their own angles).
const TILT = [-1.5, 1, -0.5, 2, -1, 0.8, -2];
// Scroll-out depth for the letters (yPercent): a gentle, uneven sink, no rotation.
const SINK_Y = [20, 26, 18, 28, 22, 25, 19];
const idx = (el: Element) => Number((el as HTMLElement).dataset.i ?? 0);

export type HeroAssets = {
  portrait: CollageAsset | null;
  eye: CollageAsset | null;
  moon: CollageAsset | null;
  iris: CollageAsset | null;
  rock: CollageAsset | null;
};

export type HeroSlotAlts = Record<"eye" | "moon" | "iris" | "rock", string>;

/** Responsive placement as CSS variables, so positions live in content/hero.ts. */
function placementVars(mobile: Placement, desktop: Placement): CSSProperties {
  return {
    ["--m-l" as string]: `${mobile.left}%`,
    ["--m-t" as string]: `${mobile.top}vw`,
    ["--m-w" as string]: `${mobile.width}%`,
    ["--m-r" as string]: `${mobile.rotate ?? 0}deg`,
    ["--d-l" as string]: `${desktop.left}%`,
    ["--d-t" as string]: `${desktop.top}vw`,
    ["--d-w" as string]: `${desktop.width}%`,
    ["--d-r" as string]: `${desktop.rotate ?? 0}deg`,
  };
}
const PLACED = "absolute left-[var(--m-l)] top-[var(--m-t)] w-[var(--m-w)] md:left-[var(--d-l)] md:top-[var(--d-t)] md:w-[var(--d-w)]";
const ROTATED = "rotate-[var(--m-r)] md:rotate-[var(--d-r)]";

/**
 * Layer structure for each collage piece:
 *   [data-scroll] scroll-out choreography
 *   [data-depth]  pointer parallax
 *   [data-piece]  intro animation
 * Stacking (back → front): wordmark 10 · pen line 15 · portrait 20 ·
 * front letters 24 · collage 30 · tagline 40 · torn seam 50.
 */
export function HeroClient({ assets, portrait, alts }: { assets: HeroAssets; portrait: PortraitConfig; alts: HeroSlotAlts }) {
  const root = useRef<HTMLElement>(null);
  const figure = assets.portrait;
  const mode = portrait.mode === "auto" ? (figure && !figure.alpha ? "print" : "cutout") : portrait.mode;
  const place = mode === "print" ? portrait.print : portrait.cutout;

  useEffect(() => {
    const el = root.current;
    if (!el || reducedMotion()) return;

    // On a session's first homepage load the landing reel plays first; the entrance waits for it.
    const waiting = document.documentElement.classList.contains("psy-landing");
    let intro: gsap.core.Timeline | undefined;
    const onLanded = () => intro?.play();
    if (waiting) window.addEventListener("psy:landed", onLanded, { once: true });

    const ctx = gsap.context(() => {
      // Kept short so the hero reads within about a second (letters, then portrait and text together).
      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: waiting });
      intro = tl;
      tl.fromTo(
        "[data-letter]",
        { yPercent: 105, rotate: (_, t) => TILT[idx(t)] * 6, autoAlpha: 0 },
        { yPercent: 0, rotate: 0, autoAlpha: 1, duration: 1.05, delay: (_, t) => idx(t) * 0.04 },
      )
        .fromTo(
          "[data-portrait]",
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.12, autoAlpha: 1 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.2, ease: "expo.inOut", clearProps: "clipPath" },
          0.1,
        )
        .fromTo(
          "[data-piece]",
          { autoAlpha: 0, scale: 0.7, rotate: (i) => (i % 2 ? 14 : -14), y: 60 },
          { autoAlpha: 1, scale: 1, rotate: 0, y: 0, duration: 1.05, stagger: 0.06 },
          0.35,
        )
        .fromTo("[data-tagline] .split-unit", { yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.045 }, 0.3)
        .fromTo("[data-hero-fade]", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.04 }, 0.5);

      el.querySelectorAll<SVGPathElement>("[data-hero-draw] path, [data-hero-swoosh] path").forEach((path, i) => {
        const len = path.getTotalLength() || 1000;
        tl.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: i ? 1 : 1.8, ease: "power2.inOut" }, i ? 0.9 : 0.4);
      });

      // Scroll-out: the collage leaves as one layered print. Pieces cut by the hero's
      // bottom edge (iris, moon, rock) sink with it so their cropped edges never show;
      // the wordmark sinks behind the portrait and fades; only the eye and the tagline,
      // which float free, lift away.
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (c) => {
        const d = c.conditions?.desktop;
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1.2 } })
          .to("[data-glyph]", { yPercent: (_, t) => SINK_Y[idx(t)] * (d ? 1 : 0.55), autoAlpha: 0.25, ease: "none" }, 0)
          .to('[data-scroll="portrait"]', { yPercent: d ? portrait.scrollRise : portrait.scrollRise / 2, ease: "none" }, 0)
          .to('[data-scroll="iris"]', { yPercent: d ? 16 : 5, scale: 1.04, transformOrigin: "50% 100%", ease: "none" }, 0)
          .to('[data-scroll="moon"]', { yPercent: 12, rotate: -2, ease: "none" }, 0)
          .to('[data-scroll="rock"]', { yPercent: 14, ease: "none" }, 0)
          .to('[data-scroll="eye"]', { yPercent: -22, rotate: 3, ease: "none" }, 0)
          .to('[data-scroll="tagline"]', d ? { yPercent: -18, autoAlpha: 0.15, ease: "none" } : { autoAlpha: 0.6, ease: "none" }, 0);
      });
    }, el);

    // Pointer parallax on desktop.
    const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-depth]")).map((node) => ({
      d: parseFloat(node.dataset.depth ?? "0"),
      x: gsap.quickTo(node, "x", { duration: 1.2, ease: "power3" }),
      y: gsap.quickTo(node, "y", { duration: 1.2, ease: "power3" }),
    }));
    const fine = window.matchMedia("(pointer: fine)").matches;
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach((l) => {
        l.x(nx * l.d * 60);
        l.y(ny * l.d * 40);
      });
    };
    if (fine) window.addEventListener("pointermove", move, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("psy:landed", onLanded);
      ctx.revert();
    };
  }, [portrait.scrollRise]);

  const year = String(new Date().getFullYear());
  const front = new Set(portrait.frontLetters);

  // Traced SVG wordmark (src/components/art/Wordmark.tsx). Desktop placement is
  // the traced box's position in the 977px reference: x 10, y 38, w 880.
  const wordmark = (layer: "back" | "front") => {
    const box = `pointer-events-none absolute left-[3%] top-[21vw] w-[94%] md:left-[1.02%] md:top-[3.89vw] md:w-[90.07%] ${layer === "back" ? "z-10" : "z-[24]"}`;
    return layer === "back" ? (
      <h1 id="hero-title" className={box}>
        <span className="sr-only">Psyixel — {site.tagline}</span>
        <Wordmark idPrefix="wm" />
      </h1>
    ) : (
      <div aria-hidden="true" className={box}>
        <Wordmark idPrefix="wmf" visible={front} />
      </div>
    );
  };

  return (
    <section ref={root} data-hero aria-labelledby="hero-title" className="relative isolate overflow-hidden md:h-[58.1vw] md:min-h-[620px]">
      {wordmark("back")}

      {/* ── Pen line looping from the index down into the iris ── */}
      <svg data-hero-draw aria-hidden="true" viewBox="0 0 1000 570" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 z-[15] hidden h-full w-full text-lav md:block">
        <path
          d="M28 268 C 110 236 236 232 262 286 C 288 340 236 382 206 362 C 176 342 214 296 262 318 C 306 338 300 392 318 446"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          opacity="0.85"
        />
      </svg>

      {/* ── Portrait ── */}
      <div data-scroll="portrait" className={`${PLACED} z-20`} style={placementVars(place.mobile, place.desktop)}>
        <div data-depth={portrait.pointerDepth}>
          <HeroFigure asset={figure} mode={mode} config={portrait} />
        </div>
      </div>

      {portrait.frontLetters.length > 0 && wordmark("front")}

      {/* ── Collage slots: image from public/images/collage/ when present, SVG stand-in otherwise ── */}
      <div data-scroll="eye" className={`${PLACED} z-30 hidden md:block`} style={placementVars(slots.eye.mobile, slots.eye.desktop)}>
        <div data-depth="0.9">
          <div data-piece>
            {assets.eye?.alpha ? (
              <CollageCutout asset={assets.eye} alt={alts.eye} sizes="(max-width: 768px) 42vw, 17vw" fallback={null} />
            ) : (
              <Torn paper paperColor="#a98fd8" seed={12} depth={5} className="aspect-[5/3.3] rotate-[4deg] drop-shadow-[0_24px_40px_rgba(0,0,0,0.55)]">
                <Plate image={{ ...heroCollage.eye, src: assets.eye?.src, alt: alts.eye }} showTag={false} className="h-full w-full" sizes="27vw" />
              </Torn>
            )}
          </div>
        </div>
      </div>

      <div data-scroll="moon" className={`${PLACED} z-30 hidden md:block`} style={placementVars(slots.moon.mobile, slots.moon.desktop)}>
        <div data-depth="1.1">
          <div data-piece>
            {assets.moon?.alpha ? (
              <CollageCutout asset={assets.moon} alt={alts.moon} sizes="(max-width: 768px) 38vw, 19vw" fallback={null} />
            ) : (
              <Torn paper seed={4} className="aspect-[4/3.7] -rotate-[5deg] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                <Plate image={{ ...heroCollage.moon, src: assets.moon?.src, alt: alts.moon }} showTag={false} className="h-full w-full" sizes="17vw" />
              </Torn>
            )}
          </div>
        </div>
      </div>

      <div data-scroll="iris" className={`${PLACED} z-30`} style={placementVars(slots.iris.mobile, slots.iris.desktop)}>
        <div data-depth="1.6">
          <div data-piece>
            <CollageCutout asset={assets.iris} alt={alts.iris} sizes="(max-width: 768px) 74vw, 36vw" fallback={<FlowerCut className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.65)]" rotate={-22} />} />
          </div>
        </div>
      </div>

      <div data-scroll="rock" className={`${PLACED} z-30 hidden md:block`} style={placementVars(slots.rock.mobile, slots.rock.desktop)}>
        <div data-depth="0.7">
          <div data-piece>
            <CollageCutout asset={assets.rock} alt={alts.rock} sizes="(max-width: 768px) 30vw, 13vw" fallback={<RockShard seed={9} className="aspect-[3/4]" />} />
          </div>
        </div>
      </div>

      {/* ── Worlds index ── */}
      <ul className="t-label absolute left-[9.3%] top-[27.4vw] z-30 hidden text-ivory/85 md:block md:text-[max(0.6875rem,1.08vw)] md:leading-[1.65] md:tracking-[0.2em]">
        {worlds.map((w) => (
          <li key={w.key} data-hero-fade>
            {w.title} /
          </li>
        ))}
      </ul>

      {/* ── Year mark ── */}
      <div data-hero-fade aria-hidden="true" className="t-label absolute right-[2.2%] top-[24.5vw] z-30 hidden flex-col items-center leading-tight text-ivory/70 md:flex">
        <span>{year.slice(0, 2)}</span>
        <span className="my-1.5 h-px w-4 bg-ivory/60" />
        <span>{year.slice(2)}</span>
        <span className="mt-1">//</span>
      </div>

      <div data-depth="1.3" className="absolute right-[3%] top-[34vw] z-30 hidden text-ivory md:block">
        <div data-piece>
          <Sparkle size={40} className="twinkle" />
        </div>
      </div>

      {/* Phones: the iris file ends in a flat edge (on desktop the torn rule covers it), so the
          flower and portrait sink together into the page colour before the tagline. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 top-[128vw] z-[35] bg-[linear-gradient(to_bottom,transparent_0,rgba(12,11,13,0.7)_10vw,#0c0b0d_19vw)] md:hidden" />

      {/* ── Tagline ── */}
      <div data-scroll="tagline" className="gutter relative z-40 mt-[149vw] pb-16 md:absolute md:right-[8.5%] md:top-[28vw] md:mt-0 md:w-[24vw] md:p-0 md:text-center">
        <p data-tagline className="t-serif text-[9.6vw] leading-[0.94] text-ivory md:text-[4.55vw] max-md:text-[10.4vw] max-md:leading-[1.02]">
          <span className="md:hidden">{taglineLines(["Between the visible", "and the imagined."])}</span>
          <span className="hidden md:inline">{taglineLines(["Between", "the visible", "and the", "imagined."], [0, 0.5, 0.9, 0.2])}</span>
        </p>
        <svg viewBox="0 0 300 20" className="ml-auto mt-1 w-[72%] text-lav md:mx-auto max-md:ml-0 max-md:mt-2 max-md:w-[58%]" aria-hidden="true" data-hero-swoosh>
          <path d="M2 15 C 80 5 200 4 298 8" stroke="currentColor" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </svg>
        <p data-hero-fade className="t-label ml-auto mt-5 max-w-[17rem] text-[0.6rem] text-ivory/75 md:mx-auto md:max-w-[23vw] md:text-left md:text-[max(0.6rem,0.97vw)] md:leading-[1.5] md:tracking-[0.18em] max-md:ml-0 max-md:max-w-[21rem] max-md:text-[0.7rem] max-md:leading-[1.75] max-md:text-ivory/80">
          {site.heroNote}
        </p>
      </div>

      <TornRule seed={3} tone="rule" cover className="!absolute inset-x-0 bottom-0 z-50" />
    </section>
  );
}

/** Tagline lines for the split entrance; `indent` (em) staggers the desktop lines. */
function taglineLines(lines: string[], indent: number[] = []) {
  return lines.map((line, i) => (
    <span key={i} className="split-line" style={indent[i] ? { paddingLeft: `${indent[i]}em` } : undefined}>
      {line.split(" ").map((w, j) => (
        <span key={j} className="split-unit mr-[0.22em]">
          {w}
        </span>
      ))}
    </span>
  ));
}

/** The hero figure: supplied cut-out, supplied photo as a torn print, or the SVG stand-in. */
function HeroFigure({ asset, mode, config }: { asset: CollageAsset | null; mode: "cutout" | "print"; config: PortraitConfig }) {
  const tone = config.mono ? "grayscale(1) contrast(1.16) brightness(0.97)" : "none";
  const flip = config.flip ? { transform: "scaleX(-1)" } : undefined;

  if (!asset) {
    return (
      <div data-portrait className="relative aspect-[6/7]">
        <Portrait className="absolute inset-0 h-full w-full" />
        <span className="sr-only">{config.alt} (placeholder illustration)</span>
      </div>
    );
  }

  if (mode === "print") {
    return (
      <div data-portrait className={ROTATED}>
        <Torn paper seed={17} depth={2.6} className="drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]" style={{ aspectRatio: `${asset.width} / ${asset.height}` }}>
          <Image src={asset.src} alt={config.alt} fill priority sizes="(max-width: 768px) 80vw, 34vw" className="object-cover" style={{ filter: tone, ...flip }} />
        </Torn>
      </div>
    );
  }

  const fade =
    config.fadeBottom > 0 || config.fadeTop > 0
      ? `linear-gradient(to bottom, ${config.fadeTop > 0 ? `transparent ${config.fadeTop * 0.25}%, #000 ${config.fadeTop}%` : "#000 0%"}, #000 ${100 - config.fadeBottom}%, ${config.fadeBottom > 0 ? "transparent" : "#000"})`
      : undefined;
  return (
    <div data-portrait className={`relative ${ROTATED}`} style={{ aspectRatio: `${asset.width} / ${asset.height}`, maskImage: fade, WebkitMaskImage: fade }}>
      <Image
        src={asset.src}
        alt={config.alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 60vw"
        className="object-contain"
        style={{ filter: `${tone} drop-shadow(0 30px 40px rgba(0,0,0,0.55))`, ...flip }}
      />
    </div>
  );
}
