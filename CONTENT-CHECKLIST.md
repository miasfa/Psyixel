# Psyixel: content checklist (5 Nov 2026)

## How samples work now
- Every unfinished entry is marked `placeholder: true` in `src/content/*.ts`.
- **While editing (`npm run dev`)**, samples show, each with a "Sample content" tag.
- **In a production build**, samples are left out automatically:
  - Their detail pages don't exist (they return 404).
  - The homepage Selected Work section hides itself.
  - Empty lists show "Nothing published here yet."
- To check a production build *with* samples, run `SHOW_SAMPLES=1 npm run build`.
- **To publish an entry:** replace its text and images, then delete `placeholder: true`.

---

## 1. Entries to replace (all hidden from the public site until finished)

| Where | Entry | What it needs |
|---|---|---|
| `src/content/studio.ts` → `studioProjects` | ✅ **Real projects added:** Dalian Dawody, Carlstad Körcenter, Psyixel. Samples removed. | Still open: project years, and any extra work to credit (photography, logo, copywriting). |
| `src/content/photography.ts` → `collections` | ✅ **Real photos added:** Sky Notes, Water Lines, After Dark, Up Close (15 photos). The 3 sample collections remain, hidden from production. | Optional: a one-line poem or intro per collection, captions. Add photos to `public/images/photography/<collection>/` and list them with `photo(...)`. |
| `src/content/art.ts` → `artworks` | ✅ **Real digital works added (6).** Samples removed. | Still open: real titles (current ones are working titles), years, and an optional statement per work. |
| `src/content/words.ts` → `writings` | The Second Nature, A Quiet Exit, On Attention, Fragments Vol. I | Your writing, a real date, kind (Essay / Poem / Reflection) and excerpt. The sample bodies still contain editing notes such as "Replace this entry in src/content/words.ts…". |
| `src/content/music.ts` → `albums`, `tracks` | ✅ **Real music added:** After the Noise, Luminara and four singles (11 playable tracks). | Album artwork added from SoundCloud. Still needed: confirm whether the four singles are an album with its own title. Add more with `node scripts/import-music.mjs <album>/<slug>=<file>`. |
| `src/content/music.ts` → `playlists` | In-Between, Lavender Hours, Night Transit | Real playlist `url` (and optional `embedUrl`), or delete the entries. |
| `src/content/index.ts` → `archive` | Homepage Selected Work | Points at specific entries by slug. Once you've published your own pieces, edit this list to choose the four you want. |

## 2. Site details (`src/content/site.ts`)
- `email`: a public address, or leave it empty. When set, Contact shows "You can also email me directly."
- `socials`: `{ label, href }` profiles. The footer's "Elsewhere" column appears once there's at least one.
- `signature` ("An ongoing work."): the footer line, which you said you may personalise later.

## 3. Images that are still cut from the design references (not entries; they're layout artwork)
These are low-resolution crops of the mockup and concepts. The full list with exact sizes, transparency needs and prompts is in `IMAGE-AUDIT.md` (Part 3). Import each with `npm run asset -- <slot> <file>`.
- **Highest priority:**
  - Hero `eye` and `moon`.
  - Page heroes `studio-hero-collage`, `art-hero-brush`, `words-hero-collage`, `about-hero-collage`.
  - Photography `photo-feature`, `photo-moon`, `photo-coast` and `photo-tree`. These also become the collection images once you publish photography.
- **Already replaced:** portrait, iris, rock, about-collage, contact-horizon, world-studio, world-words.
- **Hero portrait:** the current file is 1086px wide. A 2400px export would be sharper on large screens.

## 4. Studio project template
Fields: `summary`, `role`, `client`, `year`, `disciplines`, `problem[]` (shown as Context), `screenshots[]` (with captions), `decisions[]` (Key decisions), `result[]`, `url` (a path like `/` stays on this site), `urlLabel`, `cover`.
- Each project now has a page at `/studio/<slug>`.
- Sections without content simply don't appear.
- Put screenshots in `public/images/studio/<project>/`. 16:10 for the cover and screenshots, 2000px wide or more.

## 5. Launch configuration (not content, but required)
- `NEXT_PUBLIC_SITE_URL`: your real domain. Without it, social previews, the sitemap and canonical URLs point to `http://localhost:3000`.
- **Last.fm:** set `LASTFM_API_KEY` on your host too (it's in your local `.env.local`, which is never committed). Without it, "What I'm listening to" just links to your Last.fm profile.
- **Contact delivery** (Resend):
  - `RESEND_API_KEY`: your Resend API key.
  - `CONTACT_TO_EMAIL`: where messages arrive.
  - `CONTACT_FROM_EMAIL`: a sender on a domain you've verified in Resend. The default `onboarding@resend.dev` only delivers to your own Resend account address, so it's fine for testing but not for launch.
  - Until these are set, the form says it isn't connected and never pretends to send.
