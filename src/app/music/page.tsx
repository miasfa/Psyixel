import type { Metadata } from "next";
import { pageMeta } from "@/lib/meta";
import { TornRule } from "@/components/art/Fragments";
import { Plate } from "@/components/art/Plate";
import { SplitText } from "@/components/motion/SplitText";
import { MusicHero } from "@/components/music/MusicHero";
import { RecentlyPlayed } from "@/components/music/RecentlyPlayed";
import { LASTFM_PROFILE, getRecentTracks } from "@/lib/lastfm";
import { TrackList } from "@/components/music/Players";
import { Index, SampleTag } from "@/components/ui/Bits";
import { albums, playlists, tracks } from "@/content";

export const metadata: Metadata = pageMeta({
  title: "Music",
  description: "Original music by Psyixel: two albums and singles to play in the browser, plus what I’m listening to lately.",
  path: "/music",
});

export default async function MusicPage() {
  const recent = await getRecentTracks(3);
  return (
    <>
      <MusicHero />

      <TornRule seed={61} />

      <section aria-labelledby="tracks-title" className="gutter py-20 md:py-[7vw]">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Index n="01" />
            <SplitText
              as="h2"
              className="mt-3"
              lines={[
                { text: "My", className: "t-heavy text-[15vw] md:text-[5.6vw]" },
                { text: "music", className: "t-serif text-[13vw] md:text-[5vw] text-lav pl-[0.3em]" },
              ]}
            />
            <span id="tracks-title" className="sr-only">
              My music
            </span>
          </div>
          <p className="t-label max-w-xs text-ivory/60">Finished pieces and experiments I want to share.</p>
        </div>
        <div className="-mt-4 mb-12 max-w-2xl space-y-5 font-read text-xl leading-relaxed text-ivory/80">
          <p data-reveal="up">I make music as another way of exploring an idea or a feeling. Sometimes I begin with a melody. Sometimes with a texture, a rhythm, or a sound I want to hear again.</p>
          <p data-reveal="up" data-delay="0.08">This is where I share what comes of that.</p>
        </div>
        {albums.length > 0 ? (
          <div className="space-y-20 md:space-y-[6vw]">
            {albums.map((a) => {
              const list = tracks.filter((t) => t.album === a.slug);
              const secs = list.reduce((n, t) => {
                const [m, s] = (t.duration ?? "0:0").split(":").map(Number);
                return n + m * 60 + s;
              }, 0);
              return (
                <section key={a.slug} id={a.slug} aria-labelledby={`album-${a.slug}`} className="scroll-mt-28">
                  <div className="mb-8 grid items-end gap-6 sm:grid-cols-[9rem_1fr] md:grid-cols-[12vw_1fr_auto] md:gap-[2.4vw]">
                    <div data-reveal="clip" className="w-36 border-2 border-ivory/80 bg-ink p-[3px] sm:w-full">
                      <Plate image={a.cover} showTag={false} className="aspect-square w-full" sizes="(max-width: 768px) 144px, 12vw" />
                    </div>
                    <div>
                      <p className="t-label text-lav">
                        {a.kind}
                        {a.year && <> · {a.year}</>}
                      </p>
                      <h3 id={`album-${a.slug}`} className="t-serif mt-2 text-[12vw] leading-[0.95] md:text-[4.6vw]">
                        {a.title}
                      </h3>
                      <p className="t-label mt-3 text-ivory/60">
                        {list.length} {list.length === 1 ? "track" : "tracks"}
                        {secs > 0 && <> · {Math.round(secs / 60)} min</>}
                      </p>
                    </div>
                    {a.url && (
                      <a href={a.url} target="_blank" rel="noreferrer" className="t-label w-fit border-b border-lav pb-1 text-ivory transition-colors hover:text-lav">
                        Listen on SoundCloud ↗
                      </a>
                    )}
                  </div>
                  <TrackList album={a.slug} />
                </section>
              );
            })}
          </div>
        ) : (
          <TrackList />
        )}
      </section>

      <TornRule seed={62} />

      <section aria-labelledby="playlists-title" className="gutter py-20 md:py-[7vw]">
        <Index n="02" />
        <SplitText
          as="h2"
          className="mb-4 mt-3"
          lines={[
            { text: "What I’m", className: "t-heavy text-[15vw] md:text-[5.6vw]" },
            { text: "listening to", className: "t-serif text-[13vw] md:text-[5vw] text-lav pl-[0.3em]" },
          ]}
        />
        <span id="playlists-title" className="sr-only">
          What I’m listening to
        </span>
        <p className="mb-10 max-w-xl font-read text-lg text-ivory/70">
          Music by other people that stays with me.{playlists.length > 0 && " These playlists are part of what I bring back to my own work."}
        </p>

        {/* last three plays from Last.fm (refreshed every five minutes) */}
        {recent ? (
          <>
            <RecentlyPlayed tracks={recent} />
            <a href={LASTFM_PROFILE} target="_blank" rel="noreferrer" className="t-label mt-10 inline-block border-b border-lav pb-1 text-ivory transition-colors hover:text-lav">
              More of what I&rsquo;m playing on Last.fm ↗
            </a>
          </>
        ) : (
          <a href={LASTFM_PROFILE} target="_blank" rel="noreferrer" className="t-label inline-block border-b border-lav pb-1 text-ivory transition-colors hover:text-lav">
            See what I&rsquo;m playing on Last.fm ↗
          </a>
        )}

        {playlists.length > 0 && (
          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {playlists.map((p, i) => {
              const body = (
                <>
                  <div className="relative aspect-square overflow-hidden">
                    <div className="duotone-hover relative h-full w-full transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-105">
                      <Plate image={p.cover} className="h-full w-full" sizes="(max-width: 768px) 100vw, 33vw" />
                    </div>
                  </div>
                  <p className="t-label mt-4 text-dust">{String(i + 1).padStart(2, "0")} · {p.mood}</p>
                  <p className="t-serif mt-1 text-4xl transition-colors group-hover:text-lav">{p.title}</p>
                  {p.description && <p className="mt-2 font-read text-ivory/70">{p.description}</p>}
                </>
              );
              return (
                <li key={p.slug} data-reveal="up" data-delay={String(i * 0.1)}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" data-cursor="Listen" className="group block">
                      {body}
                      <span className="t-label mt-3 inline-block text-lav">Listen on {p.platform ?? "streaming"} ↗</span>
                    </a>
                  ) : (
                    <div className="group">
                      {body}
                      <span className="t-label mt-3 inline-flex items-center gap-3 text-dust">
                        Not linked yet {p.placeholder && <SampleTag />}
                      </span>
                    </div>
                  )}
                  {p.embedUrl && (
                    <iframe
                      title={`${p.title} playlist`}
                      src={p.embedUrl}
                      loading="lazy"
                      className="mt-4 h-[152px] w-full rounded-none border-0"
                      allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
