import { NextResponse } from "next/server";

/**
 * Contact form endpoint.
 * Delivery uses Resend's HTTP API when RESEND_API_KEY + CONTACT_TO_EMAIL are set
 * (see .env.example). Without them it answers 503 "not_configured" so the UI can
 * tell the visitor honestly instead of pretending the message was sent.
 */

const TOPICS = new Set(["project", "collaboration", "general", "hello"]);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Very small in-memory rate limit (per server instance).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → silently accept.
  if (typeof body.company === "string" && body.company.trim()) return NextResponse.json({ ok: true });

  const name = String(body.name ?? "").trim().slice(0, 120);
  const email = String(body.email ?? "").trim().slice(0, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);
  const topic = TOPICS.has(String(body.topic)) ? String(body.topic) : "general";

  if (!name) return NextResponse.json({ error: "Please add your name." }, { status: 422 });
  if (!EMAIL.test(email)) return NextResponse.json({ error: "Please add a valid email address." }, { status: 422 });
  if (message.length < 10) return NextResponse.json({ error: "Your message is a little short." }, { status: 422 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages — please try again later." }, { status: 429 });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return NextResponse.json({ error: "not_configured" }, { status: 503 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Psyixel <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Psyixel — ${topic} — ${name}`,
      html: `<p><strong>${esc(name)}</strong> &lt;${esc(email)}&gt;</p><p>Topic: ${esc(topic)}</p><p style="white-space:pre-wrap">${esc(message)}</p>`,
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Your message couldn’t be sent. Please try again." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
