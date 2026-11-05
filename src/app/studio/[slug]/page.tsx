import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { notFound } from "next/navigation";
import { TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { ArrowLink, Index, SampleTag } from "@/components/ui/Bits";
import { getStudioProject, studioProjects } from "@/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return studioProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getStudioProject((await params).slug);
  return p ? pageMeta({ title: `${p.title} — Studio`, description: p.summary, path: `/studio/${p.slug}`, image: p.cover }) : {};
}

/** Section heading + paragraphs, used for the context, decisions and result. */
function Story({ n, title, paragraphs }: { n: string; title: string; paragraphs: string[] }) {
  return (
    <section className="gutter grid gap-6 py-16 md:grid-cols-12 md:gap-8 md:py-[5vw]">
      <div className="md:col-span-4">
        <Index n={n} />
        <h2 className="t-serif mt-3 text-[11vw] leading-[1] text-lav md:text-[3.6vw]">{title}</h2>
      </div>
      <div className="space-y-5 md:col-span-6 md:col-start-6">
        {paragraphs.map((t, i) => (
          <p key={i} data-reveal="up" data-delay={String(i * 0.06)} className="font-read text-xl leading-relaxed text-ivory/85">
            {t}
          </p>
        ))}
      </div>
    </section>
  );
}

/**
 * Studio case study. Summary and cover are always shown; role, client, link,
 * context, screenshots, decisions and result appear only when the project has them.
 */
export default async function StudioProjectPage({ params }: Props) {
  const p = getStudioProject((await params).slug);
  if (!p) notFound();
  const i = studioProjects.indexOf(p);
  const next = studioProjects.length > 1 ? studioProjects[(i + 1) % studioProjects.length] : undefined;
  const facts = [
    { k: "Role", v: p.role },
    { k: "Client", v: p.client },
    { k: "Year", v: p.year },
    { k: "Disciplines", v: p.disciplines.join(" / ") },
  ].filter((f) => f.v);
  const sections = [p.problem?.length ? "problem" : null, p.decisions?.length ? "decisions" : null, p.result?.length ? "result" : null].filter(Boolean);
  const internal = p.url?.startsWith("/");
  const num = (key: string) => String(sections.indexOf(key) + 1).padStart(2, "0");

  return (
    <article>
      <header className="gutter grid gap-10 pb-16 pt-28 md:grid-cols-12 md:gap-8 md:pb-[5vw] md:pt-36">
        <div className="md:col-span-5">
          <Index n="Studio · Project" />
          <SplitText as="h1" className="mt-4" lines={[{ text: p.title, className: "t-poster text-[16vw] leading-[1.14]! md:text-[6.4vw]" }]} />
          <p data-reveal="up" data-start="top bottom" className="mt-8 max-w-md font-read text-xl leading-relaxed text-ivory/85">
            {p.summary}
          </p>
          <dl className="t-label mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t hairline pt-5 text-ivory/80">
            {facts.map((f) => (
              <div key={f.k} className="contents">
                <dt className="text-dust">{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
          {p.url && (
            <a href={p.url} {...(internal ? {} : { target: "_blank", rel: "noreferrer" })} className="t-label mt-8 inline-flex items-center gap-3 border-b border-lav pb-1 text-ivory hover:text-lav">
              {p.urlLabel ?? "Visit the project"} {internal ? "→" : "↗"}
            </a>
          )}
          {p.placeholder && <SampleTag className="mt-6 block w-fit" />}
        </div>
        <div className="md:col-span-7">
          <div data-reveal="clip" data-start="top bottom" className="border-2 border-ivory/80 bg-coal p-[0.5vw] shadow-[0_40px_80px_rgba(0,0,0,0.55)]">
            <Plate image={p.cover} className="aspect-[16/10] w-full" sizes="(max-width: 768px) 100vw, 58vw" priority />
          </div>
        </div>
      </header>

      {p.problem?.length ? (
        <>
          <TornRule seed={23} />
          <Story n={num("problem")} title="Context" paragraphs={p.problem} />
        </>
      ) : null}

      {p.screenshots?.length ? (
        <section aria-label="Screenshots" className="gutter grid gap-8 pb-16 md:grid-cols-12 md:gap-[2vw] md:pb-[5vw]">
          {p.screenshots.map((s, k, all) => {
            const wide = all.length % 2 === 1 && k === 0;
            return (
            <figure key={k} className={wide ? "md:col-span-12" : "md:col-span-6"}>
              <div data-reveal="clip" className="border border-ivory/30 bg-coal p-[0.4vw]">
                <Plate image={s} className="aspect-[16/10] w-full" sizes={wide ? "100vw" : "(max-width: 768px) 100vw, 50vw"} />
              </div>
              <figcaption className="t-label mt-3 text-ivory/70">{s.caption ?? s.alt}</figcaption>
            </figure>
            );
          })}
        </section>
      ) : null}

      {p.decisions?.length ? (
        <>
          <TornRule seed={26} />
          <Story n={num("decisions")} title="Key decisions" paragraphs={p.decisions} />
        </>
      ) : null}

      {p.result?.length ? (
        <>
          <TornRule seed={24} />
          <Story n={num("result")} title="The result" paragraphs={p.result} />
        </>
      ) : null}

      <TornRule seed={25} />
      <nav aria-label="More projects" className="gutter flex flex-wrap items-center justify-between gap-6 py-12">
        <ArrowLink href="/studio#projects" label="Studio">
          All projects
        </ArrowLink>
        {next && next.slug !== p.slug && (
          <ArrowLink href={`/studio/${next.slug}`} label={next.title}>
            Next: {next.title}
          </ArrowLink>
        )}
      </nav>
    </article>
  );
}
