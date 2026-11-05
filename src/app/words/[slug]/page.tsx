import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { Plate } from "@/components/art/Plate";
import { Torn } from "@/components/art/Torn";
import { SplitText } from "@/components/motion/SplitText";
import { ArrowLink, SampleTag } from "@/components/ui/Bits";
import { getWriting, getWritings } from "@/content";
import type { Block } from "@/content/types";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getWritings().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const w = getWriting((await params).slug);
  return w ? pageMeta({ title: w.title, description: w.excerpt, path: `/words/${w.slug}`, image: w.cover, type: "article" }) : {};
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "h":
      return <h2 key={i}>{b.text}</h2>;
    case "quote":
      return <blockquote key={i}>{b.text}</blockquote>;
    case "verse":
      return (
        <p key={i} className="verse">
          {b.text}
        </p>
      );
    default:
      return <p key={i}>{b.text}</p>;
  }
}

export default async function WritingPage({ params }: Props) {
  const w = getWriting((await params).slug);
  if (!w) notFound();
  const all = getWritings();
  const next = all[(all.indexOf(w) + 1) % all.length];
  const minutes = Math.max(1, Math.round(w.body.map((b) => b.text).join(" ").split(/\s+/).length / 220));
  const date = new Date(w.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <article className="pb-20">
      <header className="gutter mx-auto max-w-5xl pb-12 pt-32 text-center md:pt-44">
        <p className="t-label text-lav">
          {w.kind} · {w.placeholder ? "Sample" : <time dateTime={w.date}>{date}</time>} · {minutes} min read
        </p>
        <SplitText as="h1" by="words" className="mt-6" lines={[{ text: w.title, className: "t-serif text-[15vw] md:text-[8vw]" }]} />
        <p data-reveal="up" className="mx-auto mt-6 max-w-xl font-read text-xl italic text-ivory/70">
          {w.excerpt}
        </p>
        {w.placeholder && <SampleTag className="mt-6" />}
      </header>

      {w.cover && (
        <div className="gutter mx-auto mb-16 max-w-4xl">
          <div data-reveal="clip">
            <Torn seed={120} edges={["top", "bottom"]} depth={3} className="aspect-[16/8]">
              <Plate image={w.cover} className="h-full w-full" sizes="(max-width: 900px) 100vw, 900px" />
            </Torn>
          </div>
        </div>
      )}

      <div className="prose-psy gutter mx-auto max-w-[40rem] box-content">{w.body.map(renderBlock)}</div>

      <nav aria-label="More writing" className="gutter mx-auto mt-24 flex max-w-[40rem] flex-wrap justify-between gap-6 border-t hairline pt-10 box-content">
        <ArrowLink href="/words" label="Words">
          All writing
        </ArrowLink>
        {next.slug !== w.slug && (
          <ArrowLink href={`/words/${next.slug}`} label={next.title}>
            Next: {next.title}
          </ArrowLink>
        )}
      </nav>
    </article>
  );
}
