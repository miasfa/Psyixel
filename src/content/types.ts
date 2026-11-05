import type { PlateImage } from "@/components/art/Plate";

/**
 * Content model. Everything the site renders comes from the typed files in
 * this folder, so swapping to a CMS later only means replacing the loaders
 * in src/content/index.ts with API calls that return these same shapes.
 */

export type WorldKey = "studio" | "photography" | "art" | "words" | "music";

export type World = {
  key: WorldKey;
  index: string;
  title: string;
  href: string;
  /** Short mono caption on the entrance card. */
  caption: string;
  /** "Things I …" line from the core message (homepage card hover). */
  thing: string;
  /** Longer line for the About page's disciplines section. */
  attention: string;
  cover: PlateImage;
  /** Card title typeface: heavy condensed or italic serif. */
  titleStyle?: "condensed" | "serif";
};

export type Service = {
  /** Anchor id on /studio. */
  slug: string;
  title: string;
  summary: string;
  includes: string[];
};

/**
 * A Studio case study. Only `slug`, `title`, `disciplines`, `summary` and
 * `cover` are required; the project page shows each optional section only
 * when it has content.
 */
export type StudioProject = {
  slug: string;
  title: string;
  year?: string;
  /** Client or collaborator, if you want to name them. */
  client?: string;
  disciplines: string[];
  /** One or two sentences: what the project is. Shown on the card and as the page intro. */
  summary: string;
  /** What you did on it (e.g. "Design and development"). */
  role?: string;
  /** Context: what the project is for and what it needed to do. Paragraphs. */
  problem?: string[];
  /** Key design decisions, one short paragraph each. */
  decisions?: string[];
  /** Screenshots or process images, in order. Captions use `alt` unless `caption` is set. */
  screenshots?: (PlateImage & { caption?: string })[];
  /** What changed: the outcome, in your own words. Paragraphs. */
  result?: string[];
  /** Live site or case-study link. Paths starting with "/" stay on this site. */
  url?: string;
  /** Label for the link (default "Visit the project"). */
  urlLabel?: string;
  cover: PlateImage;
  placeholder?: boolean;
};

export type Photo = PlateImage & {
  caption?: string;
  /** Visual weight in the gallery layout. */
  size?: "s" | "m" | "l";
};

export type PhotoTag = "people" | "places" | "nature" | "sky";

export type PhotoCollection = {
  slug: string;
  title: string;
  /** Used by the filters on /photography. */
  tags?: PhotoTag[];
  /** Italic one-liner shown under the title. */
  poem?: string;
  intro?: string;
  year?: string;
  cover: PlateImage;
  photos: Photo[];
  placeholder?: boolean;
};

export type Artwork = {
  slug: string;
  title: string;
  year?: string;
  medium?: string;
  dimensions?: string;
  statement?: string;
  image: PlateImage;
  details?: PlateImage[];
  placeholder?: boolean;
};

export type Block =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string }
  | { type: "verse"; text: string };

export type Writing = {
  slug: string;
  title: string;
  kind: "Essay" | "Poem" | "Reflection" | "Fragment" | "Note";
  date: string; // ISO
  excerpt: string;
  body: Block[];
  cover?: PlateImage;
  placeholder?: boolean;
};

export type Track = {
  id: string;
  title: string;
  artist: string;
  /** Album slug this track belongs to (see `albums` in music.ts). */
  album?: string;
  /** Audio file in /public/audio — only files you own or are licensed to share. */
  src?: string;
  /** Display length, e.g. "3:06". */
  duration?: string;
  /** Precomputed waveform (0–1), written by scripts/import-music.mjs. */
  peaks?: number[];
  /** The track elsewhere (e.g. SoundCloud). */
  url?: string;
  note?: string;
  cover: PlateImage;
  placeholder?: boolean;
};

export type Album = {
  slug: string;
  title: string;
  /** "Album", "EP", "Singles"… */
  kind: string;
  year?: string;
  cover: PlateImage;
  /** Album page elsewhere (e.g. SoundCloud). */
  url?: string;
  placeholder?: boolean;
};

export type Playlist = {
  slug: string;
  title: string;
  mood: string;
  description?: string;
  /** External listening link (Spotify, Apple Music, Bandcamp, SoundCloud…). */
  url?: string;
  platform?: string;
  /** Optional embeddable player URL, e.g. https://open.spotify.com/embed/playlist/… */
  embedUrl?: string;
  cover: PlateImage;
  placeholder?: boolean;
};

export type ArchiveItem = {
  title: string;
  world: WorldKey;
  href: string;
  cover: PlateImage;
};
