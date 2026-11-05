"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { TLink } from "@/components/motion/TLink";
import { Arrow } from "@/components/ui/Bits";
import { gsap, reducedMotion } from "@/lib/motion";

export type ViewerPhoto = { src: string; alt: string; mono?: boolean; collection: string; collectionTitle: string };

const pad = (n: number) => String(n).padStart(2, "0");
const tone = (p: ViewerPhoto) => (p.mono === false ? "" : "photo-mono");

/**
 * /photography hero: one large feature print plus the next three as framed
 * prints. Arrows, thumbnails and ←/→ keys step through every photo; the new
 * feature wipes in over the old one. Desktop positions are concept px ÷ 14.4.
 */
export function PhotoViewer({ photos }: { photos: ViewerPhoto[] }) {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const incoming = useRef<HTMLDivElement>(null);
  const thumbs = useRef<HTMLUListElement>(null);
  const n = photos.length;

  const go = useCallback(
    (to: number) => {
      const next = ((to % n) + n) % n;
      if (next === index) return;
      setPrev(index);
      setIndex(next);
    },
    [index, n],
  );

  // Wipe the new feature in (bottom → top) over the previous one, then drop it.
  useEffect(() => {
    if (prev === null) return;
    const el = incoming.current;
    const done = () => setPrev(null);
    if (!el || reducedMotion()) return done();
    const tl = gsap.timeline({ onComplete: done });
    tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.1, ease: "expo.inOut" });
    if (thumbs.current)
      // opacity only (not autoAlpha): hiding a focused thumbnail would drop keyboard focus
      tl.fromTo(thumbs.current.children, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.07, ease: "expo.out" }, 0.15);
    return () => {
      tl.kill();
    };
  }, [index, prev]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  if (!n) return null;
  const cur = photos[index];
  const upcoming = [1, 2, 3].map((k) => (index + k) % n).filter((i, k, a) => i !== index && a.indexOf(i) === k);

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Photographs" onKeyDown={onKey} className="contents">
      {/* ── Feature print (bleeds off the hero's bottom edge) ── */}
      <div className="relative mt-8 aspect-[617/620] w-full md:absolute md:left-[4.51vw] md:top-[22.92vw] md:mt-0 md:w-[42.85vw]">
        <TLink href={`/photography/${cur.collection}`} transitionLabel={cur.collectionTitle} data-cursor="Open" className="group absolute inset-0 block overflow-hidden" aria-label={`${cur.alt} — open ${cur.collectionTitle}`}>
          {prev !== null && (
            <Image src={photos[prev].src} alt="" fill sizes="(max-width: 768px) 100vw, 43vw" className={`object-cover ${tone(photos[prev])}`} />
          )}
          <div ref={incoming} key={index} className="absolute inset-0">
            <Image src={cur.src} alt={cur.alt} fill priority sizes="(max-width: 768px) 100vw, 43vw" className={`object-cover transition-transform duration-[1.6s] ease-[var(--ease-expo)] group-hover:scale-[1.03] ${tone(cur)}`} />
          </div>
          {/* fade into the page at the bottom, like the concept's print */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-b from-transparent to-ink/80" />
          <span className="t-label pointer-events-none absolute bottom-[8%] right-[5%] text-[0.75rem] text-ivory/0 transition-colors duration-500 group-hover:text-ivory/80">
            {cur.collectionTitle} ↗
          </span>
        </TLink>
        {/* bottom-left corner mark */}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-[8%] left-[1.6%] h-[8%] w-[8%] border-b-[3px] border-l-[3px] border-ivory/90" />
      </div>

      {/* ── Next three as framed prints ── */}
      <ul ref={thumbs} className="relative mt-6 grid grid-cols-3 gap-3 md:absolute md:left-[50.14vw] md:top-[32.08vw] md:mt-0 md:w-[46.46vw] md:gap-[1.32vw]">
        {upcoming.map((i, k) => (
          <li key={k} data-reveal="up" data-start="top bottom" data-delay={String(0.3 + k * 0.08)}>
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${photos[i].alt}`}
              data-cursor="View"
              className="group block w-full border-[3px] border-ivory/85 bg-ink p-[3px] shadow-[0_24px_40px_rgba(0,0,0,0.55)] transition-[transform,border-color] duration-700 ease-[var(--ease-expo)] hover:-translate-y-2 hover:rotate-[-1.2deg] hover:border-lav focus-visible:border-lav"
            >
              <span className="relative block aspect-[206/269] overflow-hidden">
                <Image src={photos[i].src} alt="" fill sizes="(max-width: 768px) 32vw, 15vw" className={`object-cover transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-110 ${tone(photos[i])}`} />
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* top-right corner mark */}
      <span aria-hidden="true" className="pointer-events-none absolute left-[94.1vw] top-[28.8vw] hidden h-[2.43vw] w-[2.43vw] border-r-[3px] border-t-[3px] border-ivory/90 md:block" />

      {/* ── Counter + arrows + progress ── */}
      <div className="relative mt-8 md:absolute md:left-[51.2vw] md:top-[58.6vw] md:mt-0 md:w-[45vw]">
        <div className="flex items-center justify-between">
          <p className="t-label text-xl tracking-[0.18em] text-ivory md:text-[1.6vw]" aria-live="polite">
            {pad(index + 1)} <span className="text-ivory/60">/</span> {pad(n)}
            <span className="sr-only"> — {cur.alt}</span>
          </p>
          <div className="flex items-center gap-6 md:gap-[5.2vw] md:pr-[2.6vw]">
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous photograph" data-magnetic="0.3" className="group p-2 text-ivory hover:text-lav">
              <Arrow className="h-4 w-8 rotate-180 transition-transform duration-500 group-hover:-translate-x-1.5 md:h-[1.2vw] md:w-[2.4vw]" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next photograph" data-magnetic="0.3" className="group p-2 text-ivory hover:text-lav">
              <Arrow className="h-4 w-8 transition-transform duration-500 group-hover:translate-x-1.5 md:h-[1.2vw] md:w-[2.4vw]" />
            </button>
          </div>
        </div>
        <div className="relative mt-4 h-[2px] w-full bg-ivory/30 md:mt-[1.6vw] md:w-[36.3vw]">
          <span className="absolute inset-y-0 left-0 bg-lav transition-[width] duration-700 ease-[var(--ease-expo)]" style={{ width: `${((index + 1) / n) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
