"use client";

import { profile, socials, sections } from "@/lib/data";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { scrollToSection } from "@/lib/scroll";

export function Colophon() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-rule">
      {/* Wordmark rule */}
      <div aria-hidden className="edge-fade-x overflow-hidden border-b border-rule py-6">
        <div className="flex w-max animate-[marquee_70s_linear_infinite] gap-12 will-change-transform">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:1px_var(--color-rule-2)]"
            >
              {profile.first} {profile.last} —
            </span>
          ))}
        </div>
      </div>

      <div className="shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="label label-accent">Colophon</p>
            <p className="mt-4 max-w-sm font-serif text-[0.95rem] leading-relaxed text-ink-dim">
              Set in Fraunces, Newsreader and IBM Plex Mono. Built with Next.js,
              Three.js and Framer Motion. Written and maintained in {profile.location}.
            </p>
            <p className="label mt-5">{profile.timezone}</p>
          </div>

          <nav aria-label="Footer">
            <p className="label">Contents</p>
            <ul className="mt-4 space-y-2">
              {sections.map((s) => (
                <li key={s.id} className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] tabular-nums text-ink-mute">
                    {s.num}
                  </span>
                  <button
                    onClick={() => scrollToSection(s.id)}
                    className="rule-link font-serif text-sm text-ink-dim"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="label">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="rule-link font-serif text-sm text-ink-dim"
                >
                  {profile.email}
                </a>
              </li>
              {socials.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <SocialIcon
                    name={s.icon}
                    className="h-3.5 w-3.5 shrink-0 text-ink-mute"
                  />
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="rule-link font-serif text-sm text-ink-dim"
                  >
                    {s.handle}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={profile.resume}
                  download
                  className="rule-link font-serif text-sm text-ink-dim"
                >
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-rule pt-5 sm:flex-row sm:items-center">
          <p className="label">
            © {year} {profile.name}
          </p>
          <p className="label flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            {profile.availability}
          </p>
          <p className="label">{profile.edition}</p>
        </div>
      </div>
    </footer>
  );
}
