// Fine ivory print texture for the wordmark (tileable 512×512 WebP):
// soft tonal mottling, very fine grain, and rare tiny ink-dropout specks.
import sharp from "sharp";

const N = 512;
const rnd = (() => { let a = 7; return () => ((a = (a * 1664525 + 1013904223) >>> 0) / 4294967296); })();
// value noise, tileable
function vnoise(cells) {
  const g = Array.from({ length: cells * cells }, rnd);
  const at = (x, y) => g[((y % cells + cells) % cells) * cells + ((x % cells + cells) % cells)];
  const s = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const fx = (x / N) * cells, fy = (y / N) * cells, x0 = Math.floor(fx), y0 = Math.floor(fy), tx = s(fx - x0), ty = s(fy - y0);
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * tx, b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * tx;
    return a + (b - a) * ty;
  };
}
const n1 = vnoise(4), n2 = vnoise(16);
const base = [236, 229, 216]; // #ECE5D8
const out = Buffer.alloc(N * N * 4);
for (let y = 0; y < N; y++)
  for (let x = 0; x < N; x++) {
    const mott = (n1(x, y) - 0.5) * 0.06 + (n2(x, y) - 0.5) * 0.03; // ±4.5% tone
    const grain = (rnd() - 0.5) * 0.035; // fine grain
    const k = 1 + mott + grain;
    const i = (y * N + x) * 4;
    out[i] = Math.min(255, base[0] * k); out[i + 1] = Math.min(255, base[1] * k); out[i + 2] = Math.min(255, base[2] * k * 0.995);
    out[i + 3] = 255;
  }
// rare specks: 1–2px, soft, partial
for (let s = 0; s < 70; s++) {
  const cx = Math.floor(rnd() * N), cy = Math.floor(rnd() * N), r = rnd() < 0.8 ? 1 : 2, a = 0.35 + rnd() * 0.4;
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    if (dx * dx + dy * dy > r * r) continue;
    const i = (((cy + dy + N) % N) * N + ((cx + dx + N) % N)) * 4;
    for (let c = 0; c < 3; c++) out[i + c] = Math.round(out[i + c] * (1 - a) + 30 * a);
  }
}
await sharp(out, { raw: { width: N, height: N, channels: 4 } }).webp({ quality: 86 }).toFile("public/images/wordmark-ink.webp");
console.log("public/images/wordmark-ink.webp");
