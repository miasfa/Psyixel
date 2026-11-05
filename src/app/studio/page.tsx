import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CollageCutout } from "@/components/art/CollageCutout";
import { LavenderScrap, Sparkle, TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { TLink } from "@/components/motion/TLink";
import { Arrow, ArrowLink, Index, SampleTag, EmptyNote } from "@/components/ui/Bits";
import { process, services, studioFocus, studioProjects } from "@/content";
import { findCollageAsset } from "@/lib/collage";

export const metadata: Metadata = pageMeta({
  title: "Studio",
  description: "Websites, visual identities, and creative direction by Psyixel. Explore the studio and get in touch about a project.",
  path: "/studio",
});

/*
 * Layout follows references/inner-pages/studio-visual-concept.png (1440 × 945).
 * Desktop positions are concept px ÷ 14.4 (vw); below md everything stacks.
 */
export default async function StudioPage() {
  const collage = await findCollageAsset("studio-hero-collage");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="studio-title" className="relative overflow-hidden pb-16 pt-24 md:h-[65.6vw] md:min-h-[640px] md:pb-0 md:pt-0">
        <div className="gutter md:contents">
          <h1 id="studio-title" className="relative md:absolute md:left-[6.1vw] md:top-[9.6vw]">
            <SplitText as="span" className="t-poster block text-[30vw] tracking-[0.06em] md:text-[14.6vw]" lines={["Studio"]} />
          </h1>

          <p data-reveal="up" data-delay="0.2" className="t-serif relative z-10 mt-6 text-[9.6vw] [text-shadow:0_0_0.18em_rgb(12_11_13/0.95),0_0_0.45em_rgb(12_11_13/0.7)] leading-[1.02] text-ivory md:absolute md:left-[6.7vw] md:top-[24vw] md:mt-0 md:text-[3.87vw] md:leading-[4.15vw]">
            Thoughtfully made.
            <br />
            With a point of view.
          </p>

        {/* paper form + lavender brush, kept clear of the tagline (text still sits above at z-10) */}
          <div data-speed="-0.12" className="pointer-events-none relative -mx-[calc(var(--gutter)+6%)] mt-6 md:absolute md:left-[42.5vw] md:top-[6.4vw] md:mx-0 md:mt-0 md:w-[57.5vw]" aria-hidden="true">
            <div data-reveal="clip" data-delay="0.15">
              <CollageCutout asset={collage} alt="" sizes="(max-width: 768px) 112vw, 64vw" fallback={null} priority />
            </div>
          </div>

          <p data-reveal="up" data-delay="0.3" className="relative z-10 mt-8 max-w-xl font-sans text-lg [text-shadow:0_0_0.25em_rgb(12_11_13/0.9),0_0_0.6em_rgb(12_11_13/0.6)] leading-[1.5] text-ivory/90 md:absolute md:left-[8.8vw] md:top-[40.3vw] md:mt-0 md:w-[47vw] md:max-w-none md:text-[2vw] md:leading-[2.57vw]">
            I design and build websites, create visual identities, and help give ideas a clear direction.
          </p>

          <ul className="relative mt-10 md:absolute md:left-[9.4vw] md:top-[49.7vw] md:mt-0 md:w-[43.4vw]">
            {studioFocus.map((f, i) => (
              <li key={f.href} data-reveal="left" data-start="top bottom" data-delay={String(0.35 + i * 0.08)}>
                <TLink href={f.href} data-cursor="View" className="group relative flex items-center justify-between py-4 md:h-[4.37vw] md:py-0">
                  <span className="t-label text-base tracking-[0.15em] text-ivory transition-colors duration-500 group-hover:text-lav md:text-[1.72vw]">{f.label}</span>
                  <Arrow className="h-4 w-8 shrink-0 text-ivory transition-transform duration-500 group-hover:translate-x-2 group-hover:text-lav md:h-[1.1vw] md:w-[2.3vw]" />
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-ivory/45" />
                  <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-lav transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
                </TLink>
              </li>
            ))}
          </ul>

          {/* direct route to the case studies further down */}
          <div data-reveal="up" data-start="top bottom" data-delay="0.45" className="relative z-10 mt-10 md:absolute md:left-[62.5vw] md:top-[52.6vw] md:mt-0">
            <TLink
              href="#projects"
              data-magnetic="0.25"
              className="t-label group relative inline-flex items-center gap-6 overflow-hidden bg-lav px-6 py-4 text-ink md:gap-[2vw] md:px-[1.7vw] md:py-[1.05vw] md:text-[max(0.75rem,0.95vw)]"
            >
              <span className="relative z-10">View projects</span>
              <Arrow className="relative z-10 rotate-90 transition-transform duration-500 group-hover:translate-y-1" />
              <span className="absolute inset-0 origin-left scale-x-0 bg-ivory transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100" />
            </TLink>
          </div>
        </div>
      </section>

      <TornRule seed={21} />

      {/* ── Services ─────────────────────────────────────────── */}
      <section id="services" aria-labelledby="services-title" className="gutter relative scroll-mt-20 py-20 md:py-[7vw]">
        <LavenderScrap seed={92} className="absolute -left-[2%] top-[10%] hidden h-[7vw] w-[22vw] -rotate-6 opacity-80 md:block" />
        <div className="grid gap-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-28">
              <Index n="01" />
              <SplitText
                as="h2"
                className="mt-3"
                lines={[
                  { text: "What I", className: "t-heavy text-[15vw] md:text-[5.6vw]" },
                  { text: "can help with", className: "t-serif text-[13vw] md:text-[5vw] text-lav pl-[0.3em]" },
                ]}
              />
              <span id="services-title" className="sr-only">
                What I can help with
              </span>
              {/* second paragraph of the Studio introduction (the first sits in the hero) */}
              <p data-reveal="up" className="mt-8 max-w-sm font-read text-lg leading-relaxed text-ivory/75">
                I care about how something feels, but also how it works. The details should make sense together, from the first impression to the smallest interaction.
              </p>
              <Sparkle size={34} className="twinkle mt-8 hidden text-lav md:block" />
            </div>
          </div>

          <ol className="md:col-span-8">
            {services.map((s, i) => (
              <li key={s.slug} id={s.slug} data-reveal="up" className="group relative scroll-mt-28 border-t border-ivory/20 last:border-b">
                <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-lav/[0.14] to-transparent transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100 group-target:scale-x-100" />
                <div className="relative grid gap-4 py-8 md:grid-cols-[5vw_1fr_auto] md:items-baseline md:gap-[2vw] md:py-[2.6vw]">
                  <span className="t-label text-lav">{String(i + 1).padStart(2, "0")} /</span>
                  <div>
                    <h3 className="t-poster ink text-[16vw] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-2 md:text-[5.6vw]">{s.title}</h3>
                    <p className="mt-4 max-w-xl font-read text-lg leading-relaxed text-ivory/80 md:text-[1.25vw]">{s.summary}</p>
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {s.includes.map((x) => (
                        <li key={x} className="t-label border border-ivory/25 px-2.5 py-1 text-[0.75rem] text-ivory/80 transition-colors group-hover:border-lav/50">
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Arrow className="hidden h-[1.1vw] w-[2.4vw] -rotate-45 text-ivory/60 transition-[transform,color] duration-500 group-hover:rotate-0 group-hover:text-lav md:block" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────── */}
      <section aria-labelledby="process-title" className="relative border-y border-ivory/15 bg-coal/40">
        <div className="gutter py-20 md:py-[6vw]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SplitText
              as="h2"
              lines={[
                { text: "How we’ll", className: "t-heavy text-[14vw] md:text-[4.6vw]" },
                { text: "work", className: "t-serif text-[13vw] md:text-[4.4vw] text-lav pl-[0.3em]" },
              ]}
            />
            <span id="process-title" className="sr-only">
              How we’ll work
            </span>
          </div>
          <ol className="mt-14 grid gap-10 md:grid-cols-4 md:gap-[2vw]">
            {process.map((p, i) => (
              <li key={p.step} data-reveal="up" data-delay={String(i * 0.1)} className="group relative">
                <span aria-hidden="true" className="t-poster block text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(171,146,217,0.55)] transition-colors duration-700 group-hover:text-lav/20 md:text-[8vw]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="t-heavy -mt-[0.4em] text-3xl md:text-[2.2vw]">{p.step}</h3>
                <p className="mt-3 font-read text-lg leading-relaxed text-ivory/75 md:text-[1.15vw]">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Selected projects ────────────────────────────────── */}
      <section id="projects" aria-labelledby="projects-title" className="gutter scroll-mt-20 py-20 md:py-[7vw]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Index n="02" />
            <SplitText
              as="h2"
              className="mt-3"
              lines={[
                { text: "Selected", className: "t-heavy text-[15vw] md:text-[5.6vw]" },
                { text: "Projects", className: "t-serif text-[13vw] md:text-[5vw] text-lav pl-[0.3em]" },
              ]}
            />
            <span id="projects-title" className="sr-only">
              Selected projects
            </span>
          </div>
          <p className="t-label max-w-xs text-ivory/60">Psyixel / creative archive</p>
        </div>

        {studioProjects.length > 0 ? (
          <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-[1.6vw]">
            {studioProjects.map((p, i) => (
              <li key={p.slug} id={p.slug} className="flex" data-reveal="up" data-delay={String(i * 0.12)}>
                <TLink href={`/studio/${p.slug}`} transitionLabel={p.title} data-cursor="View" className="group flex w-full flex-col border border-ivory/25 bg-coal/60 p-[0.6vw] transition-colors duration-500 hover:border-lav/70">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <div className="duotone-hover absolute inset-0 transition-transform duration-[1.4s] ease-[var(--ease-expo)] group-hover:scale-[1.05]">
                      <Plate image={p.cover} className="h-full w-full" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  </div>
                  <div className="flex flex-1 items-start justify-between gap-4 px-2 pb-2 pt-5">
                    <div>
                      <h3 className="t-condensed text-4xl md:text-[2.1vw]">{p.title}</h3>
                      <p className="t-label mt-2 text-lav">{p.disciplines.join(" / ")}</p>
                      <p className="mt-3 max-w-md font-read text-base text-ivory/70">{p.summary}</p>
                    </div>
                    {p.placeholder ? <SampleTag className="shrink-0" /> : <Arrow className="mb-1 shrink-0 self-end transition-transform duration-500 group-hover:translate-x-1.5" />}
                  </div>
                </TLink>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyNote className="mt-12" />
        )}
      </section>

      <TornRule seed={22} />

      {/* ── Inquiry ──────────────────────────────────────────── */}
      <section aria-labelledby="inquiry-title" className="gutter relative overflow-hidden py-24 md:py-[8vw]">
        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-6">
          <h2 id="inquiry-title" className="t-serif text-[14vw] leading-[0.95] md:col-span-7 md:text-[7vw]" data-reveal="up">
            Have something
            <br />
            <span className="pl-[1.2em] text-lav">in mind?</span>
          </h2>
          <div className="md:col-span-4 md:col-start-9">
            <p data-reveal="up" data-delay="0.1" className="font-read text-xl leading-relaxed text-ivory/85">
              You don&rsquo;t need to arrive with everything figured out.
            </p>
            <p data-reveal="up" data-delay="0.15" className="mt-3 font-read text-xl leading-relaxed text-ivory/85">
              Tell me where you&rsquo;d like to begin.
            </p>
            <TLink
              href="/contact?topic=project"
              transitionLabel="Contact"
              data-magnetic="0.25"
              className="t-label group relative mt-8 inline-flex items-center gap-8 overflow-hidden bg-lav px-6 py-4 text-ink"
            >
              <span className="relative z-10">Tell me about your project</span>
              <Arrow className="relative z-10 transition-transform duration-500 group-hover:translate-x-1.5" />
              <span className="absolute inset-0 origin-left scale-x-0 bg-ivory transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100" />
            </TLink>
            <ArrowLink href="/about" label="About" className="mt-6 block w-fit">
              Who&rsquo;s behind the studio
            </ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
