import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { Orbit } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { ArrowLink, Index, SampleTag } from "@/components/ui/Bits";
import { artworks, getArtwork } from "@/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const a = getArtwork((await params).slug);
  return a
    ? pageMeta({ title: `${a.title} — Art`, description: a.statement ?? `${a.title}, ${(a.medium ?? "artwork").toLowerCase()} work by Psyixel.`, path: `/art/${a.slug}`, image: a.image })
    : {};
}

export default async function ArtworkPage({ params }: Props) {
  const a = getArtwork((await params).slug);
  if (!a) notFound();
  const i = artworks.indexOf(a);
  const next = artworks[(i + 1) % artworks.length];

  return (
    <article>
      <div className="gutter grid gap-12 pb-20 pt-28 md:grid-cols-12 md:gap-8 md:pt-36">
        <div className="relative md:col-span-7">
          <div data-spin="30" className="absolute -left-[10%] -top-[8%] w-[60%] text-lav/50" aria-hidden="true">
            <Orbit className="w-full" />
          </div>
          <div data-reveal="clip" className="relative bg-coal p-3 shadow-[0_50px_100px_rgba(0,0,0,0.6)] md:p-5">
            <Plate image={a.image} className="aspect-[4/5] w-full" sizes="(max-width: 768px) 100vw, 58vw" priority />
          </div>
        </div>
        <div className="md:col-span-4 md:col-start-9 md:pt-24">
          <Index n={`Art · ${String(i + 1).padStart(2, "0")}`} />
          <SplitText as="h1" className="mt-4" lines={[{ text: a.title, className: "t-serif text-[14vw] md:text-[5.4vw]" }]} />
          <dl className="t-label mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t hairline pt-5 text-ivory/70">
            {a.year && (
              <>
                <dt className="text-dust">Year</dt>
                <dd>{a.year}</dd>
              </>
            )}
            {a.medium && (
              <>
                <dt className="text-dust">Medium</dt>
                <dd>{a.medium}</dd>
              </>
            )}
            {a.dimensions && (
              <>
                <dt className="text-dust">Size</dt>
                <dd>{a.dimensions}</dd>
              </>
            )}
          </dl>
          {a.statement && (
            <p data-reveal="up" className="mt-8 font-read text-xl leading-relaxed text-ivory/85">
              {a.statement}
            </p>
          )}
          {a.placeholder && <SampleTag className="mt-6" />}
        </div>
      </div>

      {a.details && a.details.length > 0 && (
        <section aria-label="Details" className="gutter grid gap-6 pb-20 md:grid-cols-12">
          {a.details.map((d, k) => (
            <figure key={k} className={k % 2 ? "md:col-span-4 md:col-start-8 md:mt-24" : "md:col-span-5 md:col-start-2"}>
              <div data-reveal="clip">
                <Plate image={d} className="aspect-[4/3]" />
              </div>
              <figcaption className="t-label mt-2 text-dust">{d.alt}</figcaption>
            </figure>
          ))}
        </section>
      )}

      <nav aria-label="More work" className="gutter flex flex-wrap justify-between gap-6 border-t hairline py-16">
        <ArrowLink href="/art" label="Art">
          All works
        </ArrowLink>
        <ArrowLink href={`/art/${next.slug}`} label={next.title}>
          Next: {next.title}
        </ArrowLink>
      </nav>
    </article>
  );
}
