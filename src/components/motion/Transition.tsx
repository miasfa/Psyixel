"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { tornPath } from "@/components/art/Torn";
import { gsap, jumpTo, ScrollTrigger, reducedMotion } from "@/lib/motion";

type Ctx = { navigate: (href: string, label?: string) => void };
const TransitionContext = createContext<Ctx>({ navigate: () => {} });
export const useTransition = () => useContext(TransitionContext);

const TOP = tornPath(31, ["top"], 4, 30);
const BOTTOM = tornPath(32, ["bottom"], 4, 30);
const PAPER = tornPath(33, ["bottom"], 3, 40);

/**
 * Each world has its own transition reel, drawn from its material:
 *   studio  a gridded drafting sheet with crop marks slides across
 *   photo   a shutter closes, flashes, and opens on the next frame
 *   art     a lavender paint wipe, then brush strokes on charcoal
 *   words   an ivory paper sheet drops in with an ink line
 *   music   a record opens from the centre, label spinning, waveform pulsing
 *   torn    (About, Contact, Home) the torn charcoal sheet over lavender
 * Every reel fully covers the screen before the route changes underneath.
 */
type Reel = "torn" | "studio" | "photo" | "art" | "words" | "music";

const reelFor = (href: string): Reel => {
  const p = href.split(/[?#]/)[0];
  if (p.startsWith("/studio")) return "studio";
  if (p.startsWith("/photography")) return "photo";
  if (p.startsWith("/art")) return "art";
  if (p.startsWith("/words")) return "words";
  if (p.startsWith("/music")) return "music";
  return "torn";
};

// Diagonal wipe states for the paint reel (same point count so GSAP can tween them).
const WIPE_LEFT = "polygon(0% 0%, 0% 0%, -25% 100%, -25% 100%)";
const WIPE_FULL = "polygon(0% 0%, 125% 0%, 100% 100%, -25% 100%)";
const WIPE_RIGHT = "polygon(125% 0%, 125% 0%, 100% 100%, 100% 100%)";
const CIRCLE_0 = "circle(0% at 50% 50%)";
const CIRCLE_FULL = "circle(75% at 50% 50%)";

const draw = (tl: gsap.core.Timeline, paths: NodeListOf<SVGPathElement>, at: number, duration: number) =>
  paths.forEach((p, i) => {
    const len = p.getTotalLength() || 1000;
    tl.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration, ease: "power2.inOut" }, at + i * 0.08);
  });

/** When each reel's title starts writing in (s), and the shared letter reveal. */
const SCROLL_KEY = "psy-scroll:";
const savedY = () => {
  try {
    const v = sessionStorage.getItem(SCROLL_KEY + location.pathname + location.search);
    return v === null ? null : Number(v);
  } catch {
    return null;
  }
};

const LABEL_AT: Record<Reel, number> = { torn: 0.42, studio: 0.46, photo: 0.6, art: 0.6, words: 0.5, music: 0.55 };

/**
 * The page behind recedes as a reel covers it (depth), and settles back when it's
 * revealed. Transform only: a filter on the whole page renders badly over the
 * clipped paper and collage pieces (they flashed black or washed out).
 */
function pageRecede() {
  const main = document.getElementById("main");
  if (!main) return;
  gsap.to(main, { scale: 0.975, y: -20, duration: 0.85, ease: "expo.inOut", transformOrigin: `50% ${window.scrollY + window.innerHeight / 2}px` });
}
function pageSettle() {
  const main = document.getElementById("main");
  if (!main) return;
  gsap.fromTo(main, { scale: 1, y: 60 }, { y: 0, duration: 1.1, delay: 0.32, ease: "expo.out", clearProps: "transform" });
}

function reelIn(reel: Reel, el: HTMLElement) {
  const q = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s)!;
  const label = q(".pt-label");
  const tl = gsap.timeline();
  tl.set(el, { autoAlpha: 1 });
  switch (reel) {
    case "studio":
      tl.fromTo(q("[data-sheet]"), { xPercent: -101 }, { xPercent: 0, duration: 0.72, ease: "expo.inOut" })
        .fromTo(el.querySelectorAll("[data-gridline]"), { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "expo.out", stagger: 0.03 }, 0.35)
        .fromTo(el.querySelectorAll("[data-crop]"), { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.05 }, 0.5)
        .fromTo(label, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "expo.out" }, 0.48);
      break;
    case "photo":
      tl.fromTo(q("[data-top]"), { yPercent: -101 }, { yPercent: 0, duration: 0.55, ease: "power4.inOut" })
        .fromTo(q("[data-bottom]"), { yPercent: 101 }, { yPercent: 0, duration: 0.55, ease: "power4.inOut" }, 0)
        .fromTo(q("[data-seam]"), { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: "expo.out" }, 0.42)
        .fromTo(q("[data-flash]"), { autoAlpha: 0 }, { autoAlpha: 0.55, duration: 0.06, yoyo: true, repeat: 1, ease: "none" }, 0.52)
        .fromTo([label, q("[data-counter]")], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out", stagger: 0.06 }, 0.6);
      break;
    case "art":
      tl.fromTo(q("[data-lav]"), { clipPath: WIPE_LEFT }, { clipPath: WIPE_FULL, duration: 0.62, ease: "power3.inOut" })
        .fromTo(q("[data-sheet]"), { clipPath: WIPE_LEFT }, { clipPath: WIPE_FULL, duration: 0.62, ease: "power3.inOut" }, 0.16);
      draw(tl, el.querySelectorAll<SVGPathElement>("[data-stroke] path"), 0.42, 0.5);
      tl.fromTo(label, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "expo.out" }, 0.62);
      break;
    case "words":
      tl.fromTo(q("[data-sheet]"), { yPercent: -108, rotate: -2.5 }, { yPercent: 0, rotate: 0, duration: 0.82, ease: "expo.inOut" })
        .fromTo(label, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.5);
      draw(tl, el.querySelectorAll<SVGPathElement>("[data-ink] path"), 0.62, 0.55);
      break;
    case "music":
      tl.fromTo(q("[data-disc]"), { clipPath: CIRCLE_0 }, { clipPath: CIRCLE_FULL, duration: 0.78, ease: "power3.inOut" })
        .fromTo(q("[data-label-disc]"), { scale: 0, rotate: -90 }, { scale: 1, rotate: 0, duration: 0.7, ease: "back.out(1.6)" }, 0.38)
        .fromTo(q("[data-wave]"), { scaleY: 0.05, autoAlpha: 0 }, { scaleY: 1, autoAlpha: 1, duration: 0.5, ease: "expo.out" }, 0.45)
        .to(q("[data-wave]"), { scaleY: 0.45, duration: 0.18, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.95)
        .fromTo(label, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" }, 0.55);
      gsap.fromTo(q("[data-spin]"), { rotate: 0 }, { rotate: 360, duration: 2.4, ease: "none", repeat: -1 });
      break;
    default:
      tl.fromTo(q("[data-under]"), { yPercent: 105 }, { yPercent: 0, duration: 0.7, ease: "expo.inOut" })
        .fromTo(q("[data-sheet]"), { yPercent: 105 }, { yPercent: 0, duration: 0.75, ease: "expo.inOut" }, 0.08)
        .fromTo(label, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: "expo.out" }, 0.45);
  }
  // Shared: the title writes in letter by letter, each lifting from a slight tilt.
  tl.fromTo(
    el.querySelectorAll(".pt-ch"),
    { yPercent: 115, rotate: 7 },
    { yPercent: 0, rotate: 0, duration: 0.85, ease: "expo.out", stagger: 0.028 },
    LABEL_AT[reel],
  );
  return tl;
}

function reelOut(reel: Reel, el: HTMLElement) {
  const q = <T extends Element = HTMLElement>(s: string) => el.querySelector<T>(s)!;
  const label = q(".pt-label");
  const tl = gsap.timeline({ delay: 0.15 });
  tl.to(el.querySelectorAll(".pt-ch"), { yPercent: -115, duration: 0.42, ease: "expo.in", stagger: 0.016 }, 0);
  switch (reel) {
    case "studio":
      tl.to(label, { clipPath: "inset(0% 0% 0% 100%)", duration: 0.4, ease: "expo.in" })
        .to(el.querySelectorAll("[data-crop]"), { autoAlpha: 0, duration: 0.2 }, 0)
        .to(q("[data-sheet]"), { xPercent: 101, duration: 0.8, ease: "expo.inOut" }, 0.15);
      break;
    case "photo":
      tl.to([label, q("[data-counter]"), q("[data-seam]")], { autoAlpha: 0, duration: 0.25 })
        .to(q("[data-top]"), { yPercent: -101, duration: 0.8, ease: "expo.inOut" }, 0.12)
        .to(q("[data-bottom]"), { yPercent: 101, duration: 0.8, ease: "expo.inOut" }, 0.12);
      break;
    case "art":
      tl.to([label, q("[data-stroke]")], { autoAlpha: 0, duration: 0.3 })
        .to(q("[data-sheet]"), { clipPath: WIPE_RIGHT, duration: 0.7, ease: "power3.inOut" }, 0.1)
        .to(q("[data-lav]"), { clipPath: WIPE_RIGHT, duration: 0.7, ease: "power3.inOut" }, 0.24);
      break;
    case "words":
      tl.to(label, { yPercent: -110, duration: 0.4, ease: "expo.in" })
        .to(q("[data-ink]"), { autoAlpha: 0, duration: 0.25 }, 0)
        .to(q("[data-sheet]"), { yPercent: -108, rotate: 1.8, duration: 0.85, ease: "expo.inOut" }, 0.15);
      break;
    case "music":
      tl.to([label, q("[data-wave]")], { autoAlpha: 0, duration: 0.25 })
        .to(q("[data-label-disc]"), { scale: 0, duration: 0.45, ease: "back.in(1.6)" }, 0)
        .to(q("[data-disc]"), { clipPath: CIRCLE_0, duration: 0.75, ease: "power3.inOut" }, 0.2);
      break;
    default:
      tl.to(label, { yPercent: -100, duration: 0.45, ease: "expo.in" })
        .to(q("[data-sheet]"), { yPercent: -105, duration: 0.85, ease: "expo.inOut" }, 0.2)
        .to(q("[data-under]"), { yPercent: -105, duration: 0.85, ease: "expo.inOut" }, 0.3);
  }
  return tl;
}

export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const active = useRef<Reel>("torn");
  const fallback = useRef<number | undefined>(undefined);
  const [label, setLabel] = useState("");

  /* Back/Forward: the browser's own restoration runs before the new page renders,
     so positions are saved per URL and restored once the route has changed. */
  const popY = useRef<number | null>(null);
  const first = useRef(true);

  const finish = useCallback((reel: Reel) => {
    const el = root.current?.querySelector<HTMLElement>(`[data-reel="${reel}"]`);
    if (!el) return;
    window.clearTimeout(fallback.current);
    pageSettle();
    reelOut(reel, el).eventCallback("onComplete", () => {
      busy.current = false;
      gsap.killTweensOf(el.querySelectorAll("[data-spin]"));
      gsap.set(el, { autoAlpha: 0 });
    });
  }, []);

  useEffect(() => {
    history.scrollRestoration = "manual";
    let t = 0;
    const save = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        try {
          sessionStorage.setItem(SCROLL_KEY + location.pathname + location.search, String(Math.round(window.scrollY)));
        } catch {}
      }, 150);
    };
    const onPop = () => {
      window.clearTimeout(t);
      popY.current = savedY();
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  const navigate = useCallback(
    (href: string, text?: string) => {
      if (busy.current) return;
      const reel = reelFor(href);
      const el = root.current?.querySelector<HTMLElement>(`[data-reel="${reel}"]`);
      if (reducedMotion() || !el) {
        router.push(href);
        return;
      }
      busy.current = true;
      active.current = reel;
      setLabel(text ?? "");
      pageRecede();
      reelIn(reel, el).eventCallback("onComplete", () => {
        router.push(href, { scroll: false });
        // If the route never changes (e.g. a failed navigation), uncover the page anyway.
        fallback.current = window.setTimeout(() => busy.current && finish(reel), 4000);
      });
    },
    [router, finish],
  );

  useEffect(() => {
    const hash = window.location.hash;
    const restore = popY.current;
    popY.current = null;
    const isFirst = first.current;
    first.current = false;
    // Where this page should start: a restored position (Back/Forward, reload),
    // the linked section, or the top.
    let dest: string | number = hash || 0;
    if (restore !== null) dest = restore;
    else if (isFirst) {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      if (nav?.type === "reload" || nav?.type === "back_forward") dest = savedY() ?? dest;
      else if (!hash) return; // fresh load: already at the top
    }
    // The receding page transform must not skew measurements of the new page.
    const main = document.getElementById("main");
    if (busy.current && main) gsap.set(main, { clearProps: "transform" });
    const land = () => jumpTo(dest) || jumpTo(0);
    land();
    // Land again after ScrollTrigger re-measures the new page (pins and fonts can shift it).
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      land();
      if (busy.current) finish(active.current);
    });
  }, [pathname, finish]);

  const text = <Letters text={label || "Psyixel"} />;

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div ref={root} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[110] overflow-hidden" style={{ ["--fit" as string]: fitVw(label || "Psyixel") }}>
        {/* torn: About, Contact, Home */}
        <div data-reel="torn" className="invisible absolute inset-0">
          <div data-under className="absolute inset-x-0 -inset-y-[4vh] bg-lav" style={{ clipPath: TOP }} />
          <div data-sheet className="absolute inset-x-0 -inset-y-[4vh] flex items-center justify-center bg-coal" style={{ clipPath: BOTTOM }}>
            <span className="t-wordmark ink-worn absolute select-none text-[34vw] text-ivory/[0.04]">Psyixel</span>
            <span className="block overflow-hidden">
              <span className="pt-label t-serif block max-w-[92vw] text-center text-[min(clamp(3rem,9vw,8rem),var(--fit))] text-ivory">{text}</span>
            </span>
          </div>
        </div>

        {/* studio: drafting sheet */}
        <div data-reel="studio" className="invisible absolute inset-0">
          <div data-sheet className="absolute inset-0 flex items-center justify-center bg-coal">
            <div className="absolute inset-0 flex justify-between px-[6vw]" aria-hidden="true">
              {Array.from({ length: 9 }, (_, i) => (
                <span key={i} data-gridline className="block h-full w-px origin-top bg-ivory/[0.09]" />
              ))}
            </div>
            <span className="absolute inset-x-0 top-1/2 h-px bg-ivory/[0.09]" />
            {[
              "left-[6vw] top-[12vh] border-l border-t",
              "right-[6vw] top-[12vh] border-r border-t",
              "bottom-[12vh] left-[6vw] border-b border-l",
              "bottom-[12vh] right-[6vw] border-b border-r",
            ].map((c) => (
              <span key={c} data-crop className={`absolute h-[4vmin] w-[4vmin] border-ivory/70 ${c}`} />
            ))}
            <span className="t-label absolute left-[6vw] top-[calc(12vh+5vmin)] text-ivory/50">Psyixel / studio</span>
            <span className="pt-label t-poster relative block max-w-[92vw] text-center text-[min(clamp(4rem,17vw,16rem),var(--fit))] tracking-[0.06em]">{text}</span>
          </div>
        </div>

        {/* photo: shutter */}
        <div data-reel="photo" className="invisible absolute inset-0">
          <div data-top className="absolute inset-x-0 top-0 h-[50.5vh] bg-coal" />
          <div data-bottom className="absolute inset-x-0 bottom-0 h-[50.5vh] bg-coal" />
          <span data-seam className="absolute inset-x-[6vw] top-1/2 h-px bg-ivory/40" />
          <span data-flash className="absolute inset-0 bg-ivory opacity-0" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
            <span className="pt-label t-serif block max-w-[92vw] text-center text-[min(clamp(3rem,9vw,8rem),var(--fit))] leading-none text-ivory">{text}</span>
            <span data-counter className="t-label text-ivory/60">Frame 01 / 24</span>
          </div>
        </div>

        {/* art: paint wipe */}
        <div data-reel="art" className="invisible absolute inset-0">
          <div data-lav className="absolute inset-0 bg-lav" style={{ clipPath: WIPE_LEFT }} />
          <div data-sheet className="absolute inset-0 flex items-center justify-center bg-coal" style={{ clipPath: WIPE_LEFT }}>
            <svg data-stroke viewBox="0 0 1000 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-lav">
              <path d="M-40 380 C 160 300 340 420 540 330 C 700 260 860 300 1040 240" stroke="currentColor" strokeWidth="46" strokeLinecap="round" fill="none" filter="url(#f-paint)" opacity="0.85" />
              <path d="M-40 430 C 200 380 380 470 600 400 C 760 350 900 380 1040 330" stroke="#ece5d8" strokeWidth="14" strokeLinecap="round" fill="none" filter="url(#f-paint)" opacity="0.6" />
            </svg>
            <span className="pt-label t-poster relative block max-w-[92vw] text-center text-[min(clamp(5rem,20vw,18rem),var(--fit))] tracking-[0.08em]">{text}</span>
          </div>
        </div>

        {/* words: paper sheet with an ink line */}
        <div data-reel="words" className="invisible absolute inset-0">
          <div
            data-sheet
            className="absolute inset-x-0 -top-[2vh] bottom-[-6vh] flex flex-col items-center justify-center bg-[#e8e1d2] text-ink"
            style={{ clipPath: PAPER, backgroundImage: "repeating-linear-gradient(to bottom, transparent 0 2.6rem, rgba(108,85,150,0.12) 2.6rem calc(2.6rem + 1px))" }}
          >
            <span className="block overflow-hidden">
              <span className="pt-label t-serif block max-w-[92vw] text-center text-[min(clamp(3.5rem,10vw,9rem),var(--fit))] leading-[1.05]">{text}</span>
            </span>
            <svg data-ink viewBox="0 0 400 40" className="mt-2 w-[min(28rem,60vw)] text-ink/80" aria-hidden="true">
              <path d="M6 26 C 70 10 130 34 200 20 C 260 8 320 30 394 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        </div>

        {/* music: record */}
        <div data-reel="music" className="invisible absolute inset-0">
          <div
            data-disc
            className="absolute inset-0 flex flex-col items-center justify-center bg-coal"
            style={{ clipPath: CIRCLE_0, backgroundImage: "repeating-radial-gradient(circle at 50% 50%, rgba(236,229,216,0.05) 0 1px, transparent 1px 7px)" }}
          >
            <svg data-wave viewBox="0 0 1000 120" preserveAspectRatio="none" className="absolute inset-x-0 top-1/2 h-[16vh] w-full -translate-y-1/2 text-lav">
              <path
                d={`M0 60 ${Array.from({ length: 120 }, (_, i) => `L${round1((i + 1) * 8.4)} ${round1(60 + Math.sin(i * 0.9) * (12 + 36 * Math.exp(-(((i - 60) / 26) ** 2))))}`).join(" ")}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div data-label-disc className="relative grid h-[22vmin] w-[22vmin] place-items-center rounded-full bg-lav shadow-[0_0_60px_rgba(171,146,217,0.35)]">
              <div data-spin className="absolute inset-0">
                <span className="t-label absolute left-1/2 top-[14%] -translate-x-1/2 text-[1.2vmin] tracking-[0.3em] text-ink/70">Psyixel</span>
              </div>
              <span className="h-[2.2vmin] w-[2.2vmin] rounded-full bg-ink" />
            </div>
            <span className="pt-label t-poster relative mt-[6vh] block max-w-[92vw] text-center text-[min(clamp(3rem,10vw,9rem),var(--fit))] tracking-[0.04em]">{text}</span>
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

/** Title split into letters for the shared reveal (ink texture via .ink .split-unit). */
function Letters({ text }: { text: string }) {
  // Letters are grouped per word so a long title wraps between words, never inside one.
  return (
    <>
      {text.split(" ").map((word, w, all) => (
        <span key={w} className="inline-block whitespace-nowrap">
          {Array.from(word).map((c, i) => (
            <span key={i} className="pt-ch split-unit inline-block">
              {c}
            </span>
          ))}
          {w < all.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

/** Caps the title size so its longest word fits the screen (titles wrap between words). */
function fitVw(text: string) {
  const longest = Math.max(4, ...text.split(" ").map((w) => w.length));
  return `${Math.round((84 / (longest * 0.56)) * 10) / 10}vw`;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
