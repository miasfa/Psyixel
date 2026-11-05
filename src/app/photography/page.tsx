import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { Orbit, TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { CollectionsGrid } from "@/components/photography/CollectionsGrid";
import { PhotoViewer, type ViewerPhoto } from "@/components/photography/PhotoViewer";
import { Index, EmptyNote } from "@/components/ui/Bits";
import { collections } from "@/content";

export const metadata: Metadata = pageMeta({
  title: "Photography",
  description: "Photographs and collections by Psyixel. People, places, and moments that made me look a little longer.",
  path: "/photography",
});

/*
 * Layout follows references/inner-pages/photography-visual-concept.png (1440 × 945).
 * Desktop positions are concept px ÷ 14.4 (vw); below md everything stacks.
 */
export default function PhotographyPage() {
  // Viewer order: each collection's lead (size "l") photo first, then the rest —
  // so the opening state shows one image per collection, as in the concept.
  const all = collections.flatMap((c) =>
    c.photos.filter((p) => p.src).map((p) => ({ src: p.src!, alt: p.alt, mono: p.mono, lead: p.size === "l", collection: c.slug, collectionTitle: c.title })),
  );
  const photos: ViewerPhoto[] = [...all.filter((p) => p.lead), ...all.filter((p) => !p.lead).reverse()];
  const note = collections[1]?.cover;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="photo-title" className="gutter relative overflow-hidden pb-16 pt-24 md:h-[65.6vw] md:min-h-[640px] md:px-0 md:pb-0 md:pt-0">
        <h1 id="photo-title" className="relative z-20 md:absolute md:left-[5.2vw] md:top-[9.6vw]">
          <SplitText as="span" className="t-poster block origin-left text-[17.4vw] md:scale-x-[0.92] md:text-[15vw] md:tracking-[-0.004em]" lines={["Photography"]} />
        </h1>

        <p data-reveal="up" data-delay="0.25" className="t-serif relative z-20 mt-5 text-[8.4vw] leading-[1.02] text-ivory md:absolute md:left-[78.2vw] md:top-[11.1vw] md:mt-0 md:whitespace-nowrap md:text-[2.55vw] md:leading-[3.05vw]">
          Something
          <br className="max-md:hidden" /> made me look.
          <br />
          Something made
          <br className="max-md:hidden" /> me keep looking.
        </p>

        {photos.length > 0 ? <PhotoViewer photos={photos} /> : <EmptyNote className="relative mt-10 md:absolute md:left-[5.2vw] md:top-[32vw] md:mt-0" />}
      </section>

      <TornRule seed={31} />

      {/* ── Collections ──────────────────────────────────────── */}
      <section aria-labelledby="collections-title" className="gutter relative py-20 md:py-[7vw]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Index n="01" />
            <SplitText
              as="h2"
              className="mt-3"
              lines={[
                { text: "Photographs", className: "t-heavy text-[11vw] md:text-[5.6vw]" },
                { text: "& collections", className: "t-serif text-[13vw] md:text-[5vw] text-lav pl-[0.3em]" },
              ]}
            />
            <span id="collections-title" className="sr-only">
              Photographs &amp; collections
            </span>
          </div>
          {collections.length > 0 && (
            <p className="t-label max-w-xs text-ivory/60">
            {collections.length} collections · {collections.reduce((n, c) => n + c.photos.length, 0)} images
          </p>
          )}
        </div>
        <div className="mt-10 max-w-2xl space-y-5 font-read text-xl leading-relaxed text-ivory/80 md:mt-[3vw]">
          <p data-reveal="up">These photographs begin with attention. A change in the light, a passing expression, a place that feels different when I stop moving.</p>
          <p data-reveal="up" data-delay="0.08">I take the picture because I want to remember what I noticed. Sometimes I understand what drew me to it only later.</p>
        </div>
        {collections.length > 0 ? <CollectionsGrid collections={collections} /> : <EmptyNote className="mt-12" />}
      </section>

      <TornRule seed={32} />

      {/* ── Personal note ────────────────────────────────────── */}
      <section aria-labelledby="note-title" className="gutter relative overflow-hidden py-24 md:py-[8vw]">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-6">
          <div className="relative md:col-span-5">
            <div data-spin="30" className="pointer-events-none absolute -right-[18%] -top-[14%] w-[70%] text-lav/50" aria-hidden="true">
              <Orbit className="w-full" rx={120} ry={30} rotate={-14} />
            </div>
            <div data-speed="0.15">
              <div data-reveal="clip" className="relative rotate-[-3deg] border-[3px] border-ivory/85 bg-ink p-[3px] shadow-[0_40px_70px_rgba(0,0,0,0.6)]">
                {note && <Plate image={note} className="aspect-[4/5] w-full" sizes="(max-width: 768px) 90vw, 38vw" />}
              </div>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 id="note-title" data-reveal="up" className="t-serif text-[13vw] leading-[0.98] md:text-[6vw]">
              What remains
              <br />
              <span className="pl-[0.8em] text-lav">after the moment?</span>
            </h2>
            <p data-reveal="up" data-delay="0.1" className="mt-8 max-w-lg font-read text-xl leading-relaxed text-ivory/80">
              A photograph keeps what was in front of the camera. It also keeps something of the person looking.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
