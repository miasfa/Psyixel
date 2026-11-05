"use client";

import { useEffect, useRef, useState } from "react";
import { Plate } from "@/components/art/Plate";
import { TLink } from "@/components/motion/TLink";
import { Arrow, SampleTag } from "@/components/ui/Bits";
import type { PhotoCollection, PhotoTag } from "@/content/types";
import { gsap, reducedMotion } from "@/lib/motion";

const FILTERS: { key: "all" | PhotoTag; label: string }[] = [
  { key: "all", label: "All" },
  { key: "people", label: "People" },
  { key: "places", label: "Places" },
  { key: "nature", label: "Nature" },
  { key: "sky", label: "Sky" },
];

/** Collection tiles with tag filters; matching tiles re-stack with a short stagger. */
export function CollectionsGrid({ collections }: { collections: PhotoCollection[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const grid = useRef<HTMLUListElement>(null);
  const first = useRef(true);
  const shown = collections.filter((c) => filter === "all" || c.tags?.includes(filter));
  const available = FILTERS.filter((f) => f.key === "all" || collections.some((c) => c.tags?.includes(f.key as PhotoTag)));

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!grid.current || reducedMotion()) return;
    gsap.fromTo(grid.current.children, { y: 40, autoAlpha: 0, rotate: 1.5 }, { y: 0, autoAlpha: 1, rotate: 0, duration: 0.9, stagger: 0.08, ease: "expo.out" });
  }, [filter]);

  return (
    <>
      <div role="group" aria-label="Filter collections" className="mt-10 flex flex-wrap gap-2.5">
        {available.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className="t-label border border-ivory/40 px-4 py-2.5 text-ivory/80 transition-colors duration-300 hover:border-lav hover:text-ivory aria-pressed:border-lav aria-pressed:bg-lav aria-pressed:text-ink"
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul ref={grid} className="mt-12 grid gap-8 md:grid-cols-3 md:gap-[1.6vw]">
        {shown.map((c, i) => (
          <li key={c.slug} className={i % 3 === 1 ? "md:mt-[5vw]" : i % 3 === 2 ? "md:mt-[2vw]" : ""}>
            <TLink href={`/photography/${c.slug}`} transitionLabel={c.title} data-cursor="Enter" className="group block">
              <div className="border-[3px] border-ivory/80 bg-ink p-[3px] transition-[transform,border-color] duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-2 group-hover:border-lav">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <div className="duotone-hover absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.06]">
                    <Plate image={c.cover} className="h-full w-full" sizes="(max-width: 768px) 100vw, 32vw" />
                  </div>
                  <span className="t-label absolute left-3 top-3 bg-ink/70 px-2 py-1 text-[0.75rem] text-ivory/85">
                    {String(i + 1).padStart(2, "0")} · {c.photos.length} images
                  </span>
                </div>
              </div>
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="t-condensed text-4xl transition-colors duration-500 group-hover:text-lav md:text-[2.6vw]">{c.title}</h3>
                  <p className="t-label mt-1 text-lav">{(c.tags ?? []).join(" / ")}</p>
                  {c.poem && <p className="t-serif mt-3 text-2xl text-ivory/80">{c.poem}</p>}
                </div>
                <Arrow className="mt-3 shrink-0 transition-transform duration-500 group-hover:translate-x-2" />
              </div>
              {c.placeholder && <SampleTag className="mt-4" />}
            </TLink>
          </li>
        ))}
      </ul>
    </>
  );
}
