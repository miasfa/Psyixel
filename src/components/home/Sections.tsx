import { Headphones, LavenderScrap, Orbit, RockShard, Sparkle, TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { PlateArt } from "@/components/art/PlateArt";
import { Torn } from "@/components/art/Torn";
import { SplitText } from "@/components/motion/SplitText";
import { TLink } from "@/components/motion/TLink";
import { FeaturePlayer } from "@/components/music/Players";
import { Arrow, ArrowLink, Index } from "@/components/ui/Bits";
import { archive, site, worlds } from "@/content";
import { collagePlate, findCollageAsset } from "@/lib/collage";
import { CollageCutout } from "@/components/art/CollageCutout";

/*
 * Homepage sections, laid out against the PSYIXEL reference at desktop width:
 * dense rows separated by torn seams, heavy grotesk + uppercase italic serif,
 * collage pieces that break out of their columns.
 */

/** Slim four-point star used as a section ornament. */
function Star({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden="true">
      <path d="M0 -50 C 2 -8 6 -3 34 0 C 6 3 2 8 0 50 C -2 8 -6 3 -34 0 C -6 -3 -2 -8 0 -50Z" fill="currentColor" />
    </svg>
  );
}

/* ── 01 Manifesto ───────────────────────────────────────────── */
export async function Manifesto() {
  const [collage, flower, petal, horizon] = await Promise.all([
    findCollageAsset("manifesto-collage"),
    collagePlate("manifesto-flower", { variant: "flower", alt: "Lavender flower close-up" }),
    collagePlate("manifesto-petal", { variant: "flower", alt: "Petal detail" }),
    collagePlate("manifesto-horizon", { variant: "horizon", alt: "A lone figure on a hill in lavender haze" }),
  ]);
  return (
    <section aria-labelledby="manifesto-title" className="gutter relative grid gap-12 pb-10 pt-14 lg:grid-cols-12 lg:gap-4 lg:pb-[0.5vw] lg:pt-[1vw]">
      <div className="relative lg:col-span-4">
        <Index n="01" className="lg:absolute lg:left-0 lg:top-[0.6vw]" />
        <Star className="twinkle absolute left-[-1%] top-[44%] hidden w-[4.4vw] text-lav lg:block" />
        <SplitText
          as="h2"
          className="mt-2 lg:mt-0 lg:pl-[17%]"
          lines={[
            { text: "A", className: "t-heavy text-[15vw] lg:text-[4.08vw] -ml-[6%]" },
            { text: "Creative", className: "t-heavy text-[15vw] lg:text-[4.08vw]" },
            { text: "Universe", className: "t-heavy text-[15vw] lg:text-[4.08vw]" },
            { text: "Called", className: "t-heavy text-[15vw] lg:text-[4.08vw]" },
            { text: "Psyixel.", className: "t-serif uppercase text-[15vw] lg:text-[5.9vw] text-lav -mt-[0.04em]" },
          ]}
        />
        <span id="manifesto-title" className="sr-only">
          A creative universe called Psyixel
        </span>
      </div>

      <div className="lg:col-span-3 lg:pl-[1.2vw] lg:pt-[1.4vw]">
        {site.manifesto.body.map((p, i) => (
          <p key={i} data-reveal="up" data-delay={String(i * 0.08)} className={`font-read text-[1.25rem] leading-[1.38] text-ivory/90 lg:text-[1.3vw] ${i ? "mt-4 lg:mt-[0.9vw]" : ""}`}>
            {p}
          </p>
        ))}
        <p data-reveal="up" data-delay="0.15" className="t-serif mt-6 text-[1.6rem] leading-[1.18] text-ivory/80 lg:text-[1.55vw]">
          {site.manifesto.aside}
        </p>
      </div>

      {collage ? (
        <div className="relative lg:static lg:col-span-5">
          <div data-speed="-0.12" className="lg:absolute lg:left-[59.88vw] lg:top-[-1.64vw] lg:w-[37.56vw]">
            <div data-reveal="clip">
              <CollageCutout asset={collage} alt="Collage: lavender flower photographs and a lone figure on a hill" sizes="(max-width: 1024px) 100vw, 38vw" fallback={null} />
            </div>
          </div>
        </div>
      ) : (
      <div className="relative min-h-[80vw] lg:col-span-5 lg:min-h-[20vw]">
        <div data-spin="36" className="absolute left-[2%] top-[0%] w-[38%] text-ivory/45" aria-hidden="true">
          <Orbit className="w-full" rx={120} ry={28} rotate={-10} />
        </div>
        <div data-speed="-0.2" className="absolute right-0 top-[0%] w-[68%]">
          <div data-reveal="clip" data-delay="0.15">
            <Torn seed={23} edges={["left", "bottom", "top"]} depth={3} className="aspect-[4/3.1]">
              <Plate image={flower} className="h-full w-full" sizes="30vw" />
            </Torn>
          </div>
        </div>
        <div data-speed="0.35" className="absolute left-[38%] top-[6%] z-10 w-[18%]">
          <div data-reveal="scale" data-delay="0.35">
            <Torn seed={24} depth={8} className="aspect-[4/3]">
              <Plate image={petal} showTag={false} className={`h-full w-full ${petal.src ? "" : "scale-150"}`} sizes="10vw" />
            </Torn>
          </div>
        </div>
        <div data-speed="0.25" className="absolute bottom-[0%] left-0 z-20 w-[50%]">
          <div data-reveal="clip">
            <Torn seed={22} edges={["top", "right"]} depth={4} className="aspect-[4/2.6]">
              <Plate image={horizon} className="h-full w-full" sizes="20vw" />
            </Torn>
          </div>
        </div>
      </div>
      )}
    </section>
  );
}

/* ── Five worlds ────────────────────────────────────────────── */

/**
 * Card titles share one cap height (as in the reference); long words are
 * narrowed horizontally to fit, like a condensed poster face.
 * 0.47em ≈ average Barlow Condensed ExtraBold cap width; 13.85vw = widest title in the reference.
 */
function worldTitleFit(title: string) {
  // Anton, sized to the reference's card headings; long titles are narrowed rather than shrunk.
  const fs = title.length > 8 ? 3.95 : 4.45; // vw
  const sx = Math.min(1, 13.85 / (title.length * 0.47 * fs));
  return { ["--fs-lg"]: `${fs}vw`, ["--sx"]: sx.toFixed(3) };
}
export function Worlds() {
  return (
    <section aria-labelledby="worlds-title" className="relative pb-[1.4vw]">
      <h2 id="worlds-title" className="sr-only">
        Five creative worlds
      </h2>
      <ul className="flex snap-x snap-mandatory gap-[0.7vw] overflow-x-auto px-[1.3vw] pb-4 [scrollbar-width:none] lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0">
        {worlds.map((w, i) => (
          <li key={w.key} className="w-[74vw] shrink-0 snap-start sm:w-[44vw] lg:w-auto" data-reveal="up" data-delay={String(i * 0.08)}>
            <TLink
              href={w.href}
              transitionLabel={w.title}
              data-cursor="Enter"
              className="group relative block aspect-[0.9] overflow-hidden border border-ivory/25 bg-coal transition-colors duration-500 hover:border-lav"
            >
              <div
                className={`duotone-hover absolute overflow-hidden transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.06] ${
                  w.cover.src ? "world-band inset-x-[1.5%] top-[22.5%]" : "inset-[0.45vw] top-[1.9vw]"
                }`}
              >
                <Plate image={w.cover} className="h-full w-full" sizes="(max-width: 1024px) 74vw, 20vw" tagClass="right-2 top-[40%]" />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-ink via-ink/70 to-transparent" />

              <span
                className={`absolute left-[0.6vw] top-[0.3vw] z-10 block origin-left whitespace-nowrap transition-[transform,color,letter-spacing] duration-700 ease-[var(--ease-expo)] group-hover:translate-x-1 group-hover:text-lav ${
                  w.titleStyle === "serif" ? "t-serif uppercase text-[13vw] sm:text-[7vw] lg:text-[3.47vw]" : "world-title uppercase leading-[0.9] [font-family:var(--font-display)]"
                }`}
                style={w.titleStyle === "serif" ? undefined : (worldTitleFit(w.title) as React.CSSProperties)}
              >
                {w.title}
              </span>
              <span className="t-label absolute right-[0.7vw] top-[0.7vw] z-10 text-[0.7rem] text-ivory/75 lg:text-[max(0.6rem,0.96vw)]">/{w.index}</span>

              {/* hover: lavender scrap + "Things I …" */}
              <LavenderScrap
                seed={40 + i}
                className="absolute -left-[12%] bottom-[26%] h-[15%] w-[78%] -translate-x-full -rotate-6 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-0"
              />
              <span className="t-serif absolute bottom-[28%] left-[0.8vw] translate-y-4 text-2xl text-ink opacity-0 transition-all delay-100 duration-700 ease-[var(--ease-expo)] group-hover:translate-y-0 group-hover:opacity-100 lg:text-[1.5vw]">
                {w.thing}
              </span>

              <div className="absolute inset-x-[0.9vw] bottom-[0.8vw] z-10 flex items-end justify-between gap-3">
                <p className="t-label max-w-[15rem] text-[0.75rem] leading-[1.6] text-ivory/80 lg:max-w-[16.5vw] lg:text-[max(0.75rem,0.72vw)] lg:leading-[1.4] lg:tracking-[0.06em] xl:leading-[1.63] xl:tracking-[0.12em]">{w.caption}</p>
                <Arrow className="shrink-0 text-ivory transition-transform duration-500 group-hover:translate-x-1 group-hover:text-lav" />
              </div>
            </TLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── Music feature ──────────────────────────────────────────── */
export async function MusicFeature() {
  const [collage, headphones, rock] = await Promise.all([findCollageAsset("music-collage"), findCollageAsset("headphones"), findCollageAsset("music-rock")]);
  return (
    <section aria-labelledby="music-title" className="relative">
      <TornRule seed={5} tone="rule" cover />
      <div className="gutter relative grid items-center gap-10 py-12 lg:grid-cols-12 lg:gap-4 lg:py-[0.6vw]">
        {collage ? (
          <div className="relative hidden h-[12vw] lg:col-span-3 lg:block" aria-hidden="true">
            <div data-speed="-0.15" className="absolute bottom-[-1.2vw] left-[calc(var(--gutter)*-1)] w-[25.2vw]">
              <div className="drift">
                <CollageCutout asset={collage} alt="" sizes="26vw" fallback={null} />
              </div>
            </div>
          </div>
        ) : (
        <div className="relative hidden h-[12vw] lg:col-span-3 lg:block" aria-hidden="true">
          <LavenderScrap seed={52} className="absolute -left-[16%] bottom-[-8%] h-[46%] w-[96%] rotate-[-3deg]" />
          <div data-speed="0.3" className="absolute -left-[14%] bottom-[-14%] w-[44%]">
            <CollageCutout asset={rock} alt="" sizes="8vw" fallback={<RockShard seed={51} className="aspect-[4/3]" />} />
          </div>
          <div data-speed="-0.25" className="absolute left-[10%] top-[-6%] w-[74%]">
            <div data-reveal="scale">
              <div className="drift">
                <CollageCutout asset={headphones} alt="" sizes="20vw" fallback={<Headphones className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)]" />} />
              </div>
            </div>
          </div>
        </div>
        )}

        <div className="relative lg:col-span-3">
          <p className="t-label text-ivory/70">// Music</p>
          <h2 id="music-title" className="t-serif mt-1 text-[22vw] leading-[0.85] lg:text-[5.6vw]" data-split="scroll">
            <TLink href="/music" transitionLabel="Music" data-cursor="Enter" className="block transition-colors hover:text-lav">
            <span className="sr-only">Listen. Enter the music room</span>
            <span className="split-line" aria-hidden="true">
              {Array.from("LISTEN.").map((c, i) => (
                <span key={i} className="split-unit">
                  {c}
                </span>
              ))}
            </span>
            </TLink>
          </h2>
          <p data-reveal="up" className="t-serif mt-1 max-w-xs text-xl leading-snug text-ivory/80 lg:text-[1.25vw]">
            Some things take shape as sound.
          </p>
          {/* thread from the title to the player */}
          <svg aria-hidden="true" viewBox="0 0 200 80" className="absolute right-[-22%] top-[18%] hidden w-[38%] text-lav/80 lg:block">
            <path data-draw d="M2 40 C 50 70 90 10 130 30 C 160 46 180 40 198 30" stroke="currentColor" strokeWidth="1.3" fill="none" />
          </svg>
        </div>

        <div className="lg:col-span-6 lg:pl-[3vw]" data-reveal="up" data-delay="0.15">
          <FeaturePlayer />
        </div>
      </div>
      <TornRule seed={6} tone="rule" cover />
    </section>
  );
}

/* ── 02 Selected work / archive ─────────────────────────────── */
const WORLD_LABEL: Record<string, string> = { studio: "Studio", photography: "Photography", art: "Art", words: "Words", music: "Music" };

export function SelectedWork() {
  if (!archive.length) return null;
  return (
    <section aria-labelledby="work-title" className="gutter relative grid gap-10 py-14 lg:grid-cols-12 lg:gap-4 lg:py-[1vw]">
      <LavenderScrap seed={61} className="absolute left-[-1.5%] top-[38%] hidden h-[56%] w-[4.5vw] rotate-[8deg] lg:block" />
      <div className="relative lg:col-span-3 lg:pl-[1vw]">
        <Index n="02" />
        <SplitText
          as="h2"
          className="mt-2"
          lines={[
            { text: "Selected", className: "t-heavy text-[14vw] lg:text-[3.98vw]" },
            { text: "Work", className: "t-heavy text-[14vw] lg:text-[3.98vw]" },
          ]}
        />
        <span id="work-title" className="sr-only">
          Selected work
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-x-[1.4vw] gap-y-10 lg:col-span-9 lg:grid-cols-4 lg:pt-[0.6vw]">
        {archive.map((item, i) => (
          <li key={item.href}>
            <TLink href={item.href} transitionLabel={item.title} data-cursor="View" className="group block">
              <div data-reveal="clip" data-delay={String(i * 0.1)} className="relative aspect-[1.27] overflow-hidden border border-ivory/20">
                <div className="h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-110 group-hover:-rotate-1">
                  <Plate image={item.cover} className="h-full w-full" sizes="(max-width: 768px) 50vw, 18vw" />
                </div>
                <span className="absolute inset-0 bg-lav/0 mix-blend-color transition-colors duration-700 group-hover:bg-lav/60" />
              </div>
              {/* Captions grew to the reference's size; on desktop the negative margin returns the extra
                  height (two lines beyond the old 0.6rem/1.5) so the sections below keep their positions. */}
              <div className="mt-2.5 flex items-start justify-between gap-2 lg:mb-[calc(1.8rem-3.2*clamp(0.75rem,0.85vw,13px))]">
                <p className="t-label text-[0.75rem] leading-[1rem] tracking-[0.06em] lg:text-[clamp(0.75rem,0.85vw,13px)] lg:leading-[1.6] lg:tracking-[0.12em]">
                  <span className="block text-ivory transition-colors group-hover:text-lav">{item.title}</span>
                  <span className="block text-ivory/70">/{WORLD_LABEL[item.world]}</span>
                </p>
                <Arrow className="mt-0.5 shrink-0 transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </TLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── 03 About ───────────────────────────────────────────────── */
export async function AboutTeaser() {
  const [collage, moon, bust, sky] = await Promise.all([
    findCollageAsset("about-collage"),
    findCollageAsset("about-moon"),
    collagePlate("about-bust", { variant: "bust", alt: "Stone bust crowned with pale flowers" }),
    findCollageAsset("about-sky"),
  ]);
  return (
    <section aria-labelledby="about-title" className="relative">
      <TornRule seed={7} tone="rule" cover />
      {/* clipped so the collage (taller than this row, plus parallax) ends at the next divider */}
      <div className="relative grid items-center gap-10 overflow-hidden pb-14 lg:grid-cols-12 lg:gap-4 lg:pb-0">
        {collage ? (
          <div className="relative lg:col-span-3 lg:h-[14.6vw]">
            <div data-speed="0.15" className="lg:absolute lg:left-0 lg:top-[-0.4vw] lg:w-[30.5vw]">
              <div data-reveal="clip">
                <CollageCutout asset={collage} alt="Collage: classical bust against a lavender block and clouds" sizes="(max-width: 1024px) 100vw, 31vw" fallback={null} />
              </div>
            </div>
          </div>
        ) : (
        <div className="relative h-[80vw] lg:col-span-3 lg:h-[16vw]">
          <div className="absolute left-[30%] top-[4%] h-[62%] w-[56%] bg-lav" aria-hidden="true">
            {sky ? (
              <Plate image={{ variant: "moon", alt: "", src: sky.src }} showTag={false} className="h-full w-full opacity-70 mix-blend-multiply" sizes="12vw" />
            ) : (
              <PlateArt variant="moon" className="h-full w-full opacity-60 mix-blend-multiply" />
            )}
          </div>
          <div data-speed="0.2" className="absolute left-0 top-[6%] h-[94%] w-[72%]">
            <div data-reveal="clip" className="h-full">
              <Torn seed={71} edges={["right", "top"]} depth={6} className="h-full">
                <Plate image={bust} className="h-full w-full" sizes="22vw" />
              </Torn>
            </div>
          </div>
        </div>

        )}

        <div className="gutter lg:col-span-4 lg:px-0 lg:pl-[3vw]">
          <Index n="03" />
          <SplitText
            as="h2"
            className="mt-1"
            lines={[
              { text: "About", className: "t-heavy text-[17vw] lg:text-[6.15vw]" },
              { text: "Psyixel", className: "t-serif uppercase text-[16vw] lg:text-[5.7vw] text-lav pl-[0.2em]" },
            ]}
          />
          <span id="about-title" className="sr-only">
            About Psyixel
          </span>
        </div>

        <div className="gutter relative lg:col-span-5 lg:grid lg:grid-cols-[1fr_auto] lg:items-center lg:gap-[2vw] lg:pl-0">
          <div>
            {site.about.home.map((p, i) => (
              <p key={i} data-reveal="up" data-delay={String(i * 0.12)} className={`font-read text-lg leading-[1.4] text-ivory/85 lg:text-[1.07vw] ${i ? "mt-3" : ""}`}>
                {p}
              </p>
            ))}
            <ArrowLink href="/about" label="About" className="mt-5">
              More about Psyixel
            </ArrowLink>
          </div>
          {moon ? (
            <div className="relative mx-auto mt-10 w-48 lg:mt-0 lg:w-[16vw]" aria-hidden="true">
              <div data-spin="8">
                <CollageCutout asset={moon} alt="" sizes="16vw" fallback={null} />
              </div>
            </div>
          ) : (
          <div className="relative mx-auto mt-10 w-36 lg:mt-0 lg:w-[7vw]" aria-hidden="true">
            <div data-spin="30" className="absolute -inset-[48%] text-ivory/45">
              <Orbit className="h-full w-full" rx={120} ry={34} rotate={-18} />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-full shadow-[0_0_40px_rgba(236,229,216,0.12)]">
              <PlateArt variant="moon" className="absolute left-1/2 top-[36%] h-[250%] w-[250%] -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── 04 Get in touch ────────────────────────────────────────── */
export async function GetInTouch() {
  const rock = await findCollageAsset("contact-rock");
  const links = [
    { label: "Start a project", topic: "project" },
    { label: "Collaborate", topic: "collaboration" },
    { label: "Say hello", topic: "hello" },
  ];
  return (
    <section aria-labelledby="contact-title" className="relative overflow-hidden">
      <TornRule seed={8} tone="rule" cover />
      <div data-speed="0.15" className={`absolute hidden lg:block ${rock ? "bottom-0 right-0 w-[16.6vw]" : "-right-[3%] top-[8%] w-[13vw]"}`} aria-hidden="true">
        <CollageCutout asset={rock} alt="" sizes="17vw" fallback={<RockShard seed={81} className="aspect-[3/4]" />} />
      </div>
      <div className="gutter relative grid items-center gap-10 py-14 lg:grid-cols-12 lg:gap-4 lg:py-[1.4vw]">
        <div className="relative lg:col-span-4">
          <Index n="04" />
          <svg aria-hidden="true" viewBox="0 0 300 200" className="absolute left-[-6%] top-[8%] hidden w-[115%] text-lav/70 lg:block">
            <path data-draw d="M20 150 C 60 40 200 10 270 60 C 300 82 280 120 250 110" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
          <SplitText
            as="h2"
            className="relative mt-1 lg:pl-[10%]"
            lines={[
              { text: "Get in", className: "t-heavy text-[19vw] lg:text-[6.2vw]" },
              { text: "Touch", className: "t-heavy text-[19vw] lg:text-[6.2vw] text-lav italic [transform:skewX(-9deg)]" },
            ]}
          />
          <span id="contact-title" className="sr-only">
            Get in touch
          </span>
          <Sparkle size={20} className="twinkle absolute bottom-[8%] left-[2%] hidden text-ivory/60 lg:block" />
        </div>
        <p data-reveal="up" className="t-serif text-center text-[11vw] leading-[0.95] text-ivory/90 lg:col-span-3 lg:text-[2.7vw]">
          <span className="block">
            Have something <br className="max-lg:hidden" />
            in mind?
          </span>
          <span className="block">I&rsquo;d like to hear it.</span>
        </p>
        <ul className="flex flex-col gap-4 lg:col-span-3 lg:col-start-9 lg:border-l lg:border-ivory/40 lg:py-2 lg:pl-[3vw]">
          {links.map((l, i) => (
            <li key={l.topic} data-reveal="left" data-delay={String(i * 0.1)}>
              <ArrowLink href={`/contact?topic=${l.topic}`} label="Contact">
                {l.label}
              </ArrowLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
