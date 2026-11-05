import { WORDMARK } from "./wordmark-data";

/**
 * The PSYIXEL wordmark, traced from the reference (scripts/build-wordmark.mjs).
 *
 * Each letter is its own layer — the shared outline clipped to that letter's
 * region — so it can be animated independently:
 *   [data-glyph]  scroll scatter      [data-letter]  intro rise
 * The box keeps the traced aspect ratio, so letters scale uniformly and are
 * never stretched. Fill is a fine ivory print texture.
 */
export function Wordmark({ visible, idPrefix = "wm" }: { visible?: Set<number>; idPrefix?: string }) {
  const { width: W, height: H, path, regions, origins, letters } = WORDMARK;
  return (
    <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }} aria-hidden="true">
      {letters.map((l, i) => {
        const origin = `${origins[i][0]}% ${origins[i][1]}%`;
        return (
          <span
            key={i}
            data-glyph
            data-i={i}
            className={`absolute inset-0 block ${visible && !visible.has(i) ? "invisible" : ""}`}
            style={{ transformOrigin: origin }}
          >
            <span className="absolute inset-0 block overflow-hidden">
              <span data-letter data-i={i} className="absolute inset-0 block" style={{ transformOrigin: origin }}>
                <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" overflow="visible">
                  <defs>
                    <clipPath id={`${idPrefix}-c${i}`}>
                      <polygon points={regions[i]} />
                    </clipPath>
                    <pattern id={`${idPrefix}-ink${i}`} patternUnits="userSpaceOnUse" width="1100" height="1100">
                      <image href="/images/wordmark-ink.webp" width="1100" height="1100" preserveAspectRatio="none" />
                    </pattern>
                  </defs>
                  <path d={path} fill={`url(#${idPrefix}-ink${i})`} fillRule="evenodd" clipPath={`url(#${idPrefix}-c${i})`} />
                </svg>
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
