import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CollageCutout } from "@/components/art/CollageCutout";
import { LavenderScrap, Orbit, Sparkle, TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { TLink } from "@/components/motion/TLink";
import { Arrow, ArrowLink, Index } from "@/components/ui/Bits";
import { site, worlds } from "@/content";
import { findCollageAsset } from "@/lib/collage";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: "The person and curiosity behind Psyixel, a personal world of design, photography, art, writing, and music.",
  path: "/about",
});


/*
 * Layout follows references/inner-pages/about-visual-concept.png (1440 × 945,
 * no outer frame). Desktop positions are concept px ÷ 14.4 (vw); below md
 * everything stacks.
 */
export default async function AboutPage() {
  const [collage, moon] = await Promise.all([findCollageAsset("about-hero-collage"), findCollageAsset("about-hero-moon")]);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="about-title" className="gutter relative overflow-hidden pb-16 pt-24 md:h-[63.3vw] md:min-h-[620px] md:px-0 md:pb-0 md:pt-0">
        <h1 id="about-title" className="relative z-10 md:absolute md:left-[16.3vw] md:top-[8.2vw]">
          <SplitText
            as="span"
            className="block"
            lines={[
              { text: "About", className: "t-heavy ink text-[24vw] leading-[0.9] md:text-[10.4vw] md:leading-[0.95]" },
              { text: "Psyixel", className: "t-serif font-[600] tracking-[-0.06em] [font-variation-settings:'opsz'_14] text-[20vw] leading-[0.95] text-lav uppercase pl-[0.25em] md:pl-[0.5em] md:text-[10.1vw] md:leading-[1.02]" },
            ]}
          />
        </h1>

        <div className="relative z-10 mt-8 md:absolute md:left-[65.6vw] md:top-[12.1vw] md:mt-0 md:w-[31.5vw]">
          {site.about.intro.map((p, i) => (
            <p key={i} data-reveal="up" data-start="top bottom" data-delay={String(0.25 + i * 0.1)} className={`font-sans text-lg leading-[1.45] text-ivory/90 md:text-[1.66vw] md:leading-[2.5vw] ${i ? "mt-5 md:mt-[1.6vw]" : ""}`}>
              {p}
            </p>
          ))}
          <div data-reveal="up" data-start="top bottom" data-delay="0.45">
            <TLink href="#story" data-magnetic="0.2" className="group relative mt-8 inline-flex items-center gap-[2.4vw] pb-3 md:mt-[3.4vw] md:w-[20.6vw] md:justify-between md:pb-[1.3vw]">
              <span className="t-label text-base tracking-[0.2em] text-ivory transition-colors group-hover:text-lav md:text-[1.62vw]">Read on</span>
              <Arrow className="h-4 w-8 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-lav md:h-[1.2vw] md:w-[2.4vw]" />
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-ivory/50" />
              <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-lav transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
            </TLink>
          </div>
        </div>

        {/* marble head, clouds, lavender scraps */}
        <div aria-hidden="true" className="pointer-events-none relative -mx-[var(--gutter)] mt-6 md:absolute md:left-0 md:top-[12.5vw] md:mx-0 md:mt-0 md:w-[70.3vw]">
          <div data-speed="-0.1">
            <div data-reveal="clip" data-start="top bottom" data-delay="0.15">
              <CollageCutout asset={collage} alt="" sizes="(max-width: 768px) 100vw, 70vw" fallback={null} priority />
            </div>
          </div>
        </div>

        {/* moon with orbit */}
        <div aria-hidden="true" className="pointer-events-none relative ml-auto mt-8 w-[60%] md:absolute md:left-[72.8vw] md:top-[38.9vw] md:mt-0 md:w-[24vw]">
          <div data-spin="12">
            <div data-reveal="scale" data-start="top bottom" data-delay="0.5">
              <CollageCutout asset={moon} alt="" sizes="(max-width: 768px) 60vw, 24vw" fallback={null} />
            </div>
          </div>
        </div>
      </section>

      <TornRule seed={71} />

      {/* ── Story ────────────────────────────────────────────── */}
      <section id="story" aria-labelledby="story-title" className="gutter relative scroll-mt-20 overflow-hidden py-20 md:py-[7vw]">
        <LavenderScrap seed={72} className="absolute -right-[3%] top-[2%] hidden h-[8vw] w-[24vw] rotate-6 opacity-80 md:block" />
        <div className="grid gap-12 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-6">
            <Index n="01" />
            <h2 id="story-title" data-reveal="up" className="t-serif mt-6 text-[13vw] leading-[0.98] md:text-[6.2vw]">
              Following my
              <br />
              <span className="pl-[0.8em] text-lav">curiosity</span>
            </h2>
          </div>
          <div className="md:col-span-5 md:col-start-8 md:pt-[4vw]">
            {site.about.work.length > 0 && (
              <div data-reveal="up" className="mb-10 border-l-2 border-lav pl-5">
                <p className="t-label text-dust">The work</p>
                {site.about.work.map((p, i) => (
                  <p key={i} className="mt-3 font-read text-xl leading-relaxed text-ivory/90">
                    {p}
                  </p>
                ))}
              </div>
            )}
            {site.about.long.map((p, i) => (
              <p key={i} data-reveal="up" data-delay={String(i * 0.1)} className={`font-read text-xl leading-relaxed text-ivory/85 ${i ? "mt-6" : ""}`}>
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <TornRule seed={73} />

      {/* ── Five worlds ──────────────────────────────────────── */}
      <section aria-labelledby="five-title" className="relative py-20 md:py-[7vw]">
        <div className="gutter flex flex-wrap items-end justify-between gap-6">
          <div>
            <Index n="02" />
            <SplitText
              as="h2"
              className="mt-3"
              lines={[
                { text: "Different ways of", className: "t-heavy text-[15vw] md:text-[5.6vw]" },
                { text: "paying attention", className: "t-serif text-[13vw] md:text-[5vw] text-lav pl-[0.3em]" },
              ]}
            />
            <span id="five-title" className="sr-only">
              Different ways of paying attention
            </span>
          </div>
          <p className="t-label max-w-xs text-ivory/60">Studio · Photography · Art · Words · Music</p>
        </div>

        <ul className="gutter mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-5 md:gap-[1vw]">
          {worlds.map((w, i) => (
            <li key={w.key} data-reveal="up" data-delay={String(i * 0.07)} className={i % 2 ? "md:mt-[4vw]" : ""}>
              <TLink href={w.href} transitionLabel={w.title} data-cursor="Enter" className="group block border border-ivory/25 bg-coal/60 p-[0.5vw] transition-colors duration-500 hover:border-lav">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <div className="duotone-hover absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.08]">
                    <Plate image={w.cover} showTag={false} className="h-full w-full" sizes="(max-width: 768px) 50vw, 19vw" />
                  </div>
                  <span className="t-label absolute left-2 top-2 bg-ink/70 px-1.5 py-0.5 text-[0.6875rem] text-lav">{w.index}</span>
                </div>
                <div className="flex items-end justify-between gap-2 px-1 pb-1 pt-4">
                  <div>
                    <p className={w.titleStyle === "serif" ? "t-serif text-3xl uppercase md:text-[2.2vw]" : "t-condensed text-3xl md:text-[2.2vw]"}>{w.title}</p>
                    <p className="t-serif mt-1 text-lg text-ivory/75 transition-colors group-hover:text-lav-soft md:text-[1.25vw]">{w.attention}</p>
                  </div>
                  <Arrow className="mb-1 shrink-0 transition-transform duration-500 group-hover:translate-x-1.5 group-hover:text-lav" />
                </div>
              </TLink>
            </li>
          ))}
        </ul>
      </section>

      <TornRule seed={74} />

      {/* ── Closing ──────────────────────────────────────────── */}
      <section className="gutter relative overflow-hidden py-24 text-center md:py-[8vw]">
        <div data-spin="40" className="pointer-events-none absolute left-1/2 top-1/2 w-[80vw] -translate-x-1/2 -translate-y-1/2 text-ivory/15" aria-hidden="true">
          <Orbit className="w-full" rx={200} ry={46} />
        </div>
        <Sparkle size={34} className="twinkle relative mx-auto mb-8 text-lav" />
        <p data-reveal="up" className="t-serif relative mx-auto max-w-4xl text-5xl leading-[1.05] md:text-7xl">
          There&rsquo;s more I want to make.
          <br />
          <span className="text-lav">This is where I&rsquo;ll keep putting it.</span>
        </p>
        <ArrowLink href="/contact?topic=hello" label="Contact" className="relative mt-10">
          Say hello
        </ArrowLink>
      </section>
    </>
  );
}
