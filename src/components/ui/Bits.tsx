import type { ReactNode } from "react";
import { TLink } from "@/components/motion/TLink";

/** "01 /" section index. */
export function Index({ n, className = "" }: { n: string; className?: string }) {
  return <p className={`t-label text-ivory/70 ${className}`}>{n} /</p>;
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 12" className={`h-3 w-6 ${className}`} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M0 6 H22 M17 1 L22 6 L17 11" />
    </svg>
  );
}

/** Mono link with an arrow that slides on hover. */
export function ArrowLink({ href, children, label, className = "" }: { href: string; children: ReactNode; label?: string; className?: string }) {
  return (
    <TLink href={href} transitionLabel={label} data-magnetic="0.2" className={`t-label group inline-flex items-center gap-3 text-ivory transition-colors hover:text-lav ${className}`}>
      <span className="relative">
        {children}
        <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-lav transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
      </span>
      <Arrow className="transition-transform duration-500 group-hover:translate-x-1.5" />
    </TLink>
  );
}

/** Shown where a list has nothing published yet (samples are left out of production builds). */
export function EmptyNote({ className = "" }: { className?: string }) {
  return <p className={`t-label text-ivory/60 ${className}`}>Nothing published here yet.</p>;
}

/** Small tag flagging sample content that still needs replacing. */
export function SampleTag({ className = "" }: { className?: string }) {
  return <span className={`t-label inline-block border border-dashed border-lav/50 px-2 py-0.5 text-[0.6875rem] text-lav ${className}`}>Sample content</span>;
}

/** Inner-page masthead. */
export function PageHeader({
  index,
  title,
  serif,
  intro,
  children,
}: {
  index: string;
  title: string;
  serif?: string;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <header className="gutter relative pb-14 pt-32 md:pb-20 md:pt-44">
      <Index n={index} />
      <h1 className="mt-4" data-split="scroll">
        <span className="sr-only">
          {title} {serif}
        </span>
        <span aria-hidden="true" className="split-line t-heavy whitespace-nowrap" style={{ fontSize: `min(17vw, ${(88 / (title.length * 0.77)).toFixed(2)}vw)` }}>
          {Array.from(title).map((c, i) => (
            <span key={i} className="split-unit">
              {c === " " ? " " : c}
            </span>
          ))}
        </span>
        {serif && (
          <span aria-hidden="true" className="split-line t-serif -mt-[0.1em] pl-[8vw] text-[15vw] text-lav md:text-[9vw]">
            {Array.from(serif).map((c, i) => (
              <span key={i} className="split-unit">
                {c === " " ? " " : c}
              </span>
            ))}
          </span>
        )}
      </h1>
      {intro && (
        <p data-reveal="up" data-delay="0.3" className="mt-8 max-w-xl font-read text-xl leading-relaxed text-ivory/80 md:ml-[38%]">
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}
