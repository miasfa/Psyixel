/**
 * Experiments: standalone projects by Psyixel that live outside the five worlds.
 *
 * The Human Archive runs as its own site at archive.psyixel.com. Set
 * NEXT_PUBLIC_HUMAN_ARCHIVE_URL to point elsewhere (e.g. a preview); by default it is the
 * archive's own subdomain.
 */
export const humanArchive = {
  kicker: "A Psyixel experiment",
  title: "The Human Archive",
  line: "An anonymous museum of human experience. Every memory becomes a light in the sky.",
  note: "No name, no account. Read what others carried, or leave something of your own.",
  cta: "Enter the sky",
  href: process.env.NEXT_PUBLIC_HUMAN_ARCHIVE_URL || "https://archive.psyixel.com",
};
