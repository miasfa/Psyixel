import type { Block, Writing } from "./types";

/**
 * Writing. Each entry's body is a list of blocks: p (paragraph), h (heading),
 * quote, verse (line breaks kept). For poems, `stanzas()` turns a poem written
 * with blank lines between stanzas into verse blocks.
 *
 * Titles marked "working title" were taken from the piece's own words; rename freely.
 */
const stanzas = (poem: string): Block[] =>
  poem
    .trim()
    .split(/\n\s*\n/)
    .map((s) => ({ type: "verse" as const, text: s.split("\n").map((l) => l.trim()).join("\n") }));

export const writings: Writing[] = [
  {
    slug: "if-you-walk-alone-tonight",
    title: "If You Walk Alone Tonight", // working title
    kind: "Poem",
    date: "2026-05-10",
    excerpt: "Some distances are strange: they exist, yet something in us keeps crossing them anyway.",
    body: stanzas(`
      If you walk alone tonight,
      the stars will still choose your side,
      quietly keeping peace with you
      the way certain things stay,
      even when no one asks them to.

      The sea breeze will find your heart
      and say what words sometimes cannot,
      filling the silence softly,
      as if even the night knows
      how to sit beside someone gently.

      And if you ever look
      for a little warmth in the dark,
      I would step into the night without hesitation,
      searching for one clear light
      to guide me where you are.

      Some distances are strange
      they exist,
      yet something in us keeps crossing them anyway.

      So if the night feels too wide,
      remember that even far away,
      there is always a light
      trying to find its way back to you.
    `),
  },
  {
    slug: "agents-of-liberation",
    title: "Agents of Liberation", // working title
    kind: "Reflection",
    date: "2026-04-29",
    excerpt: "It is not the flames that consume you, but the part of your soul that clings to the fleeting shadows of life.",
    body: [
      {
        type: "p",
        text: "In the realm of Hell, it is not the flames that consume you, but rather the part of your soul that clings to the fleeting shadows of life your memories and attachments. These flames are not instruments of punishment but agents of liberation, set to free your spirit. Should you fear the end and grasp desperately at the strands of existence, you will perceive demons tearing away at your life. Yet, if you embrace the peace of release, those very demons will reveal themselves as angels, guiding you away from earthly bonds. It is but a matter of how you perceive this transformation. So, find solace in this truth, and be at ease.",
      },
    ],
  },
  {
    slug: "a-lantern-in-the-valley",
    title: "A Lantern in the Valley", // working title
    kind: "Poem",
    date: "2026-04-01",
    excerpt: "Vengeance is only the echo of a wound that has not yet learned how to heal.",
    body: stanzas(`
      The path you walk is not yours alone.
      It is carved by shadows,
      by the hunger of men who have forgotten their own light.

      Do not rush to name them evil.
      For what you condemn in them
      may still whisper inside you.

      Blessed is the one
      who does not raise his hand too quickly,
      but instead becomes a lantern
      in the valley where others are lost.

      To guide even one soul through darkness
      is to remember your own way home.

      You speak of vengeance
      as if it were justice
      but vengeance is only the echo of a wound
      that has not yet learned how to heal.

      The fire you carry
      can destroy,
      or it can warm.

      And on the day you understand the difference,
      you will no longer ask
      who deserves your anger

      but who needs your mercy.

      For the name you seek to defend
      is not written in fear,
      nor proven through power.

      It is revealed
      in the moment you choose
      not to become what you fight.
    `),
  },
  {
    slug: "give-me-a-coordinate",
    title: "Give Me a Coordinate", // working title
    kind: "Poem",
    date: "2026-01-26",
    excerpt: "Not truth. Not meaning. Just position.",
    body: stanzas(`
      I was not broken
      I was finished
      before the blessing arrived.

      They crowned the aftermath
      and called it mercy.
      They handed me light
      once my eyes had learned
      another alphabet.

      Tell me
      do you breathe life into form
      so it can look back at you,
      or do you hide in the echo
      so we call it a voice?

      Every time I speak
      you lean closer,
      as if language were a rope
      and I were falling
      the right way.

      I am not lost.
      Loss implies a map.
      I am what remains
      when direction gives up.

      I pass through hands
      without being held.
      Through prayers
      without being answered.
      I am not the question
      or the wound
      I am the space
      they keep circling.

      Give me a coordinate.
      One mark in the dark.
      Not truth. Not meaning.
      Just position.

      Let me stand somewhere
      long enough
      to miss you from there
      so longing stops pretending.
    `),
  },
  {
    slug: "midnight-rendezvous",
    title: "Midnight Rendezvous", // working title
    kind: "Reflection",
    date: "2024-03-03",
    excerpt: "It’s not the exhaustion I’ll remember, but the profound reminder of why I chose this path.",
    body: [
      { type: "p", text: "Last night, during my first-ever 26-hour shift in the ER, I stepped into a world that tested my limits and expanded my heart in ways I hadn’t imagined. As the hours stretched on, I found myself in a moment that felt like it was pulled straight from a story, not just another page in my intern’s journey." },
      { type: "p", text: "It was just after my rotation in internal medicine ended on February 29, a date that already felt like a bridge between chapters. Then, in the midst of the ER’s chaos, a familiar face from my past rotation appeared before me, a patient in need of a comforting presence on his way to a CT scan. In that moment, there was no question. I was going to be there with him, I didn’t hesitate. It felt right to be there for someone who found a semblance of familiarity in my presence, especially in such an unsettling environment." },
      { type: "p", text: "As we made our way to the CT room at 2:30 AM, the hospital enveloped in a rare silence, the quiet hum of the hospital at night surrounded us. There, in that waiting room, a poignant realization dawned on me: each patient waiting for their scan was someone I had met earlier that day, someone I had helped admit into the ER, and in some cases, whose imaging I had personally requested." },
      { type: "p", text: "Each with their own story, their own fears, and now, their own wait. What struck me was not just the coincidence but the connection. These weren’t just patients; they were people I had laughed with, comforted, and reassured, all gathered in this unexpected midnight rendezvous." },
      { type: "p", text: "This realization wasn’t loud or dramatic; it was a quiet acknowledgment of the threads that tie us together in the most human of ways. In the silence of that waiting room, I saw the impact of our interactions, the comfort of a familiar face, and the shared humanity that binds us, especially in the most vulnerable of times." },
      { type: "p", text: "Reflecting on that night, it’s not the exhaustion I’ll remember, but the profound reminder of why I chose this path. It’s these moments of human connection, of being there for someone when they need it most, that truly define the essence of care in medicine." },
    ],
  },
];
