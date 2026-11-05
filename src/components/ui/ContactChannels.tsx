import { site } from "@/content";

/** Small line icons for the contact channels (stroke follows currentColor). */
const ICONS: Record<string, React.ReactNode> = {
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
      <path d="M3 6l9 7 9-7" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" />
    </>
  ),
  spotify: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7 9.4c3.6-1 7.4-.7 10.2.9M7.6 12.6c3-.8 6-.5 8.4.8M8.2 15.6c2.4-.6 4.6-.4 6.5.6" strokeLinecap="round" />
    </>
  ),
};

/** Email and profiles, one per row with an icon (from site.email and site.socials). */
export function ContactChannels({ className = "" }: { className?: string }) {
  const rows = [
    ...(site.email ? [{ icon: "mail", label: site.email, href: `mailto:${site.email}`, external: false }] : []),
    ...site.socials.map((s) => ({ icon: s.icon, label: s.handle, href: s.href, external: true })),
  ];
  if (!rows.length) return null;
  return (
    <ul className={`space-y-1 ${className}`} aria-label="Other ways to reach me">
      {rows.map((r) => (
        <li key={r.href}>
          <a
            href={r.href}
            {...(r.external ? { target: "_blank", rel: "noreferrer" } : {})}
            className="group flex items-center gap-4 border-b border-ivory/15 py-3 font-sans text-lg text-ivory/90 transition-colors hover:border-lav hover:text-lav"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true" className="h-6 w-6 shrink-0 text-ivory/80 transition-colors group-hover:text-lav">
              {ICONS[r.icon]}
            </svg>
            <span>{r.label}</span>
            {r.external && <span className="ml-auto text-sm text-dust transition-colors group-hover:text-lav">↗</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
