import { artworks as allArtworks } from "./art";
import { albums as allAlbums, playlists as allPlaylists, tracks as allTracks } from "./music";
import { collections as allCollections } from "./photography";
import { studioProjects as allStudioProjects } from "./studio";
import type { ArchiveItem } from "./types";
import { writings as allWritings } from "./words";

/**
 * Content access layer. Pages only import from here, so moving to a CMS means
 * re-implementing these functions (make them async if needed) — nothing else.
 *
 * SAMPLES: entries marked `placeholder: true` are unfinished. They appear while
 * editing (`npm run dev`) and are left out of production builds, so they never
 * reach the public site. To preview them in a production build, set SHOW_SAMPLES=1.
 * Publishing an entry = replacing its content and removing `placeholder: true`.
 */
export const showSamples = process.env.NODE_ENV !== "production" || process.env.SHOW_SAMPLES === "1";
const published = <T extends { placeholder?: boolean }>(list: T[]) => (showSamples ? list : list.filter((x) => !x.placeholder));

export { site, nav, heroCollage } from "./site";
export { worlds } from "./worlds";
export { services, process, studioFocus } from "./studio";

export const studioProjects = published(allStudioProjects);
export const collections = published(allCollections);
export const artworks = published(allArtworks);
export const tracks = published(allTracks);
/** Albums with at least one published track. */
export const albums = published(allAlbums).filter((a) => tracks.some((t) => t.album === a.slug));
export const playlists = published(allPlaylists);
const writings = published(allWritings);

export const getStudioProject = (slug: string) => studioProjects.find((p) => p.slug === slug);
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getArtwork = (slug: string) => artworks.find((a) => a.slug === slug);
export const getWriting = (slug: string) => writings.find((w) => w.slug === slug);
export const getWritings = () => [...writings].sort((a, b) => b.date.localeCompare(a.date));

const track = (id: string) => tracks.find((t) => t.id === id);
const writing = (slug: string) => writings.find((w) => w.slug === slug);

/**
 * Selected Work on the homepage — mixed disciplines, newest first. Each item
 * points at a published entry; items whose entry is unpublished drop out, and
 * the section hides itself when nothing is left.
 */
export const archive: ArchiveItem[] = ([
  (() => { const t = track("side-step"); return t && { title: t.title, world: "music" as const, href: "/music#side-step", cover: t.cover }; })(),
  (() => { const p = getStudioProject("dalian-dawody"); return p && { title: p.title, world: "studio" as const, href: `/studio/${p.slug}`, cover: { ...p.cover, src: "/images/studio/dalian-dawody/thumb.webp" } }; })(),
  (() => { const w = writing("if-you-walk-alone-tonight"); return w && { title: w.title, world: "words" as const, href: `/words/${w.slug}`, cover: { src: "/images/photography/water-lines/01.webp", mono: false, variant: "horizon" as const, alt: "The sun setting over a rocky shore" } }; })(),
  (() => { const c = getCollection("sky-notes"); return c && { title: c.title, world: "photography" as const, href: `/photography/${c.slug}`, cover: c.cover }; })(),
] as (ArchiveItem | undefined)[]).filter((x): x is ArchiveItem => Boolean(x));
