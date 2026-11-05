import { round, seeded } from "@/lib/random";

/*
 * Printed-surface layer for the homepage: static fine grain plus sparse
 * scratches, fibres and dust. It is anchored to the page (absolute over the
 * sections, so it scrolls with the composition) rather than fixed to the
 * screen. The marks are one non-repeating SVG stretched over the whole page in
 * a 1000 × 1000 box; strokes keep a fixed pixel width, so specks stay round.
 */

const R = seeded(2026);
const between = (a: number, b: number) => a + R() * (b - a);

// Hero face and tagline: keep scratches and dark specks out of it.
const inHeroFocus = (x: number, y: number) => x > 230 && x < 720 && y < 190;

type Mark = { d: string; w: number; o: number; dash?: string; dark?: boolean };

function scratches(count: number) {
  const out: Mark[] = [];
  while (out.length < count) {
    const x = between(0, 1000);
    const y = between(0, 1000);
    if (inHeroFocus(x, y)) continue;
    const len = between(14, 120);
    const tilt = between(-0.07, 0.07) * len * 6; // near-vertical, slight lean
    const bend = between(-4, 4);
    const broken = R() < 0.35;
    out.push({
      d: `M${round(x)} ${round(y)} q ${round(tilt / 2 + bend)} ${round(len / 2)} ${round(tilt)} ${round(len)}`,
      w: round(between(0.5, 0.9)),
      o: round(between(0.05, 0.11)),
      dash: broken ? `${round(between(6, 30))} ${round(between(3, 12))}` : undefined,
    });
  }
  return out;
}

// A few long, very faint film hairlines.
function hairlines(count: number) {
  const out: Mark[] = [];
  while (out.length < count) {
    const x = between(40, 960);
    const y = between(150, 700);
    out.push({ d: `M${round(x)} ${round(y)} l ${round(between(-6, 6))} ${round(between(180, 320))}`, w: 0.5, o: 0.045 });
  }
  return out;
}

// Short curled paper fibres.
function fibres(count: number) {
  const out: Mark[] = [];
  while (out.length < count) {
    const x = between(0, 1000);
    const y = between(0, 1000);
    if (inHeroFocus(x, y)) continue;
    out.push({
      d: `M${round(x)} ${round(y)} c ${round(between(-3, 3))} ${round(between(1, 3))} ${round(between(-4, 4))} ${round(between(2, 5))} ${round(between(-2, 6))} ${round(between(3, 7))}`,
      w: 0.6,
      o: round(between(0.07, 0.13)),
    });
  }
  return out;
}

// Dust: zero-length round-capped strokes render as round dots at a fixed pixel size.
function dust(count: number) {
  const out: Mark[] = [];
  while (out.length < count) {
    const x = between(0, 1000);
    const y = between(0, 1000);
    const dark = R() < 0.18;
    if (dark && inHeroFocus(x, y)) continue;
    out.push({ d: `M${round(x)} ${round(y)} h0`, w: round(between(0.9, 2.3)), o: round(dark ? between(0.25, 0.4) : between(0.08, 0.22)), dark });
  }
  return out;
}

const LIGHT = [...hairlines(3), ...scratches(24), ...fibres(12)];
const SPECKS = dust(150);

export function PrintSurface() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[70] overflow-hidden">
      <div className="print-grain absolute inset-0" />
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full mix-blend-screen">
        <g fill="none" stroke="#ece5d8" strokeLinecap="round" vectorEffect="non-scaling-stroke">
          {LIGHT.map((m, i) => (
            <path key={i} d={m.d} strokeWidth={m.w} strokeOpacity={m.o} strokeDasharray={m.dash} vectorEffect="non-scaling-stroke" />
          ))}
          {SPECKS.filter((m) => !m.dark).map((m, i) => (
            <path key={i} d={m.d} strokeWidth={m.w} strokeOpacity={m.o} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
      {/* dark specks only show on light paper and photos, as on a print */}
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full mix-blend-multiply">
        <g fill="none" stroke="#0c0b0d" strokeLinecap="round">
          {SPECKS.filter((m) => m.dark).map((m, i) => (
            <path key={i} d={m.d} strokeWidth={m.w} strokeOpacity={m.o} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>
    </div>
  );
}
