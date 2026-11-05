import data from "./music-data.json";
import type { Album, Playlist, Track } from "./types";

/**
 * Music by Psyixel. Albums group the tracks on /music; the player plays every
 * track in the order listed below.
 *
 * ADDING MUSIC: run scripts/import-music.mjs (it copies the audio into
 * public/audio, extracts embedded cover art and writes the waveform/duration
 * to music-data.json), then add the track below with `t("<album>/<slug>", …)`.
 */
const SC = "https://soundcloud.com/psyixel";

// Album artwork from SoundCloud (1080 × 1080).
const COVER_AFTER_THE_NOISE = { src: "/images/music/after-the-noise.webp", mono: false, variant: "vinyl", alt: "A figure in headphones on a neon-lit city street at night" } as const;
const COVER_LUMINARA = { src: "/images/music/luminara.webp", mono: false, variant: "vinyl", alt: "Wildflowers under a starry violet sky, framed by a film strip" } as const;

export const albums: Album[] = [
  { slug: "after-the-noise", title: "After the Noise", kind: "Album", year: "2025", url: `${SC}/sets/after-the-noise`, cover: { ...COVER_AFTER_THE_NOISE } },
  { slug: "luminara", title: "Luminara", kind: "Album", year: "2025", url: `${SC}/sets/luminara`, cover: { ...COVER_LUMINARA } },
  // TODO: these four were posted on SoundCloud as separate tracks; rename if they form an album.
  { slug: "singles", title: "Singles", kind: "Singles", year: "2025", url: `${SC}/tracks`, cover: { src: "/images/music/singles-side-step.webp", mono: false, variant: "vinyl", alt: "A record spinning on a turntable" } },
];

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
type Entry = { src: string; duration: number; peaks: number[]; cover?: string };
const files = data as Record<string, Entry>;

/** A track whose audio was added with scripts/import-music.mjs (key "<album>/<slug>"). */
function t(key: string, title: string, extra: Partial<Track> & { coverAlt?: string } = {}): Track {
  const [album, slug] = key.split("/");
  const d = files[key];
  const { coverAlt, ...rest } = extra;
  const albumCover = albums.find((a) => a.slug === album)!.cover;
  return {
    id: slug,
    title,
    artist: "Psyixel",
    album,
    src: d?.src,
    duration: d ? fmt(d.duration) : undefined,
    peaks: d?.peaks,
    cover: d?.cover ? { src: d.cover, mono: false, variant: "vinyl", alt: coverAlt ?? `Cover for ${title}` } : albumCover,
    ...rest,
  };
}

export const tracks: Track[] = [
  // After the Noise (2025) — order as on SoundCloud
  t("after-the-noise/still-here", "Still Here", { url: `${SC}/still-here-1` }),
  t("after-the-noise/leave-no-bruise", "Leave No Bruise", { url: `${SC}/leave-no-bruise-2` }),
  t("after-the-noise/as-written", "As Written", { url: `${SC}/as-written-3` }),
  t("after-the-noise/small-things", "Small Things", { url: `${SC}/small-things-4` }),
  // Luminara (2025)
  t("luminara/solvind", "Solvind", { url: `${SC}/solvind-1` }),
  t("luminara/nostalgi", "Nostalgí", { url: `${SC}/nostalgi-2` }),
  t("luminara/into-the-light", "Into the Light", { url: `${SC}/into-the-light-3` }),
  t("luminara/aurora-veins", "Aurora Veins", { url: `${SC}/aurora-veins-4` }),
  // Singles (2025), in release order
  t("singles/9-3-til-the-end", "9-3 Til the End", { url: `${SC}/9-3-til-the-end`, coverAlt: "Two friends against a graffiti wall at night" }),
  t("singles/city-lights-and-loops", "City Lights & Loops", { url: `${SC}/city-lights-loops`, coverAlt: "Four friends on a rooftop with turntables, looking over the city at sunset" }),
  t("singles/where-you-stand", "Where You Stand", { url: `${SC}/where-you-stand`, coverAlt: "A figure under a streetlight on a city pavement at night" }),
  t("singles/side-step", "Side Step", { url: `${SC}/side-step`, coverAlt: "A record spinning on a turntable" }),
];

/**
 * Curated playlists live on streaming services. Add `url` (and optionally
 * `embedUrl`) to link out or embed; without a url the card says so honestly.
 */
// Add playlists as { slug, title, mood, url, platform, cover }; the section shows them under the Last.fm plays.
export const playlists: Playlist[] = [];
