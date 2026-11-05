// Adds music files to the site: web audio, waveform data and embedded cover art.
//
// Usage: node scripts/import-music.mjs <album-slug>/<track-slug>=<file> [...]
//   e.g. node scripts/import-music.mjs luminara/solvind=~/Downloads/Solvind.mp3
//
// For each file it writes:
//   public/audio/<album>/<track>.mp3   MP3 sources are copied without re-encoding
//                                      (no quality loss); anything else becomes
//                                      MP3 at 256 kbps. Embedded art and tags are
//                                      stripped to keep the file small.
//   public/images/music/<album>-<track>.webp   the embedded cover, if the file has one
//   src/content/music-data.json        duration + 96 waveform peaks, so the site
//                                      never downloads a track just to draw it.
// Then list the track in src/content/music.ts. Requires ffmpeg/ffprobe on PATH.
// Source files are never modified.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import sharp from "sharp";

const DATA = "src/content/music-data.json";
const PEAKS = 96;

const items = process.argv.slice(2).map((a) => {
  const m = a.match(/^([a-z0-9-]+)\/([a-z0-9-]+)=(.+)$/);
  if (!m) throw new Error(`Expected <album-slug>/<track-slug>=<file>, got: ${a}`);
  return { album: m[1], slug: m[2], file: m[3] };
});
if (!items.length) {
  console.error("Usage: node scripts/import-music.mjs <album-slug>/<track-slug>=<file> [...]");
  process.exit(1);
}

const run = (cmd, args) => {
  const r = spawnSync(cmd, args, { maxBuffer: 1 << 30 });
  if (r.status !== 0) throw new Error(`${cmd} failed: ${r.stderr?.toString().slice(-400)}`);
  return r.stdout;
};

const data = existsSync(DATA) ? JSON.parse(readFileSync(DATA, "utf8")) : {};
mkdirSync("public/images/music", { recursive: true });

for (const { album, slug, file } of items) {
  mkdirSync(join("public/audio", album), { recursive: true });
  const out = join("public/audio", album, `${slug}.mp3`);
  const copy = extname(file).toLowerCase() === ".mp3";
  run("ffmpeg", ["-y", "-v", "error", "-i", file, "-map", "0:a", "-map_metadata", "-1", ...(copy ? ["-c:a", "copy"] : ["-c:a", "libmp3lame", "-b:a", "256k"]), out]);

  // Embedded cover → webp (skipped quietly when there is none).
  const tmp = join("public/images/music", `.${album}-${slug}.jpg`);
  const art = spawnSync("ffmpeg", ["-y", "-v", "error", "-i", file, "-an", "-c:v", "copy", tmp]);
  let cover;
  if (art.status === 0 && existsSync(tmp)) {
    cover = `/images/music/${album}-${slug}.webp`;
    await sharp(tmp).resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true }).webp({ quality: 88 }).toFile(join("public", cover));
    rmSync(tmp);
  }

  const duration = parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", out]).toString());
  // Mono 2 kHz float samples → RMS per bucket, normalised to the loudest bucket.
  const pcm = run("ffmpeg", ["-v", "error", "-i", out, "-ac", "1", "-ar", "2000", "-f", "f32le", "-"]);
  const samples = new Float32Array(pcm.buffer.slice(pcm.byteOffset, pcm.byteOffset + Math.floor(pcm.length / 4) * 4));
  const per = Math.floor(samples.length / PEAKS);
  const rms = Array.from({ length: PEAKS }, (_, k) => {
    let s = 0;
    for (let j = k * per; j < (k + 1) * per; j++) s += samples[j] * samples[j];
    return Math.sqrt(s / per);
  });
  const max = Math.max(...rms) || 1;
  data[`${album}/${slug}`] = {
    src: `/audio/${album}/${slug}.mp3`,
    duration: Math.round(duration),
    ...(cover ? { cover } : {}),
    peaks: rms.map((v) => Math.round((0.08 + 0.92 * (v / max)) * 100) / 100),
  };
  console.log(`✓ ${out}  ${Math.floor(duration / 60)}:${String(Math.round(duration % 60)).padStart(2, "0")}${cover ? `  + cover ${cover}` : ""}`);
}

writeFileSync(DATA, JSON.stringify(data, null, 1) + "\n");
console.log(`Wrote ${DATA}`);
