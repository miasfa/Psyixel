import type { ElementType, ReactNode } from "react";

/**
 * Pre-splits text into masked lines + words/chars on the server, so GSAP can
 * stagger them without layout shift. Screen readers get the plain text.
 *
 * `lines` lets you art-direct line breaks; each item can be a string or a
 * { text, className } object for mixed typefaces (e.g. heavy + italic serif).
 */
type Line = string | { text: string; className?: string };

export function SplitText({
  lines,
  as: Tag = "span",
  by = "chars",
  className = "",
  mode = "scroll",
}: {
  lines: Line[];
  as?: ElementType;
  by?: "chars" | "words";
  className?: string;
  /** "scroll" = revealed by ScrollEffects; "manual" = a component animates it. */
  mode?: "scroll" | "manual";
}) {
  const plain = lines.map((l) => (typeof l === "string" ? l : l.text)).join(" ");
  return (
    <Tag className={className} data-split={mode}>
      <span className="sr-only">{plain}</span>
      {lines.map((line, i) => {
        const text = typeof line === "string" ? line : line.text;
        const cls = typeof line === "string" ? "" : line.className ?? "";
        return (
          <span key={i} className={`split-line ${cls}`} aria-hidden="true">
            {renderUnits(text, by)}
          </span>
        );
      })}
    </Tag>
  );
}

function renderUnits(text: string, by: "chars" | "words"): ReactNode {
  const words = text.split(" ");
  return words.map((word, wi) => (
    <span key={wi} className="inline-block whitespace-nowrap">
      {by === "words" ? (
        <span className="split-unit">{word}</span>
      ) : (
        Array.from(word).map((ch, ci) => (
          <span key={ci} className="split-unit">
            {ch}
          </span>
        ))
      )}
      {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
    </span>
  ));
}
