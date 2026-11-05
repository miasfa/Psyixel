import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { CollageCutout } from "@/components/art/CollageCutout";
import { Sparkle, TornRule } from "@/components/art/Fragments";
import { SplitText } from "@/components/motion/SplitText";
import { TLink } from "@/components/motion/TLink";
import { Arrow, Index } from "@/components/ui/Bits";
import { ContactForm } from "@/components/ui/ContactForm";
import { ContactChannels } from "@/components/ui/ContactChannels";
import { ContactLinks } from "@/components/ui/ContactLinks";
import { site } from "@/content";
import { findCollageAsset } from "@/lib/collage";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: "Get in touch with Psyixel about a project, a collaboration, or something you’ve seen here.",
  path: "/contact",
});

/*
 * Contact: a two-row grid. Title beside the invitation, then the three topics
 * beside the direct channels. Below md everything stacks.
 */
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  const rock = await findCollageAsset("contact-hero-rock");

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="contact-title" className="gutter relative overflow-hidden pb-20 pt-24 md:pb-[6vw] md:pt-[9vw]">
        {/* rock fragment, kept to the right edge behind the content */}
        <div aria-hidden="true" className="pointer-events-none absolute -right-[4vw] bottom-0 hidden w-[24vw] opacity-90 md:block">
          <div data-reveal="fade" data-start="top bottom" data-delay="0.4">
            <CollageCutout asset={rock} alt="" sizes="24vw" fallback={null} />
          </div>
        </div>

        {/* row 1: title | invitation + button */}
        <div className="relative z-10 grid gap-8 md:grid-cols-12 md:items-end md:gap-6">
          <h1 id="contact-title" className="md:col-span-7">
            <SplitText
              as="span"
              className="block"
              lines={[
                { text: "Get in", className: "t-heavy ink text-[20vw] leading-[0.95] md:text-[10.4vw] md:leading-[0.96]" },
                { text: "Touch", className: "t-heavy text-[20vw] leading-[0.95] text-lav italic [transform:skewX(-10deg)] pl-[0.12em] pr-[0.2em] md:pl-[0.4em] md:text-[10vw] md:leading-[0.96]" },
              ]}
            />
          </h1>
          <div className="md:col-span-5 md:pb-[0.8vw]">
            <p data-reveal="up" data-delay="0.2" className="t-serif text-[10vw] leading-[1.04] text-ivory md:text-[3.6vw]">
              Have something in mind?
              <br />
              I&rsquo;d like to hear it.
            </p>
            <div data-reveal="up" data-start="top bottom" data-delay="0.3" className="mt-8 md:mt-[2.2vw]">
              <TLink
                href="#message"
                data-magnetic="0.25"
                className="t-label group relative inline-flex items-center gap-6 overflow-hidden bg-lav px-6 py-4 text-ink md:gap-[2vw] md:px-[1.7vw] md:py-[1.05vw] md:text-[max(0.75rem,0.95vw)]"
              >
                <span className="relative z-10">Send a message</span>
                <Arrow className="relative z-10 rotate-90 transition-transform duration-500 group-hover:translate-y-1" />
                <span className="absolute inset-0 origin-left scale-x-0 bg-ivory transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100" />
              </TLink>
            </div>
          </div>
        </div>

        {/* row 2: what it's about | direct channels */}
        <div className="relative z-10 mt-16 grid gap-12 border-t hairline pt-10 md:mt-[6vw] md:grid-cols-12 md:gap-6 md:pt-[3vw]">
          <div className="md:col-span-6">
            <p className="t-label text-dust">What brings you here</p>
            <div className="mt-2">
              <ContactLinks />
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-8">
            <p className="t-label text-dust">Or reach me directly</p>
            <ContactChannels className="mt-3" />
          </div>
        </div>
      </section>

      <TornRule seed={81} />

      {/* ── Message form ─────────────────────────────────────── */}
      <section id="message" aria-labelledby="message-title" className="gutter relative scroll-mt-20 py-20 md:py-[7vw]">
        <div className="grid gap-14 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-4">
            <Index n="01" />
            <SplitText
              as="h2"
              className="mt-3"
              lines={[
                { text: "Send me", className: "t-heavy text-[15vw] md:text-[5.2vw]" },
                { text: "a message", className: "t-serif text-[13vw] md:text-[4.8vw] text-lav pl-[0.3em]" },
              ]}
            />
            <span id="message-title" className="sr-only">
              Send me a message
            </span>
            <p data-reveal="up" className="mt-8 max-w-sm font-read text-xl leading-relaxed text-ivory/80">
              A project, a collaboration, a question about something here. You&rsquo;re welcome to get in touch.
            </p>
            <p data-reveal="up" data-delay="0.08" className="mt-4 max-w-sm font-read text-xl leading-relaxed text-ivory/80">
              If you have an idea but aren&rsquo;t sure what it needs yet, start there.
            </p>
            <Sparkle size={30} className="twinkle mt-8 text-lav" />
          </div>
          <div className="md:col-span-7 md:col-start-6" data-reveal="up" data-delay="0.1">
            <ContactForm initialTopic={topic} fallbackEmail={site.email || undefined} />
          </div>
        </div>
      </section>
    </>
  );
}
