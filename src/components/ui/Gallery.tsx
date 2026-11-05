"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Plate } from "@/components/art/Plate";
import type { Photo } from "@/content/types";
import { getLenis, gsap, reducedMotion } from "@/lib/motion";

const SPAN: Record<NonNullable<Photo["size"]>, string> = {
  l: "md:col-span-7 aspect-[4/5] md:aspect-[5/4]",
  m: "md:col-span-5 aspect-[4/5]",
  s: "md:col-span-4 aspect-square",
};
const OFFSET = ["", "md:mt-24", "md:-mt-10", "md:mt-14", "", "md:mt-32"];

/** Editorial photo grid with a full-screen viewer (keyboard + swipe friendly). */
export function Gallery({ photos, title }: { photos: Photo[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const touchX = useRef(0);

  const go = useCallback((dir: number) => setOpen((i) => (i === null ? i : (i + dir + photos.length) % photos.length)), [photos.length]);
  const close = useCallback(() => {
    setOpen(null);
    lastTrigger.current?.focus();
  }, []);

  useEffect(() => {
    if (open === null) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, go, close]);

  useEffect(() => {
    if (open === null || !stage.current || reducedMotion()) return;
    gsap.fromTo(stage.current, { autoAlpha: 0, scale: 0.96, clipPath: "inset(8% 8% 8% 8%)" }, { autoAlpha: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.out" });
  }, [open]);

  const photo = open === null ? null : photos[open];

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8">
        {photos.map((p, i) => (
          <li key={i} className={`${SPAN[p.size ?? "m"]} ${OFFSET[i % OFFSET.length]} ${i % 3 === 2 ? "md:col-start-3" : ""}`}>
            <figure className="flex h-full flex-col">
              <button
                type="button"
                onClick={(e) => {
                  lastTrigger.current = e.currentTarget;
                  setOpen(i);
                }}
                aria-label={`Open ${p.alt} full screen`}
                data-cursor="View"
                className="group relative block min-h-0 flex-1 overflow-hidden"
              >
                <div data-reveal="clip" className="h-full w-full">
                  <div className="h-full w-full transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-105">
                    <Plate image={p} className="h-full w-full" sizes="(max-width: 768px) 100vw, 60vw" />
                  </div>
                </div>
              </button>
              <figcaption className="mt-3 flex justify-between gap-4">
                <span className="t-serif text-lg text-ivory/80">{p.caption ?? ""}</span>
                <span className="t-label text-dust">{String(i + 1).padStart(2, "0")}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {photo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${open! + 1} of ${photos.length}`}
          className="fixed inset-0 z-[100] flex flex-col bg-ink/95 backdrop-blur-sm"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
        >
          <div className="gutter flex h-16 items-center justify-between">
            <span className="t-label text-ivory/70">
              {title} — {String(open! + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
            </span>
            <button ref={closeBtn} type="button" onClick={close} className="t-label px-2 py-2 hover:text-lav">
              Close ×
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20">
            <div ref={stage} key={open} className="relative h-full max-h-[78vh] w-full max-w-[min(90vw,calc(78vh*1.25))]">
              <Plate image={photo} className="h-full w-full" sizes="90vw" priority />
            </div>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="t-label absolute left-2 top-1/2 -translate-y-1/2 p-3 hover:text-lav md:left-6">
              ← Prev
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="t-label absolute right-2 top-1/2 -translate-y-1/2 p-3 hover:text-lav md:right-6">
              Next →
            </button>
          </div>
          <p className="t-serif gutter py-5 text-center text-2xl text-ivory/85">{photo.caption ?? photo.alt}</p>
        </div>
      )}
    </>
  );
}
