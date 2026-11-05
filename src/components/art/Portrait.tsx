import { seeded, round } from "@/lib/random";

/**
 * Placeholder hero figure: an original monochrome profile, head tilted back,
 * eyes closed, hair falling away. Built from soft light/shadow layers and
 * grain so it reads as a photographic cut-out rather than a flat vector.
 * Replace with a real cut-out (transparent PNG/WebP) via `heroPortrait.src`
 * in src/content/site.ts.
 */

type Strand = { d: string; w: number; c: string; o: number };

function strands(seed: number, count: number, origin: [number, number, number, number], spread: [number, number], len: [number, number], tone: [number, number], width: [number, number]) {
  const r = seeded(seed);
  const out: Strand[] = [];
  for (let i = 0; i < count; i++) {
    const sx = origin[0] + r() * origin[2];
    const sy = origin[1] + r() * origin[3];
    const ang = spread[0] + r() * (spread[1] - spread[0]);
    const l = len[0] + r() * (len[1] - len[0]);
    const ex = sx + Math.cos(ang) * l;
    const ey = sy + Math.sin(ang) * l;
    const bend = (r() - 0.5) * l * 0.7;
    const c1x = sx + Math.cos(ang) * l * 0.35 - Math.sin(ang) * bend;
    const c1y = sy + Math.sin(ang) * l * 0.35 + Math.cos(ang) * bend;
    const c2x = sx + Math.cos(ang) * l * 0.7 + Math.sin(ang) * bend * 0.6;
    const c2y = sy + Math.sin(ang) * l * 0.7 - Math.cos(ang) * bend * 0.6;
    const t = Math.round(tone[0] + r() * (tone[1] - tone[0]));
    out.push({
      d: `M${round(sx)} ${round(sy)} C ${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(ex)} ${round(ey)}`,
      w: round(width[0] + r() * (width[1] - width[0])),
      c: `rgb(${t},${t - 1},${t + 1})`,
      o: round(0.35 + r() * 0.6),
    });
  }
  return out;
}

const D = Math.PI / 180;
// Bulk of the hair falling down-left behind the head.
const FALL = strands(42, 150, [120, 150, 150, 120], [100 * D, 160 * D], [180, 420], [14, 70], [0.6, 2.4]);
// Flyaways lifting up over the wordmark.
const FLY = strands(7, 34, [140, 120, 110, 80], [-160 * D, -60 * D], [90, 260], [40, 110], [0.4, 1.1]);
// A few loose strands crossing the brow and cheek.
const CROSS = strands(91, 12, [190, 150, 60, 60], [-10 * D, 50 * D], [80, 170], [30, 70], [0.4, 0.9]);

// Upright profile (facing right). Tilted back by the group transform below.
const FACE =
  "M -10 -118 C 10 -112 14 -90 12 -66 C 14 -60 18 -56 16 -50 C 14 -46 12 -44 14 -40 C 24 -30 38 -20 44 -14 C 44 -8 36 -4 28 -4 C 30 2 32 6 30 10 C 34 14 30 18 26 19 C 30 22 30 28 24 30 C 20 34 18 38 22 46 C 26 56 24 66 14 72 C 2 80 -6 92 -8 110 C -50 150 -140 220 -205 262 L -290 205 C -200 140 -140 90 -110 40 C -128 0 -126 -60 -100 -96 C -76 -124 -40 -126 -10 -118Z";

export function Portrait({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 700" className={className} aria-hidden="true" overflow="visible">
      <defs>
        <linearGradient id="pt-skin" gradientUnits="userSpaceOnUse" x1="45" y1="-40" x2="-120" y2="60">
          <stop offset="0" stopColor="#ebe5db" />
          <stop offset="0.3" stopColor="#c3bcb1" />
          <stop offset="0.62" stopColor="#7c766e" />
          <stop offset="1" stopColor="#262321" />
        </linearGradient>
        <linearGradient id="pt-fade" gradientUnits="userSpaceOnUse" x1="0" y1="80" x2="0" y2="250">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="pt-neck" maskUnits="userSpaceOnUse" x="-500" y="-500" width="1400" height="1400">
          <rect x="-500" y="-500" width="1400" height="1400" fill="url(#pt-fade)" transform="rotate(55)" />
        </mask>
        <clipPath id="pt-clip">
          <path d={FACE} />
        </clipPath>
        <linearGradient id="pt-hair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141213" />
          <stop offset="0.7" stopColor="#0d0c0d" />
          <stop offset="1" stopColor="#0d0c0d" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* hair falling behind */}
      <path
        d="M150 118 C 80 140 30 240 52 350 C 74 460 150 560 170 700 L 330 700 C 300 610 280 520 296 444 C 262 420 238 380 228 330 C 216 262 232 196 282 156 C 250 120 200 104 150 118Z"
        fill="url(#pt-hair)"
        filter="url(#f-ruffle-lg)"
      />
      <g fill="none" strokeLinecap="round">
        {FALL.map((s, i) => (
          <path key={i} d={s.d} stroke={s.c} strokeWidth={s.w} opacity={s.o} />
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        {FLY.map((s, i) => (
          <path key={i} d={s.d} stroke={s.c} strokeWidth={s.w} opacity={s.o * 0.8} />
        ))}
      </g>

      {/* face + throat */}
      <g transform="translate(300 250) rotate(-55) scale(1.6)">
        <g mask="url(#pt-neck)">
          <path d={FACE} fill="url(#pt-skin)" />
          <g clipPath="url(#pt-clip)">
            {/* light */}
            <ellipse cx="2" cy="-92" rx="12" ry="26" fill="#fff" opacity="0.32" filter="url(#f-soft-s)" />
            <ellipse cx="32" cy="-22" rx="10" ry="6" fill="#fff" opacity="0.55" filter="url(#f-soft-s)" />
            <ellipse cx="4" cy="-14" rx="16" ry="10" fill="#fff" opacity="0.28" filter="url(#f-soft-s)" />
            <ellipse cx="16" cy="60" rx="8" ry="10" fill="#fff" opacity="0.32" filter="url(#f-soft-s)" />
            <ellipse cx="-56" cy="150" rx="16" ry="74" transform="rotate(-55 -56 150)" fill="#fff" opacity="0.2" filter="url(#f-soft-m)" />
            {/* shadow */}
            <ellipse cx="0" cy="-44" rx="13" ry="9" fill="#1a1716" opacity="0.5" filter="url(#f-soft-s)" />
            <ellipse cx="-22" cy="20" rx="20" ry="26" fill="#1a1716" opacity="0.35" filter="url(#f-soft-m)" />
            <path d="M 14 72 C 2 80 -6 92 -8 110 L -70 150 C -60 110 -30 80 14 72Z" fill="#141211" opacity="0.6" filter="url(#f-soft-s)" />
            <ellipse cx="-120" cy="140" rx="46" ry="90" transform="rotate(-55 -120 140)" fill="#141211" opacity="0.55" filter="url(#f-soft-m)" />
            <ellipse cx="-80" cy="-30" rx="40" ry="60" fill="#141211" opacity="0.45" filter="url(#f-soft-m)" />
            {/* grain */}
            <rect x="-340" y="-140" width="420" height="420" fill="#777" filter="url(#f-noise)" opacity="0.35" style={{ mixBlendMode: "overlay" }} />
          </g>
        </g>
        {/* features */}
        <ellipse cx="25" cy="-6" rx="4" ry="2" fill="#2a2523" opacity="0.6" filter="url(#f-soft-s)" />
        <path d="M 30 10 C 34 14 30 18 26 19 C 30 22 30 28 24 30 C 18 26 18 14 30 10Z" fill="#5b524e" opacity="0.55" />
        <path d="M 27 19.5 C 22 20 18 21 14 22" stroke="#1b1716" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        <path d="M -14 -58 C -2 -64 8 -62 14 -56" stroke="#2a2624" strokeWidth="2.4" fill="none" opacity="0.7" strokeLinecap="round" filter="url(#f-ruffle)" />
        <path d="M -8 -42 C -2 -36 8 -36 12 -41" stroke="#171514" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M -4 -38 l -3 4 M 0 -37 l -2 5 M 4 -37 l -1 5 M 8 -38 l 0 4" stroke="#171514" strokeWidth="0.8" />
      </g>

      {/* hair over the crown and the back of the skull */}
      <path
        d="M146 146 C 92 166 46 222 56 290 C 68 360 118 416 188 446 L 232 452 C 204 406 186 356 176 306 C 166 256 158 200 150 156 Z"
        fill="#0e0d0e"
        filter="url(#f-ruffle-lg)"
      />
      <g fill="none" strokeLinecap="round">
        {CROSS.map((s, i) => (
          <path key={i} d={s.d} stroke={s.c} strokeWidth={s.w} opacity={s.o * 0.7} />
        ))}
      </g>
    </svg>
  );
}
