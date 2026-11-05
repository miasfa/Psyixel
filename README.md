# PSYIXEL — an independent creative universe

Next.js 16 (App Router, TypeScript) · Tailwind CSS 4 · GSAP + ScrollTrigger · Lenis

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start   # production preview
```

Requires Node 20+.

## Where things live

| What | File |
| --- | --- |
| Name, tagline, manifesto, about copy, email, socials, hero portrait | `src/content/site.ts` |
| The five world entrances (titles, captions, covers) | `src/content/worlds.ts` |
| Studio services, process, case studies | `src/content/studio.ts` |
| Photography collections + images + captions | `src/content/photography.ts` |
| Artworks | `src/content/art.ts` |
| Writing (essays, poems, fragments) | `src/content/words.ts` |
| Tracks (audio files) + playlists (external links/embeds) | `src/content/music.ts` |
| Homepage archive selection | `src/content/index.ts` (`archive`) |
| Design tokens (colours, fonts, textures) | `src/app/globals.css` |

All pages read content through `src/content/index.ts`. To move to a CMS later, re-implement those getters to fetch the same shapes (types are in `src/content/types.ts`).

### Images

Every image is a `PlateImage`: `{ src?, alt, variant, mono? }`.
- Put files in `public/images/...` and set `src: "/images/..."`.
- While `src` is empty, an original generated placeholder (`variant`) is shown with a small "placeholder" tag.
- Real photos render monochrome by default (art direction); set `mono: false` to keep colour.

### Collage images (hero + homepage fragments)

**Replacing with high-resolution art:** see [ASSETS.md](ASSETS.md) for every slot's size, transparency and description, and import with `npm run asset -- <slot> <file>`.

Drop a file into `public/images/collage/` named after its slot (`.avif`, `.webp`, `.png` or `.jpg`). It replaces the SVG stand-in automatically on refresh — no code changes. Delete it to go back.

- **Transparent file** (alpha channel) → used as a floating **cut-out**.
- **Opaque photo** → pasted in as a **torn print**.

| Slot file | Where | Best asset |
| --- | --- | --- |
| `portrait` | Hero figure over the wordmark | Transparent cut-out, ≥ 1800px tall, B&W or colour (rendered mono) |
| `iris` | Hero flower | Transparent cut-out |
| `eye` | Hero, on torn lavender paper | Photo crop (landscape) |
| `moon` | Hero, on torn ivory paper | Photo |
| `rock` | Hero, right edge | Transparent cut-out |
| `manifesto-flower`, `manifesto-petal`, `manifesto-horizon` | Section 01 collage | Photos |
| `headphones`, `music-rock` | Listen section | Transparent cut-outs |
| `about-bust`, `about-sky` | About section | Photo (bust), photo (sky/clouds) |
| `contact-rock` | Get in touch | Transparent cut-out |

Composite slots `manifesto-collage`, `music-collage`, `about-collage`, `about-moon` replace a whole section collage with one layer.

**Current images are cut from the reference mockup** (`node scripts/extract-reference.mjs <mockup>`), upscaled 2× from a 977px-wide source — they are stand-ins. Replace each with a high-resolution original of the same name to get crisp results. World-card bands and archive thumbnails live in `public/images/works/` and are referenced from the content files.

Hero layout lives in `src/content/hero.ts`: cut-out vs print placement for desktop/mobile, mono toggle, bottom fade, pointer parallax depth, scroll rise, mirroring, and `frontLetters` (which PSYIXEL letters sit *in front of* the portrait).

### Audio

Only audio you made or are licensed to share. Drop files in `public/audio/` and add them to `tracks` in `music.ts`.
The two current files are **synthesized test tones** (`npm run audio:placeholder`) so the player can be tried — replace them.
Playlists link out (`url`) and can embed (`embedUrl`, e.g. a Spotify embed URL). Nothing ever autoplays.

### Contact form

`src/app/api/contact/route.ts` sends mail through [Resend](https://resend.com) (free tier). Copy `.env.example` to `.env.local` and set `RESEND_API_KEY` + `CONTACT_TO_EMAIL`. Without them the form tells visitors it isn't connected yet — it never fakes success. Set `email` in `site.ts` to also show a direct address.

## Motion system

Server components opt into motion with data attributes (handled by `src/components/motion/ScrollEffects.tsx`):

- `data-split="scroll"` — staggered character entrance (use `<SplitText>`)
- `data-reveal="up | clip | fade | scale | left"` (+ `data-delay`)
- `data-speed="0.3"` — scroll parallax · `data-spin="30"` — scroll rotation · `data-draw` — SVG line draw
- `data-magnetic` — pointer attraction · `data-cursor="View"` — cursor label

Page transitions: `TLink` (`src/components/motion/TLink.tsx`). `prefers-reduced-motion` disables Lenis, the cursor, transitions and reveals.
