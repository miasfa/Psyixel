import { seeded, round } from "@/lib/random";

/**
 * Original, generated placeholder "photographs" in the PSYIXEL palette.
 * They stand in until real images are added via `src` on <Plate />.
 */
export type PlateVariant =
  | "moon"
  | "redmoon"
  | "flower"
  | "horizon"
  | "figure"
  | "fabric"
  | "paint"
  | "script"
  | "vinyl"
  | "bust"
  | "cassette"
  | "eye"
  | "rock";

const Noise = ({ o = 0.22 }: { o?: number }) => (
  <rect width="100%" height="100%" fill="#fff" filter="url(#f-noise)" opacity={o} style={{ mixBlendMode: "overlay" }} />
);

/* ── Reusable pieces ─────────────────────────────────────────── */

export function Petals({ count = 5, scale = 1, fill = "url(#g-petal)", vein = "#3e2d5e" }: {
  count?: number;
  scale?: number;
  fill?: string;
  vein?: string;
}) {
  const step = 360 / count;
  return (
    <g transform={`scale(${scale})`} filter="url(#f-ruffle)">
      {Array.from({ length: count }, (_, i) => (
        <g key={i} transform={`rotate(${i * step + 8})`}>
          <path d="M0 0 C 46 -34 86 -120 8 -176 C -70 -140 -52 -40 0 0Z" fill={fill} />
          <path d="M0 0 C 46 -34 86 -120 8 -176 C -70 -140 -52 -40 0 0Z" fill="#999" filter="url(#f-stone)" opacity="0.32" style={{ mixBlendMode: "multiply" }} />
          <path d="M0 0 C 10 -50 14 -110 6 -160 M0 -10 C 22 -60 40 -100 34 -140 M0 -10 C -14 -60 -26 -100 -24 -140" stroke={vein} strokeWidth="1.4" fill="none" opacity="0.45" />
        </g>
      ))}
      <circle r="16" fill="#2a1f3b" />
      {Array.from({ length: 7 }, (_, i) => (
        <circle key={i} cx={Math.cos(i) * 9} cy={Math.sin(i * 1.7) * 9} r="3" fill="#e9dcc7" opacity="0.8" />
      ))}
    </g>
  );
}

function scriptLines(seed: number) {
  const r = seeded(seed);
  const lines: string[] = [];
  for (let y = 70; y < 330; y += 26) {
    let x = 30 + r() * 20;
    let d = `M${round(x)} ${y}`;
    while (x < 370) {
      const w = 6 + r() * 10;
      d += ` q ${round(w / 2)} ${round(-6 - r() * 8)} ${round(w)} 0`;
      x += w;
      if (r() < 0.12) {
        x += 8 + r() * 10;
        d += ` M${round(x)} ${y}`;
      }
    }
    lines.push(d);
  }
  return lines;
}
const SCRIPT = scriptLines(21);

function waveform(seed: number, n = 90) {
  const r = seeded(seed);
  return Array.from({ length: n }, (_, i) => {
    const env = Math.sin((i / n) * Math.PI) ** 1.4;
    return round((0.15 + r() * 0.85) * env, 3);
  });
}
const WAVE = waveform(5);

/* ── Variants ────────────────────────────────────────────────── */

function Moon() {
  return (
    <>
      <linearGradient id="sky-moon" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#151516" />
        <stop offset="1" stopColor="#4a4a4b" />
      </linearGradient>
      <rect width="400" height="500" fill="url(#sky-moon)" />
      <circle cx="200" cy="180" r="130" fill="#fff" opacity="0.07" filter="url(#f-soft)" />
      <circle cx="200" cy="180" r="78" fill="url(#g-moon)" />
      <circle cx="200" cy="180" r="78" fill="#888" filter="url(#f-stone)" opacity="0.5" style={{ mixBlendMode: "multiply" }} />
      <rect x="-60" y="250" width="520" height="300" fill="#fff" filter="url(#f-cloud)" opacity="0.9" />
      <rect x="-60" y="340" width="520" height="220" fill="#fff" filter="url(#f-cloud)" opacity="0.75" />
    </>
  );
}

function RedMoon() {
  return (
    <>
      <linearGradient id="sky-red" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0d0c12" />
        <stop offset="1" stopColor="#2b1f2a" />
      </linearGradient>
      <linearGradient id="wall" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#d79a90" />
        <stop offset="1" stopColor="#8b5552" />
      </linearGradient>
      <rect width="400" height="500" fill="url(#sky-red)" />
      <circle cx="118" cy="140" r="90" fill="#b8492f" opacity="0.25" filter="url(#f-soft)" />
      <circle cx="118" cy="140" r="46" fill="url(#g-redmoon)" />
      <circle cx="118" cy="140" r="46" fill="#999" filter="url(#f-stone)" opacity="0.4" style={{ mixBlendMode: "multiply" }} />
      <rect x="-60" y="360" width="340" height="200" fill="#6b5560" filter="url(#f-cloud)" opacity="0.5" />
      <polygon points="196,232 236,214 236,500 196,500" fill="#6a3f3f" />
      <polygon points="236,214 420,180 420,500 236,500" fill="url(#wall)" />
      <polygon points="300,318 352,310 352,384 300,390" fill="#170d11" />
      <rect x="196" y="214" width="224" height="286" fill="#000" filter="url(#f-noise)" opacity="0.18" />
    </>
  );
}

function Flower() {
  return (
    <>
      <radialGradient id="bg-flower" cx="0.6" cy="0.4" r="0.8">
        <stop offset="0" stopColor="#8f7aa8" />
        <stop offset="1" stopColor="#2d2733" />
      </radialGradient>
      <rect width="400" height="500" fill="url(#bg-flower)" />
      <g transform="translate(230 230) rotate(-12)">
        <Petals count={5} scale={1.15} />
      </g>
      <g transform="translate(40 470) rotate(30)" opacity="0.7">
        <Petals count={5} scale={0.6} />
      </g>
    </>
  );
}

function Horizon() {
  return (
    <>
      <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d2c9dc" />
        <stop offset="1" stopColor="#7b7387" />
      </linearGradient>
      <rect width="400" height="500" fill="url(#haze)" />
      <rect x="-60" y="140" width="520" height="200" fill="#fff" filter="url(#f-cloud)" opacity="0.35" />
      <path d="M0 400 Q 110 340 210 352 T 400 300 V500 H0Z" fill="#17151a" />
      <g transform="translate(206 300)" fill="#17151a">
        <circle cx="0" cy="0" r="6.5" />
        <path d="M-7 8 Q 0 4 7 8 L 9 44 L 4 44 L 3 60 L -3 60 L -4 44 L -9 44Z" />
      </g>
    </>
  );
}

function Figure() {
  return (
    <>
      <radialGradient id="bg-fig" cx="0.5" cy="0.4" r="0.8">
        <stop offset="0" stopColor="#4a4746" />
        <stop offset="1" stopColor="#0f0f10" />
      </radialGradient>
      <rect width="400" height="500" fill="url(#bg-fig)" />
      <g filter="url(#f-motion)" fill="#cfc9bf">
        <ellipse cx="200" cy="190" rx="48" ry="60" />
        <path d="M110 500 C 120 330 170 280 200 270 C 240 280 290 330 300 500Z" />
        <path d="M160 160 C 100 140 60 200 40 260 L 70 250 C 90 210 130 180 170 190Z" opacity="0.8" />
      </g>
      <g filter="url(#f-motion)" fill="#cfc9bf" opacity="0.35" transform="translate(70 -10)">
        <ellipse cx="200" cy="190" rx="48" ry="60" />
      </g>
    </>
  );
}

function Fabric() {
  return (
    <>
      <rect width="400" height="500" fill="#121112" />
      <path d="M60 60 C 220 20 360 120 300 260 C 260 360 340 420 380 470 C 240 470 140 380 160 280 C 180 170 90 140 60 60Z" fill="url(#g-sheet)" />
      <path d="M120 120 C 200 110 260 170 230 250 C 210 310 250 380 300 430 C 220 420 170 350 180 270 C 190 200 150 160 120 120Z" fill="#fff" opacity="0.35" />
      <path d="M30 420 C 80 380 140 410 170 440" stroke="#ab92d9" strokeWidth="26" strokeLinecap="round" fill="none" filter="url(#f-paint)" />
    </>
  );
}

function Paint() {
  return (
    <>
      <rect width="400" height="500" fill="#262329" />
      <g filter="url(#f-paint)" fill="none" strokeLinecap="round">
        <path d="M-20 140 C 100 80 220 200 420 90" stroke="#b39ce0" strokeWidth="70" />
        <path d="M-20 300 C 120 230 260 360 420 260" stroke="#ece5d8" strokeWidth="56" />
        <path d="M40 440 C 140 380 280 470 420 400" stroke="#8c72bf" strokeWidth="64" />
        <path d="M100 220 C 180 200 240 230 330 200" stroke="#d8cdf0" strokeWidth="22" />
      </g>
      <rect width="400" height="500" fill="#999" filter="url(#f-stone)" opacity="0.4" style={{ mixBlendMode: "multiply" }} />
    </>
  );
}

function Script() {
  return (
    <>
      <linearGradient id="paper" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e3dccd" />
        <stop offset="1" stopColor="#b7ae9f" />
      </linearGradient>
      <rect width="400" height="500" fill="url(#paper)" />
      <g stroke="#4b4540" strokeWidth="1.3" fill="none" opacity="0.6">
        {SCRIPT.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g fill="#141214" stroke="#141214">
        {[
          [90, 300, 60],
          [170, 260, 75],
          [250, 320, 50],
          [320, 280, 66],
        ].map(([x, y, s], i) => (
          <g key={i}>
            <path d={`M${x} ${y} C ${x - 10} ${y + 80} ${x + 12} ${y + 140} ${x - 6} 520`} strokeWidth="2.4" fill="none" />
            <g transform={`translate(${x} ${y})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} rx={s / 5} ry={s / 2.6} transform={`rotate(${a}) translate(0 ${-s / 3})`} stroke="none" />
              ))}
            </g>
          </g>
        ))}
      </g>
      <Noise o={0.3} />
    </>
  );
}

function Vinyl() {
  const max = Math.max(...WAVE);
  return (
    <>
      <rect width="400" height="500" fill="#0f0e10" />
      <g transform="translate(270 250)">
        <circle r="200" fill="#070707" />
        {Array.from({ length: 34 }, (_, i) => (
          <circle key={i} r={70 + i * 3.9} fill="none" stroke={i % 3 ? "#1b1b1c" : "#272628"} strokeWidth="1" />
        ))}
        <path d="M-140 -140 A 198 198 0 0 1 140 -140 L 0 0Z" fill="#fff" opacity="0.05" />
        <circle r="60" fill="#ab92d9" />
        <circle r="60" fill="#888" filter="url(#f-noise)" opacity="0.25" />
        <circle r="5" fill="#0f0e10" />
      </g>
      <g stroke="#ab92d9" strokeWidth="2" strokeLinecap="round">
        {WAVE.slice(0, 48).map((v, i) => {
          const h = (v / max) * 48;
          return <line key={i} x1={10 + i * 3.6} x2={10 + i * 3.6} y1={250 - h} y2={250 + h} />;
        })}
      </g>
    </>
  );
}

function Bust() {
  return (
    <>
      <radialGradient id="bg-bust" cx="0.5" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#2c292c" />
        <stop offset="1" stopColor="#0c0b0c" />
      </radialGradient>
      <rect width="400" height="500" fill="url(#bg-bust)" />
      <g>
        <path d="M70 500 C 90 420 150 400 170 380 L 170 330 L 230 330 L 230 380 C 250 400 310 420 330 500Z" fill="url(#g-stone)" />
        <ellipse cx="200" cy="260" rx="70" ry="92" fill="url(#g-stone)" />
        <g fill="#2a2725" opacity="0.55">
          <ellipse cx="174" cy="250" rx="16" ry="8" />
          <ellipse cx="226" cy="250" rx="16" ry="8" />
          <path d="M200 252 L 192 296 L 208 296Z" />
          <path d="M184 318 Q 200 326 216 318" stroke="#2a2725" strokeWidth="3" fill="none" />
        </g>
        <rect x="60" y="160" width="290" height="340" fill="#999" filter="url(#f-stone)" opacity="0.45" style={{ mixBlendMode: "multiply" }} />
      </g>
      <g transform="translate(200 165)">
        <g transform="translate(-40 0) rotate(-20)"><Petals scale={0.42} fill="#e5e0d8" vein="#77706a" /></g>
        <g transform="translate(40 -10) rotate(25)"><Petals scale={0.48} fill="#d9d3ca" vein="#77706a" /></g>
        <g transform="translate(0 -40)"><Petals scale={0.5} fill="#f1ede6" vein="#77706a" /></g>
      </g>
    </>
  );
}

function Cassette() {
  return (
    <>
      <radialGradient id="bg-cas" cx="0.5" cy="0.5" r="0.8">
        <stop offset="0" stopColor="#4a4058" />
        <stop offset="1" stopColor="#17141b" />
      </radialGradient>
      <rect width="400" height="500" fill="url(#bg-cas)" />
      <g transform="translate(50 150) rotate(-4 150 100)">
        <rect width="300" height="190" rx="12" fill="#e9e3f2" opacity="0.22" stroke="#ece5d8" strokeOpacity="0.6" />
        <rect x="20" y="18" width="260" height="100" rx="6" fill="#ece5d8" opacity="0.18" />
        <text x="150" y="58" textAnchor="middle" fill="#ece5d8" fontFamily="serif" fontStyle="italic" fontSize="30">Psyixel</text>
        <rect x="80" y="74" width="140" height="36" rx="18" fill="#141215" opacity="0.8" />
        {[110, 190].map((cx) => (
          <g key={cx} transform={`translate(${cx} 92)`}>
            <circle r="15" fill="#ece5d8" opacity="0.8" />
            {[0, 60, 120].map((a) => (
              <rect key={a} x="-2" y="-10" width="4" height="20" fill="#141215" transform={`rotate(${a})`} />
            ))}
          </g>
        ))}
        <path d="M60 190 L 80 150 L 220 150 L 240 190" fill="none" stroke="#ece5d8" strokeOpacity="0.5" />
      </g>
    </>
  );
}

const IRIS = (() => {
  const r = seeded(33);
  return Array.from({ length: 64 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    const r0 = 22 + r() * 6;
    const r1 = 46 + r() * 12;
    return `M${round(Math.cos(a) * r0)} ${round(Math.sin(a) * r0)} L${round(Math.cos(a + 0.05) * r1)} ${round(Math.sin(a + 0.05) * r1)}`;
  }).join(" ");
})();
const BROW = (() => {
  const r = seeded(8);
  return Array.from({ length: 70 }, (_, i) => {
    const t = i / 70;
    const x = 40 + t * 320;
    const y = 120 - Math.sin(t * Math.PI) * 52 + r() * 14;
    return `M${round(x)} ${round(y)} l ${round(14 + r() * 12)} ${round(-6 - r() * 8)}`;
  }).join(" ");
})();

function Eye() {
  return (
    <>
      <radialGradient id="eye-skin" cx="0.5" cy="0.55" r="0.75">
        <stop offset="0" stopColor="#b9b3ac" />
        <stop offset="0.6" stopColor="#8a847d" />
        <stop offset="1" stopColor="#4a4642" />
      </radialGradient>
      <radialGradient id="eye-iris" cx="0.45" cy="0.45" r="0.6">
        <stop offset="0" stopColor="#8d8781" />
        <stop offset="0.55" stopColor="#5a5551" />
        <stop offset="0.9" stopColor="#2a2725" />
        <stop offset="1" stopColor="#151313" />
      </radialGradient>
      <linearGradient id="eye-white" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#6f6a66" />
        <stop offset="0.35" stopColor="#cfcac4" />
        <stop offset="1" stopColor="#b2ada7" />
      </linearGradient>
      <rect width="400" height="500" fill="url(#eye-skin)" />
      {/* brow + lid crease */}
      <path d={BROW} stroke="#2e2a28" strokeWidth="2" opacity="0.75" strokeLinecap="round" />
      <path d="M40 210 Q 200 120 372 205" stroke="#4d4844" strokeWidth="10" fill="none" opacity="0.55" filter="url(#f-soft-s)" />
      {/* eye */}
      <path d="M44 262 Q 200 160 360 250 Q 210 330 44 262Z" fill="url(#eye-white)" />
      <g clipPath="url(#eye-clip)">
        <circle cx="206" cy="250" r="58" fill="url(#eye-iris)" />
        <path d={IRIS} transform="translate(206 250)" stroke="#c9c3bc" strokeWidth="0.8" opacity="0.35" />
        <circle cx="206" cy="250" r="22" fill="#0b0a0a" />
        <ellipse cx="224" cy="232" rx="8" ry="6" fill="#fff" opacity="0.85" />
        <path d="M44 262 Q 200 160 360 250 L 360 190 L 44 190Z" fill="#000" opacity="0.35" filter="url(#f-soft-s)" />
      </g>
      <clipPath id="eye-clip">
        <path d="M44 262 Q 200 160 360 250 Q 210 330 44 262Z" />
      </clipPath>
      {/* lash lines */}
      <path d="M40 264 Q 200 156 364 250" stroke="#141212" strokeWidth="6" fill="none" strokeLinecap="round" />
      <g stroke="#141212" strokeWidth="1.6" strokeLinecap="round" fill="none">
        {Array.from({ length: 30 }, (_, i) => {
          const t = (i + 1) / 31;
          const x = 44 + t * 316;
          const y = 262 - 4 * t * (1 - t) * 104 - t * 12;
          const lean = (t - 0.35) * 26;
          return <path key={i} d={`M${round(x)} ${round(y)} q ${round(lean * 0.4)} -14 ${round(lean)} -24`} />;
        })}
      </g>
      <path d="M50 266 Q 210 326 356 252" stroke="#2b2826" strokeWidth="2" fill="none" opacity="0.7" />
      <rect width="400" height="500" fill="#999" filter="url(#f-stone)" opacity="0.3" style={{ mixBlendMode: "multiply" }} />
    </>
  );
}

function Rock() {
  return (
    <>
      <rect width="400" height="500" fill="#8e8984" />
      <rect width="400" height="500" fill="#fff" filter="url(#f-stone)" />
      <linearGradient id="rock-shade" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.65" />
      </linearGradient>
      <rect width="400" height="500" fill="url(#rock-shade)" />
    </>
  );
}

const VARIANTS: Record<PlateVariant, () => React.JSX.Element> = {
  moon: Moon,
  redmoon: RedMoon,
  flower: Flower,
  horizon: Horizon,
  figure: Figure,
  fabric: Fabric,
  paint: Paint,
  script: Script,
  vinyl: Vinyl,
  bust: Bust,
  cassette: Cassette,
  eye: Eye,
  rock: Rock,
};

export function PlateArt({ variant, className }: { variant: PlateVariant; className?: string }) {
  const Art = VARIANTS[variant];
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <Art />
      <Noise />
    </svg>
  );
}
