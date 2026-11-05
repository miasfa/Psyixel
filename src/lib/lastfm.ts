/**
 * Recently played tracks from Last.fm (user.getrecenttracks).
 *
 * Needs LASTFM_API_KEY (free: https://www.last.fm/api/account/create). Results
 * are cached for five minutes, so the Music page refreshes on its own without
 * calling Last.fm on every visit. Returns null when the key is missing or the
 * request fails, so the page can fall back to a plain profile link.
 */

export const LASTFM_USER = "Miasuuu";
export const LASTFM_PROFILE = `https://www.last.fm/user/${LASTFM_USER}`;

export type RecentTrack = {
  title: string;
  artist: string;
  album?: string;
  url: string;
  /** Album art (300 × 300), when Last.fm has it. */
  image?: string;
  nowPlaying: boolean;
  /** Unix seconds. Missing while the track is playing. */
  playedAt?: number;
};

type ApiImage = { size: string; "#text": string };
type ApiTrack = {
  name: string;
  url: string;
  artist: { "#text": string };
  album?: { "#text": string };
  image?: ApiImage[];
  date?: { uts: string };
  "@attr"?: { nowplaying?: string };
};

// Last.fm's grey star, returned when a track has no artwork.
const NO_ART = "2a96cbd8b46e442fc41c2b86b821562f";

export function parseRecentTracks(json: unknown, limit: number): RecentTrack[] {
  const raw = (json as { recenttracks?: { track?: ApiTrack | ApiTrack[] } })?.recenttracks?.track;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list.slice(0, limit).map((t) => {
    const art = t.image?.find((i) => i.size === "extralarge")?.["#text"] || t.image?.at(-1)?.["#text"];
    return {
      title: t.name,
      artist: t.artist?.["#text"] ?? "",
      album: t.album?.["#text"] || undefined,
      url: t.url,
      image: art && !art.includes(NO_ART) ? art : undefined,
      nowPlaying: t["@attr"]?.nowplaying === "true",
      playedAt: t.date?.uts ? Number(t.date.uts) : undefined,
    };
  });
}

export async function getRecentTracks(limit = 3): Promise<RecentTrack[] | null> {
  const key = process.env.LASTFM_API_KEY;
  if (!key) return null;
  const base = process.env.LASTFM_API_URL ?? "https://ws.audioscrobbler.com/2.0/"; // overridable for local testing
  const url = `${base}?method=user.getrecenttracks&user=${encodeURIComponent(LASTFM_USER)}&api_key=${encodeURIComponent(key)}&format=json&limit=${limit}`;
  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const tracks = parseRecentTracks(await res.json(), limit);
    return tracks.length ? tracks : null;
  } catch {
    return null;
  }
}
