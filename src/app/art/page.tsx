import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CollageCutout } from "@/components/art/CollageCutout";
import { Sparkle, TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { TLink } from "@/components/motion/TLink";
import { Arrow, Index, SampleTag, EmptyNote } from "@/components/ui/Bits";
import { artworks } from "@/content";
import { findCollageAsset } from "@/lib/collage";

export const metadata: Metadata = pageMeta({
  title: "Art",
  description: "Artwork and visual experiments by Psyixel, exploring ideas through image, colour, and texture.",
  path: "/art",
});



/*
 * Layout follows references/inner-pages/art-visual-concept.png (1440 × 945,
 * drawn with a ~33px outer frame that is subtracted). Desktop positions are
 * concept px ÷ 14.4 (vw); below md everything stacks.
 */
export default async function ArtPage() {
  const brush = await findCollageAsset("art-hero-brush");
  const year = String(new Date().getFullYear());
  const featured = artworks.slice(0, 3);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="art-title" className="gutter relative overflow-hidden pb-16 pt-24 md:h-[63.4vw] md:min-h-[620px] md:px-0 md:pb-0 md:pt-0">
        {/* lavender brush strokes, drifting with scroll */}
        <div aria-hidden="true" className="pointer-events-none relative -mx-[var(--gutter)] mt-4 md:absolute md:left-[36.1vw] md:top-[5.5vw] md:mx-0 md:mt-0 md:w-[63.9vw]">
          <div data-speed="-0.15">
            <div data-reveal="clip" data-start="top bottom" data-delay="0.1">
              <CollageCutout asset={brush} alt="" sizes="(max-width: 768px) 100vw, 64vw" fallback={null} priority />
            </div>
          </div>
        </div>

        <h1 id="art-title" className="relative z-10 -mt-[18vw] md:absolute md:left-[6.1vw] md:top-[8.1vw] md:mt-0">
          <SplitText as="span" className="t-poster block text-[42vw] tracking-[0.08em] md:text-[17.6vw]" lines={["Art"]} />
        </h1>

        <p data-reveal="up" data-delay="0.2" className="t-serif relative z-10 mt-4 text-[9vw] leading-[1.05] text-ivory md:absolute md:left-[6.9vw] md:top-[25.6vw] md:mt-0 md:whitespace-nowrap md:text-[3.65vw] md:leading-[3.82vw]">
          A place to follow
          <br className="max-md:hidden" /> an idea without
          <br className="max-md:hidden" /> knowing where it ends.
        </p>

        {/* year mark */}
        <div data-reveal="fade" data-start="top bottom" aria-hidden="true" className="t-label absolute right-[var(--gutter)] top-28 hidden flex-col items-center md:flex text-base leading-tight text-ivory/85 md:left-[93.7vw] md:right-auto md:top-[35.2vw] md:text-[1.45vw]">
          <span>{year.slice(0, 2)}</span>
          <span className="my-[0.35em] h-[2px] w-[1.6em] bg-ivory/80" />
          <span>{year.slice(2)}</span>
          <span className="mt-1">//</span>
        </div>

        {/* three framed works */}
        {featured.length > 0 && (
          <ul className="relative mt-10 grid gap-5 md:absolute md:left-[5.76vw] md:top-[41.3vw] md:mt-0 md:w-[85.8vw] md:grid-cols-3 md:gap-[2.5vw]">
            {featured.map((a, i) => (
              <li key={a.slug} data-reveal="up" data-start="top bottom" data-delay={String(0.35 + i * 0.1)}>
                <TLink href={`/art/${a.slug}`} transitionLabel={a.title} data-cursor="View" className="group relative block border-[2px] border-ivory/85 bg-ink p-[0.28vw] transition-[transform,border-color] duration-700 ease-[var(--ease-expo)] hover:-translate-y-2 hover:border-lav">
                  <div className="relative aspect-[390/240] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.07] group-hover:rotate-[0.6deg]">
                      <Plate image={a.image} showTag={false} className="h-full w-full" sizes="(max-width: 768px) 100vw, 28vw" priority />
                    </div>
                    {/* title slides up on hover */}
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink/90 to-transparent px-4 pb-3 pt-10 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-focus-visible:translate-y-0">
                      <p className="t-condensed text-2xl md:text-[1.9vw]">{a.title}</p>
                    </div>
                    <Arrow className="absolute bottom-[6%] right-[5%] h-4 w-8 text-ivory transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:text-lav md:h-[1.15vw] md:w-[2.3vw]" />
                  </div>
                </TLink>
              </li>
            ))}
          </ul>
        )}
      </section>

      <TornRule seed={41} />

      {/* ── Works ────────────────────────────────────────────── */}
      <section aria-labelledby="works-title" className="gutter relative py-20 md:py-[7vw]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Index n="01" />
            <SplitText
              as="h2"
              className="mt-3"
              lines={[
                { text: "Selected", className: "t-heavy text-[15vw] md:text-[5.6vw]" },
                { text: "works", className: "t-serif text-[13vw] md:text-[5vw] text-lav pl-[0.3em]" },
              ]}
            />
            <span id="works-title" className="sr-only">
              Selected works
            </span>
          </div>
          {artworks.length > 0 && <p className="t-label max-w-xs text-ivory/60">{artworks.length} works</p>}
        </div>
        <div className="mt-10 max-w-2xl space-y-5 font-read text-xl leading-relaxed text-ivory/80 md:mt-[3vw]">
          <p data-reveal="up">This is where I give myself room to try things. I work with images, colour, and texture, sometimes following a clear thought and sometimes finding it through the work.</p>
          <p data-reveal="up" data-delay="0.08">Some pieces arrive quickly. Others change completely before I recognise what I was trying to make.</p>
        </div>

        {artworks.length > 0 ? (
          <ul className="mt-16 grid gap-14 sm:grid-cols-2 md:grid-cols-3 md:gap-x-[2vw] md:gap-y-[4vw]">
            {artworks.map((a, i) => {
              return (
                <li key={a.slug}>
                  <TLink href={`/art/${a.slug}`} transitionLabel={a.title} data-cursor="View" className="group block">
                    <div>
                      <div className="relative aspect-[4/5] overflow-hidden border-[2px] border-ivory/80 bg-coal p-[0.5vw] shadow-[0_40px_80px_rgba(0,0,0,0.55)] transition-[transform,border-color] duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-2 group-hover:border-lav">
                        <div data-reveal="clip" className="relative h-full w-full overflow-hidden">
                          <div className="absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.05]">
                            <Plate image={a.image} className="h-full w-full" sizes="(max-width: 768px) 100vw, 33vw" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* wall label */}
                    <div className="mt-6 flex max-w-sm items-start justify-between gap-6 border-l-2 border-lav pl-4">
                      <div>
                        <p className="t-label text-dust">{String(i + 1).padStart(2, "0")} /</p>
                        <p className="t-condensed mt-1 text-4xl transition-colors group-hover:text-lav md:text-[2vw]">{a.title}</p>
                        <p className="t-label mt-1 text-ivory/70">{[a.year, a.medium].filter(Boolean).join(" · ")}</p>
                        {a.placeholder && <SampleTag className="mt-3" />}
                      </div>
                      <Arrow className="mt-6 shrink-0 transition-transform duration-500 group-hover:translate-x-1.5" />
                    </div>
                  </TLink>
                </li>
              );
            })}
          </ul>
        ) : (
          <EmptyNote className="mt-12" />
        )}
      </section>

      <TornRule seed={42} />

      {/* ── Statement ────────────────────────────────────────── */}
      <section aria-labelledby="statement-title" className="gutter relative overflow-hidden py-24 md:py-[8vw]">
        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-6">
          <h2 id="statement-title" data-reveal="up" className="t-serif text-[13vw] leading-[0.98] md:col-span-7 md:text-[6.4vw]">
            Art doesn&rsquo;t have
            <br />
            <span className="pl-[1em] text-lav">to explain itself.</span>
          </h2>
          <div className="md:col-span-4 md:col-start-9">
            <Sparkle size={36} className="twinkle mb-6 text-lav" />
            <p data-reveal="up" data-delay="0.1" className="font-read text-xl leading-relaxed text-ivory/80">
              I like leaving room for a piece to mean something I hadn&rsquo;t intended.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
