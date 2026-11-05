import { seeded, round } from "@/lib/random";
import { tornPath } from "./Torn";

/** Small decorative fragments used across collages. All purely decorative. */

export function Sparkle({ className = "", size = 40 }: { className?: string; size?: number }) {
  return (
    <svg viewBox="-50 -50 100 100" width={size} height={size} className={className} aria-hidden="true">
      <path d="M0 -50 C 4 -10 10 -4 50 0 C 10 4 4 10 0 50 C -4 10 -10 4 -50 0 C -10 -4 -4 -10 0 -50Z" fill="currentColor" />
    </svg>
  );
}

export function Orbit({ className = "", rx = 120, ry = 34, rotate = -14 }: { className?: string; rx?: number; ry?: number; rotate?: number }) {
  return (
    <svg viewBox={`${-rx - 4} ${-rx - 4} ${rx * 2 + 8} ${rx * 2 + 8}`} className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1">
      <ellipse rx={rx} ry={ry} transform={`rotate(${rotate})`} />
      <ellipse rx={rx * 0.86} ry={ry * 1.25} transform={`rotate(${rotate + 9})`} opacity="0.6" />
    </svg>
  );
}

/** The loose lavender pen line that loops through the hero. */
export function Scribble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} aria-hidden="true" fill="none">
      <path
        data-draw
        d="M10 40 C 120 10 220 30 250 90 C 280 150 210 200 160 170 C 110 140 190 80 260 120 C 320 155 330 230 390 290"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FALL = "M0 0 C 34 6 78 34 92 86 C 104 132 80 178 32 186 C -16 192 -64 158 -68 110 C -72 62 -34 14 0 0Z";
const STANDARD = "M0 0 C -42 -22 -64 -86 -44 -146 C -30 -188 10 -194 28 -156 C 48 -104 38 -32 0 0Z";
const FALL_VEINS = "M0 6 C 10 60 18 120 28 176 M0 6 C 22 50 52 100 74 150 M0 6 C -14 50 -36 100 -52 146 M0 6 C 30 40 66 72 88 100 M0 6 C -26 40 -54 74 -64 104";
const STD_VEINS = "M0 -4 C -8 -50 -14 -110 -10 -170 M0 -4 C -20 -40 -36 -90 -38 -140 M0 -4 C 10 -50 20 -100 22 -150";

/** A bearded iris cut-out: three upright standards over three ruffled falls. */
export function FlowerCut({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg viewBox="-230 -230 460 500" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <radialGradient id="iris-fall" cx="0" cy="0" r="200" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2f2148" />
          <stop offset="0.35" stopColor="#7c62b2" />
          <stop offset="0.75" stopColor="#b59ce4" />
          <stop offset="1" stopColor="#d9cbf3" />
        </radialGradient>
        <linearGradient id="iris-std" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#4a3672" />
          <stop offset="0.5" stopColor="#9a80cf" />
          <stop offset="1" stopColor="#d4c4f1" />
        </linearGradient>
      </defs>
      <g transform={`rotate(${rotate})`}>
        {/* stem + leaf */}
        <path d="M0 30 C -8 110 10 180 -2 270" stroke="#241b2e" strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M-2 270 C -30 190 -50 120 -96 40 C -60 110 -26 170 -2 210Z" fill="#2c2238" />

        {/* standards */}
        {[0, -32, 30].map((a, i) => (
          <g key={`s${a}`} transform={`rotate(${a}) scale(${i ? 0.92 : 1})`} filter="url(#f-ruffle-lg)" opacity={i ? 1 : 0.85}>
            <path d={STANDARD} fill="url(#iris-std)" />
            <path d={STD_VEINS} stroke="#2e2148" strokeWidth="1.3" fill="none" opacity="0.4" />
            <path d={STANDARD} fill="#999" filter="url(#f-stone)" opacity="0.35" style={{ mixBlendMode: "multiply" }} />
          </g>
        ))}

        {/* falls: sides first, front last */}
        {[
          { a: 68, s: 0.95 },
          { a: -64, s: 0.92 },
          { a: 4, s: 1.08 },
        ].map(({ a, s }) => (
          <g key={`f${a}`} transform={`rotate(${a}) scale(${s})`}>
            <g filter="url(#f-ruffle-lg)">
              <path d={FALL} fill="url(#iris-fall)" />
              <path d={FALL_VEINS} stroke="#2a1d42" strokeWidth="1.4" fill="none" opacity="0.45" />
              <path d={FALL} fill="#999" filter="url(#f-stone)" opacity="0.38" style={{ mixBlendMode: "multiply" }} />
            </g>
            {/* beard */}
            <path d="M0 8 C 4 30 8 52 12 74" stroke="#efe6d4" strokeWidth="9" strokeLinecap="round" strokeDasharray="1.5 2.5" fill="none" opacity="0.85" filter="url(#f-ruffle)" />
          </g>
        ))}
        <circle r="10" fill="#21182f" />
      </g>
    </svg>
  );
}

/** Stone-textured headphones for the music collage. */
export function Headphones({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 320" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id="hp-cup" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9d4cc" />
          <stop offset="0.55" stopColor="#7d7872" />
          <stop offset="1" stopColor="#2a2725" />
        </linearGradient>
      </defs>
      <g transform="rotate(-14 200 160)">
        <path d="M70 200 C 60 70 150 20 210 22 C 290 24 350 90 336 200" stroke="url(#hp-cup)" strokeWidth="22" fill="none" strokeLinecap="round" />
        <path d="M70 200 C 60 70 150 20 210 22 C 290 24 350 90 336 200" stroke="#888" strokeWidth="22" fill="none" strokeLinecap="round" filter="url(#f-stone)" opacity="0.5" style={{ mixBlendMode: "multiply" }} />
        {[
          { x: 74, flip: 1 },
          { x: 332, flip: -1 },
        ].map(({ x, flip }) => (
          <g key={x} transform={`translate(${x} 222) scale(${flip} 1)`}>
            <ellipse cx="0" cy="0" rx="46" ry="62" fill="url(#hp-cup)" />
            <ellipse cx="12" cy="2" rx="32" ry="48" fill="#3a3633" />
            <ellipse cx="14" cy="4" rx="22" ry="36" fill="#1c1a19" />
            <ellipse cx="0" cy="0" rx="46" ry="62" fill="#888" filter="url(#f-stone)" opacity="0.55" style={{ mixBlendMode: "multiply" }} />
            <ellipse cx="-14" cy="-22" rx="10" ry="18" fill="#fff" opacity="0.25" filter="url(#f-soft-s)" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Jagged stone fragment (torn rock texture). */
export function RockShard({ className = "", seed = 3 }: { className?: string; seed?: number }) {
  return (
    <div className={className} aria-hidden="true" style={{ clipPath: tornPath(seed, ["top", "left", "right", "bottom"], 14, 9) }}>
      <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
        <rect width="400" height="500" fill="#8e8984" />
        <rect width="400" height="500" fill="#fff" filter="url(#f-stone)" />
        <linearGradient id="shard-shade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.7" />
        </linearGradient>
        <rect width="400" height="500" fill="url(#shard-shade)" />
      </svg>
    </div>
  );
}

/** Lavender torn paper strip. */
export function LavenderScrap({ className = "", seed = 5 }: { className?: string; seed?: number }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-lav ${className}`}
      style={{ clipPath: tornPath(seed, ["top", "left", "right", "bottom"], 8, 14) }}
    >
      <svg className="h-full w-full" preserveAspectRatio="none">
        <rect width="100%" height="100%" fill="#555" filter="url(#f-stone)" opacity="0.35" style={{ mixBlendMode: "multiply" }} />
      </svg>
    </div>
  );
}

/**
 * Full-width seam between sections. "band" (default, inner pages) is a torn
 * grey strip; "rule" (homepage) is a thin, slightly uneven pale printed rule in
 * the same 12px space. `cover` fills below the rule with the page colour so
 * artwork that runs under it (the hero) still ends on a torn edge.
 */
export function TornRule({ seed = 1, className = "", tone = "band", cover = false }: { seed?: number; className?: string; tone?: "band" | "rule"; cover?: boolean }) {
  const r = seeded(seed);
  if (tone === "rule") {
    // Gentle drift plus the odd nick, broken into runs of varying ink density.
    const n = 120;
    let drift = 0;
    const ys = Array.from({ length: n + 1 }, () => {
      drift = Math.max(-2.2, Math.min(2.2, drift + (r() - 0.5) * 0.9));
      return 17 + drift + (r() < 0.05 ? (r() - 0.5) * 5 : 0);
    });
    const at = (i: number) => `${round((i / n) * 1440)},${round(ys[i])}`;
    const runs: { d: string; o: number }[] = [];
    for (let i = 0; i < n; ) {
      const len = 4 + Math.floor(r() * 14);
      const end = Math.min(n, i + len);
      if (r() > 0.06) runs.push({ d: `M${Array.from({ length: end - i + 1 }, (_, k) => at(i + k)).join(" L")}`, o: round(0.3 + r() * 0.22) });
      i = end;
    }
    return (
      <div aria-hidden="true" className={`pointer-events-none relative h-3 w-full ${className}`}>
        <svg viewBox="0 0 1440 34" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          {cover && <path d={`M${ys.map((_, i) => at(i)).join(" L")} L1440 34 L0 34Z`} fill="#0c0b0d" />}
          {runs.map((s, i) => (
            <path key={i} d={s.d} stroke="#ece5d8" strokeOpacity={s.o} strokeWidth="1" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>
    );
  }
  const n = 90;
  const pts = Array.from({ length: n + 1 }, (_, i) => `${round((i / n) * 1440)},${round(8 + r() * 9 + (r() < 0.12 ? r() * 8 : 0))}`);
  const edge = `M${pts.join(" L")}`;
  return (
    <div aria-hidden="true" className={`pointer-events-none relative h-3 w-full ${className}`}>
      <svg viewBox="0 0 1440 34" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <path d={`${edge} L1440 34 L0 34Z`} fill="#18161a" />
        <path d={edge} stroke="#ece5d8" strokeOpacity="0.22" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
