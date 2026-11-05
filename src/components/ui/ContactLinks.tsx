"use client";

import { scrollToTarget } from "@/lib/motion";
import { Arrow } from "./Bits";

const ICON = "h-7 w-9 md:h-[2.5vw] md:w-[3.2vw]";

const OPTIONS = [
  {
    topic: "project",
    label: "Start a project",
    icon: (
      <svg viewBox="-20 -20 40 40" className={`${ICON} text-lav`} aria-hidden="true">
        <path d="M0 -17 C 1.5 -4 4 -1.5 12 0 C 4 1.5 1.5 4 0 17 C -1.5 4 -4 1.5 -12 0 C -4 -1.5 -1.5 -4 0 -17Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    topic: "collaboration",
    label: "Collaborate",
    icon: (
      <svg viewBox="0 0 40 34" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <circle cx="15" cy="17" r="11" />
        <circle cx="25" cy="17" r="11" />
      </svg>
    ),
  },
  {
    topic: "hello",
    label: "Say hello",
    icon: (
      <svg viewBox="0 0 40 30" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2" y="3" width="36" height="24" rx="1.5" />
        <path d="M3 4 L20 17 L37 4" />
      </svg>
    ),
  },
];

/**
 * The three contact options from the concept. Each preselects the matching
 * topic in the form below and scrolls to it (see ContactForm's `psy:topic`).
 */
export function ContactLinks() {
  const choose = (topic: string) => {
    window.dispatchEvent(new CustomEvent("psy:topic", { detail: topic }));
    scrollToTarget("#message");
  };

  return (
    <ul>
      {OPTIONS.map((o, i) => (
        <li key={o.topic} data-reveal="left" data-start="top bottom" data-delay={String(0.35 + i * 0.1)}>
          <button
            type="button"
            onClick={() => choose(o.topic)}
            data-cursor="Write"
            className="group grid w-full grid-cols-[3rem_1fr] items-center gap-4 py-4 text-left md:grid-cols-[4.5vw_1fr] md:gap-0 md:py-[1.2vw]"
          >
            <span className="text-ivory/85 transition-[color,transform] duration-500 group-hover:-rotate-6 group-hover:text-lav">{o.icon}</span>
            <span className="relative flex items-center justify-between pb-3 md:pb-[1vw]">
              <span className="t-label text-base tracking-[0.18em] text-ivory transition-[color,transform] duration-500 ease-[var(--ease-expo)] group-hover:translate-x-1.5 group-hover:text-lav md:text-[1.45vw]">
                {o.label}
              </span>
              <Arrow className="h-4 w-8 shrink-0 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-lav md:h-[1.3vw] md:w-[2.5vw]" />
              <span className="absolute bottom-0 left-0 h-[2px] w-full bg-ivory/45" />
              <span className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-lav transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-x-100" />
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
