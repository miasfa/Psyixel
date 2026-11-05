import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { ArrowLink, Index, SampleTag } from "@/components/ui/Bits";
import { Gallery } from "@/components/ui/Gallery";
import { SplitText } from "@/components/motion/SplitText";
import { collections, getCollection } from "@/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getCollection((await params).slug);
  return c
    ? pageMeta({ title: `${c.title} — Photography`, description: c.poem ?? c.intro ?? `${c.title}, a photography collection by Psyixel.`, path: `/photography/${c.slug}`, image: c.cover })
    : {};
}

export default async function CollectionPage({ params }: Props) {
  const c = getCollection((await params).slug);
  if (!c) notFound();
  const i = collections.indexOf(c);
  const next = collections[(i + 1) % collections.length];

  return (
    <>
      <header className="gutter pb-16 pt-32 md:pt-44">
        <Index n={`Photography · ${String(i + 1).padStart(2, "0")}`} />
        <SplitText as="h1" className="mt-4" lines={[{ text: c.title, className: "t-poster text-[16vw] md:text-[10vw]" }]} />
        <div className="mt-6 grid gap-6 md:grid-cols-12">
          {c.poem && <p className="t-serif text-4xl text-lav-soft md:col-span-6 md:text-5xl" data-reveal="up">{c.poem}</p>}
          <div className="md:col-span-4 md:col-start-9" data-reveal="up" data-delay="0.15">
            {c.intro && <p className="font-read text-lg leading-relaxed text-ivory/75">{c.intro}</p>}
            {c.placeholder && <SampleTag className="mt-4" />}
          </div>
        </div>
      </header>
      <section aria-label={`${c.title} images`} className="gutter pb-24">
        <Gallery photos={c.photos} title={c.title} />
      </section>
      <nav aria-label="Next collection" className="gutter border-t hairline py-16">
        <p className="t-label text-dust">Next collection</p>
        <ArrowLink href={`/photography/${next.slug}`} label={next.title} className="mt-4 !text-base">
          {next.title}
        </ArrowLink>
      </nav>
    </>
  );
}
