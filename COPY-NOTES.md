# Copy pass: notes (4 Nov 2026)

The approved copy is implemented across the homepage, all seven pages, the footer and metadata. Nothing was published or deployed.

## Where the approved copy lives
- **Shared copy:** `src/content/site.ts`.
  - Hero introduction, homepage introduction and supporting line.
  - Homepage About text, About opening and story.
  - Footer "Things I…" line, signature, and the site description (also the Home meta description).
- **World cards:** `src/content/worlds.ts`.
  - `caption` holds the homepage card descriptions.
  - `thing` holds the hover lines (Music is now "Music I make.").
  - `attention` (new field) holds the About page descriptions, so the homepage cards keep their shorter lines.
- **Studio:** services and process in `src/content/studio.ts`.
- **Music:** demo and unavailable labels in `src/content/music.ts`.
- **Everything else:** page and component files.
  - Page copy: `src/app/*/page.tsx`.
  - Homepage sections, footer, contact form and links, players: `src/components/home/Sections.tsx`, `src/components/layout/Footer.tsx`, `src/components/ui/Contact*.tsx`, `src/components/music/*`.

## Placement and layout adjustments (font sizes unchanged unless noted)
- **Studio:** the introduction's first paragraph sits in the hero, where the old one-line introduction was. The second paragraph sits beside "What I can help with", replacing the removed "Work for people…" paragraph. Both paragraphs didn't fit the hero without colliding with the paper collage or the focus links.
- **Photography, Art, Words, Music:** each introduction sits at the top of the first content section, under its heading (Photographs & collections, Selected works, Writing, My music). The heroes stay uncrowded.
- **Display statements** break onto lines that fit the existing composition on desktop:
  - Art: 3 lines.
  - Photography: 4 lines.
  - Words, Music, Contact: 2–3 lines.
  - On mobile they wrap naturally, except Words and Contact, which keep their sentence breaks.
- **Photography statement:** moved from 82.8vw to 78.2vw from the left on desktop so the longer lines stay inside the viewport. It remains clear of the PHOTOGRAPHY heading.
- **"Photographs" heading:** set to 11vw on mobile only (other section headings use 15vw), because the single long word didn't fit at 15vw. Desktop is unchanged.
- **Homepage:** the "Archive" line is removed from "Selected Work" because there's no larger archive page to link to. There is no "Explore the archive" link.
- **Footer:** the Elsewhere column is hidden while no social profiles are configured.
- **Contact:** the form heading is set as "Send me / a message" so "a" isn't left alone on a line on desktop.
- **About:** the lavender paper scrap in the story section moved up (18% → 2% from the top) so it no longer sits over the longer first paragraph.

## Remaining placeholder content (still labelled as samples)
- **Words:** all four entries are samples. Their bodies still contain developer instructions, kept as instructed for later editorial work:
  - "Replace this entry in src/content/words.ts…" (The Second Nature, A Quiet Exit, On Attention).
  - Demonstration text about reading columns and headings (A Quiet Exit).
  - "Placeholder. Verse blocks keep every line break…" (Fragments Vol. I).
  - Their demonstration dates are hidden from readers ("Sample" is shown instead) but kept in the data.
- **Art:**
  - All four works are labelled Sample.
  - Statements are now just "Sample statement." The previous ones carried an instruction or implied media (digital, mixed-media, sculpture).
  - The medium field is omitted.
  - The "Collage / Painting / Digital / Sculpture / Experimental" medium chips on /art are removed, because they asserted media not confirmed.
- **Photography:**
  - Three sample collections, with their existing titles, intros ("Sample collection — …") and one-line poems.
  - Captions read "Placeholder caption.".
- **Studio:** two sample project tiles (Red Moon Variations, Paper Studies), still tagged Sample.
- **Music:**
  - Two synthetic test tones, labelled "Demo audio — not a finished release.".
  - "Untitled Sketch" has no audio ("Not available to listen to yet.").
  - Three sample playlists with no link ("Sample playlist." / "Not linked yet").
- **Contact:** the form isn't connected to an inbox (Resend keys unset). It says so honestly and never shows success. No public email is configured, so "You can also email me directly." stays hidden.

## Please confirm
- **Studio headings:** "How we'll work" and the process steps describe the client workflow ("prepare the final files or launch"). Please confirm they match how you actually work.
- **Words list:** the label "4 pieces · essays, reflections, poems" describes the sample set.
- **Art:** the label "4 works" counts the sample works.
- **Photography:** the closing heading "What remains after the moment?" was kept above the new closing paragraph, because it still suits it. Remove it if you'd rather the paragraph stand alone.
- **Art:** the closing heading "Art doesn't have to explain itself." was kept above the new closing line.
- **Studio:** the closing heading "Have something in mind?" was kept, with the new two-line invitation beneath. The same question now opens the homepage contact row and the Contact page.
- **Studio:** the label "Psyixel / creative archive" above Selected projects was left unchanged.
