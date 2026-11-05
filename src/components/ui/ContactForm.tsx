"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";

export const TOPICS = [
  { value: "project", label: "A project" },
  { value: "collaboration", label: "A collaboration" },
  { value: "general", label: "A question" },
  { value: "hello", label: "Just saying hello" },
] as const;

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  /** `unsent`: delivery failed or isn't set up — the visitor is offered the email link. */
  | { kind: "error"; message: string; unsent?: boolean };

/**
 * Web3Forms (https://web3forms.com) access key. When set, messages go through
 * Web3Forms, which emails them to the owner; otherwise the form uses /api/contact.
 * The key is public by design (it only allows submitting to that inbox).
 */
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || site.web3formsKey;

const field =
  "w-full border-0 border-b border-[var(--line-strong)] bg-transparent px-0 py-3 font-read text-xl text-ivory placeholder:text-dust focus:border-lav focus:outline-none focus:ring-0";

export function ContactForm({ initialTopic, fallbackEmail }: { initialTopic?: string; fallbackEmail?: string }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const topic = TOPICS.some((t) => t.value === initialTopic) ? initialTopic : "general";
  const formRef = useRef<HTMLFormElement>(null);

  // Other parts of the page can preselect a topic: dispatch `psy:topic` with the value.
  useEffect(() => {
    const onTopic = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      const radio = formRef.current?.querySelector<HTMLInputElement>(`input[name="topic"][value="${value}"]`);
      if (radio) radio.checked = true;
      setStatus((s) => (s.kind === "sent" ? { kind: "idle" } : s));
      // The form may still be hidden by its scroll reveal, so keep trying briefly.
      let tries = 0;
      const focusName = () => {
        const input = formRef.current?.querySelector<HTMLInputElement>('input[name="name"]');
        input?.focus({ preventScroll: true });
        if (input && document.activeElement !== input && ++tries < 8) window.setTimeout(focusName, 250);
      };
      window.setTimeout(focusName, 700);
    };
    window.addEventListener("psy:topic", onTopic);
    return () => window.removeEventListener("psy:topic", onTopic);
  }, []);

  async function sendViaWeb3Forms(form: HTMLFormElement, data: Record<string, FormDataEntryValue>) {
    // Honeypot filled: a bot. Pretend it worked and drop it.
    if (String(data.company ?? "").trim()) {
      setStatus({ kind: "sent" });
      return;
    }
    const topicLabel = TOPICS.find((t) => t.value === data.topic)?.label ?? "A question";
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Psyixel: ${topicLabel} from ${data.name}`,
          from_name: "Psyixel website",
          name: data.name,
          email: data.email,
          topic: topicLabel,
          message: data.message,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (res.ok && json.success) {
        setStatus({ kind: "sent" });
        form.reset();
      } else {
        setStatus({ kind: "error", unsent: true, message: "Your message was not sent. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", unsent: true, message: "Your message was not sent. Please check your connection and try again." });
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus({ kind: "sending" });
    if (WEB3FORMS_KEY) {
      await sendViaWeb3Forms(form, data);
      return;
    }
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (res.ok) {
        setStatus({ kind: "sent" });
        form.reset();
      } else if (json.error === "not_configured") {
        setStatus({ kind: "error", unsent: true, message: "Your message was not sent: the form isn’t connected to an inbox yet." });
      } else if (res.status === 422) {
        setStatus({ kind: "error", message: json.error ?? "Please check the form and try again." });
      } else {
        setStatus({ kind: "error", unsent: true, message: json.error ? `Your message was not sent. ${json.error}` : "Your message was not sent. Please try again." });
      }
    } catch {
      setStatus({ kind: "error", unsent: true, message: "Your message was not sent. Please check your connection and try again." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-lav/60 p-8">
        <p className="t-serif text-5xl text-lav">Thanks for writing.</p>
        <p className="mt-3 font-read text-lg text-ivory/80">Your message has been sent.</p>
        <button type="button" onClick={() => setStatus({ kind: "idle" })} className="t-label mt-6 hover:text-lav">
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-8" noValidate={false}>
      <div className="grid gap-8 md:grid-cols-2">
        <label className="block">
          <span className="t-label text-dust">Your name</span>
          <input name="name" required maxLength={120} autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="block">
          <span className="t-label text-dust">Your email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={field} placeholder="you@domain.com" />
        </label>
      </div>
      <fieldset>
        <legend className="t-label text-dust">What’s on your mind?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <label key={t.value} className="cursor-pointer">
              <input type="radio" name="topic" value={t.value} defaultChecked={t.value === topic} className="peer sr-only" />
              <span className="t-label inline-block border border-[var(--line-strong)] px-3 py-2 transition-colors peer-checked:border-lav peer-checked:bg-lav peer-checked:text-ink peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-lav hover:border-lav">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="t-label text-dust">Your message</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={`${field} resize-y`} placeholder="Tell me what you’re thinking about. If it’s a project, any details about timing or scope are helpful." />
      </label>
      {/* Honeypot: hidden from people, tempting for bots */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status.kind === "sending"}
          data-magnetic="0.3"
          className="t-heavy group relative overflow-hidden bg-lav px-8 py-5 text-2xl text-ink transition-colors disabled:opacity-60"
        >
          <span className="relative z-10">{status.kind === "sending" ? "Sending…" : "Send message"}</span>
          <span className="absolute inset-0 origin-left scale-x-0 bg-ivory transition-transform duration-500 ease-[var(--ease-expo)] group-hover:scale-x-100" />
        </button>
        <p role="alert" aria-live="assertive" className="max-w-xl font-read text-lg text-[#e6a493]">
          {status.kind === "error" && (
            <>
              {status.message}
              {status.unsent && fallbackEmail && (
                <>
                  {" "}
                  You can email me at{" "}
                  <a href={`mailto:${fallbackEmail}`} className="text-ivory underline decoration-lav underline-offset-4 hover:text-lav">
                    {fallbackEmail}
                  </a>{" "}
                  instead.
                </>
              )}
            </>
          )}
        </p>
      </div>
    </form>
  );
}
