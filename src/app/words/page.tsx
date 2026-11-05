import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CollageCutout } from "@/components/art/CollageCutout";
import { Sparkle, TornRule } from "@/components/art/Fragments";
import { tornPath } from "@/components/art/Torn";
import { SplitText } from "@/components/motion/SplitText";
import { TLink } from "@/components/motion/TLink";
import { Arrow, ArrowLink, Index, SampleTag, EmptyNote } from "@/components/ui/Bits";
import { getWritings } from "@/content";
import type { Writing } from "@/content/types";
import { findCollageAsset } from "@/lib/collage";

export const metadata: Metadata = pageMeta({
  title: "Words",
  description: "Essays, poems, and reflections by Psyixel. Things I’m still thinking about.",
  path: "/words",
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};
const minutes = (w: Writing) => Math.max(1, Math.round(w.body.map((b) => b.text).join(" ").split(/\s+/).length / 220));
const PAPER = tornPath(57, ["top", "bottom", "left", "right"], 2.4, 30);

/*
 * Layout follows references/inner-pages/words-visual-concept.png (1440 × 945,
 * drawn with a ~33px outer frame that is subtracted). Desktop positions are
 * concept px ÷ 14.4 (vw); below md everything stacks.
 */
export default async function WordsPage() {
  const list = getWritings();
  const latest = list.slice(0, 4);
  const collage = await findCollageAsset("words-hero-collage");
  // Featured: the newest piece with a pull quote, otherwise the newest poem's opening stanza.
  const featured = list.find((w) => w.body.some((b) => b.type === "quote")) ?? list.find((w) => w.body.some((b) => b.type === "verse")) ?? list[0];
  const quote = featured?.body.find((b) => b.type === "quote")?.text ?? featured?.body.find((b) => b.type === "verse")?.text;

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="words-title" className="gutter relative overflow-hidden pb-16 pt-24 md:h-[63.4vw] md:min-h-[620px] md:px-0 md:pb-0 md:pt-0">
        {/* torn handwritten page, flowers, rock, pen loop */}
        <div aria-hidden="true" className="pointer-events-none relative -mr-[var(--gutter)] ml-[18%] md:absolute md:left-[41vw] md:top-[7.08vw] md:m-0 md:w-[59vw]">
          <div data-speed="-0.1">
            <div data-reveal="clip" data-start="top bottom" data-delay="0.15">
              <CollageCutout asset={collage} alt="" sizes="(max-width: 768px) 82vw, 59vw" fallback={null} priority />
            </div>
          </div>
        </div>

        <h1 id="words-title" className="relative z-10 mt-6 md:absolute md:left-[5.6vw] md:top-[9.9vw] md:mt-0">
          <SplitText as="span" className="t-serif block text-[24vw] font-[600] uppercase leading-[0.86] tracking-[-0.075em] text-ivory [font-variation-settings:'opsz'_14] md:text-[12.6vw]" lines={["Words"]} />
        </h1>

        <p data-reveal="up" data-delay="0.2" className="t-serif relative z-10 mt-5 text-[8.6vw] leading-[1.05] text-ivory md:absolute md:left-[6.9vw] md:top-[25.1vw] md:mt-0 md:whitespace-nowrap md:text-[3.6vw] md:leading-[3.96vw]">
          Things I&rsquo;m still
          <br /> thinking about.
        </p>

        {/* latest entries */}
        {latest.length > 0 && (
          <ol className="relative z-10 mt-10 md:absolute md:left-[9vw] md:top-[37.4vw] md:mt-0 md:w-[53vw]" aria-label="Latest writing">
            {latest.map((w, i) => (
              <li key={w.slug} data-reveal="left" data-start="top bottom" data-delay={String(0.35 + i * 0.08)}>
                <TLink
                  href={`/words/${w.slug}`}
                  transitionLabel={w.title}
                  data-cursor="Read"
                  className="group relative grid grid-cols-[1fr_auto] items-center gap-x-4 py-4 md:min-h-[5.2vw] md:grid-cols-[29vw_1fr_auto] md:py-[0.9vw]"
                >
                  <span className="t-label text-base normal-case leading-[1.35] tracking-[0.08em] text-ivory transition-[color,transform] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1.5 group-hover:text-lav md:text-[1.72vw]">
                    {w.title}
                  </span>
                  <Arrow className="hidden h-[1.15vw] w-[2.4vw] text-ivory transition-[transform,color] duration-500 group-hover:translate-x-2 group-hover:text-lav md:block" />
                  {w.placeholder ? (
                    <span className="t-label text-right text-sm tracking-[0.12em] text-ivory/60 md:text-[1.1vw]">Sample</span>
                  ) : (
                    <time dateTime={w.date} className="t-label text-right text-sm normal-case tracking-[0.06em] text-ivory/85 md:text-[1.5vw]">
                      {fmtDate(w.date)}
                    </time>
                  )}
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-ivory/30" />
                  <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-lav transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                </TLink>
              </li>
            ))}
          </ol>
        )}
      </section>

      <TornRule seed={51} />

      {/* ── Featured excerpt ─────────────────────────────────── */}
      {featured && quote && (
        <section aria-labelledby="featured-title" className="gutter relative overflow-hidden py-20 md:py-[7vw]">
          <p className="t-label text-lav">Featured · {featured.kind}</p>
          <h2 id="featured-title" className="sr-only">
            Featured: {featured.title}
          </h2>
          <div className="mt-8 grid items-center gap-10 md:grid-cols-12 md:gap-6">
            <TLink href={`/words/${featured.slug}`} transitionLabel={featured.title} data-cursor="Read" className="group block md:col-span-8">
              <div data-reveal="up" className="relative rotate-[-1.2deg] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:rotate-0">
                <div className="bg-[#e8e1d2] px-[8%] py-[9%] text-ink shadow-[0_40px_80px_rgba(0,0,0,0.55)]" style={{ clipPath: PAPER }}>
                  <p className="whitespace-pre-line font-read text-[6.6vw] italic leading-[1.3] md:text-[2.85vw]">&ldquo;{quote}&rdquo;</p>
                  <p className="t-label mt-8 text-ink/75">
                    {featured.title}
                    {!featured.placeholder && <> — {fmtDate(featured.date)}</>}
                  </p>
                </div>
              </div>
            </TLink>
            <div className="md:col-span-3 md:col-start-10">
              <Sparkle size={32} className="twinkle mb-6 text-lav" />
              <p data-reveal="up" data-delay="0.1" className="font-read text-xl leading-relaxed text-ivory/80">
                {featured.excerpt}
              </p>
              <ArrowLink href={`/words/${featured.slug}`} label={featured.title} className="mt-8">
                Read the {featured.kind.toLowerCase()}
              </ArrowLink>
            </div>
          </div>
        </section>
      )}

      <TornRule seed={52} />

      {/* ── Journal index ────────────────────────────────────── */}
      <section aria-labelledby="journal-title" className="gutter relative py-20 md:py-[7vw]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Index n="01" />
            <SplitText
              as="h2"
              className="mt-3"
              lines={[
                { text: "Writing", className: "t-heavy text-[15vw] md:text-[5.6vw]" },
              ]}
            />
            <span id="journal-title" className="sr-only">
              Writing
            </span>
          </div>
          {list.length > 0 && <p className="t-label max-w-xs text-ivory/60">{list.length} pieces · essays, reflections, poems</p>}
        </div>
        <div className="mt-10 max-w-2xl space-y-5 font-read text-xl leading-relaxed text-ivory/80 md:mt-[3vw]">
          <p data-reveal="up">I write to spend longer with a thought. Sometimes it becomes an essay or a poem. Sometimes a few lines are enough.</p>
          <p data-reveal="up" data-delay="0.08">These are observations, questions, and attempts to put something into words before it slips away.</p>
        </div>

        {list.length > 0 ? (
          <ol className="mt-12 border-t border-ivory/20">
            {list.map((w, i) => (
              <li key={w.slug} data-reveal="up">
                <TLink
                  href={`/words/${w.slug}`}
                  transitionLabel={w.title}
                  data-cursor="Read"
                  className="group relative grid gap-3 border-b border-ivory/20 py-8 md:grid-cols-[5vw_1fr_22vw_9vw_3vw] md:items-baseline md:gap-[1.6vw] md:py-[2.4vw]"
                >
                  <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-lav/[0.12] to-transparent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                  <span className="t-label relative text-lav">{String(i + 1).padStart(2, "0")} /</span>
                  <span className="relative">
                    <span className="t-serif block text-5xl leading-none transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-3 md:text-[4.2vw]">{w.title}</span>
                    {w.placeholder && <SampleTag className="mt-3" />}
                  </span>
                  <span className="relative font-read text-lg leading-snug text-ivory/70">{w.excerpt}</span>
                  <span className="t-label relative text-ivory/60">
                    {w.kind} · {minutes(w)} min
                  </span>
                  <Arrow className="relative hidden -rotate-45 transition-transform duration-500 group-hover:rotate-0 group-hover:text-lav md:block" />
                </TLink>
              </li>
            ))}
          </ol>
        ) : (
          <EmptyNote className="mt-12" />
        )}
      </section>
    </>
  );
}
