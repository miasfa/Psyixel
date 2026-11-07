/**
 * Experiments: standalone projects by Psyixel that live outside the five worlds.
 *
 * The Human Archive runs as its own site. Its address is not final: set
 * NEXT_PUBLIC_HUMAN_ARCHIVE_URL (e.g. https://archive.psyixel.com once that domain is
 * attached); until then it points at the current deployment.
 */
export const humanArchive = {
  kicker: "A Psyixel experiment",
  title: "The Human Archive",
  line: "An anonymous museum of human experience. Every memory becomes a light in the sky.",
  note: "No name, no account. Read what others carried, or leave something of your own.",
  cta: "Enter the sky",
  href: process.env.NEXT_PUBLIC_HUMAN_ARCHIVE_URL || "https://human-archive.vercel.app",
};
