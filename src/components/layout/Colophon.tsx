"use client";

import { profile, socials, levels } from "@/lib/data";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { scrollToSection } from "@/lib/scroll";

export function Colophon() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-violet/30">
      {/* Attract-mode wordmark */}
      <div
        aria-hidden
        className="edge-fade-x overflow-hidden border-b border-violet/20 py-6"
      >
        <div className="flex w-max animate-[marquee_44s_linear_infinite] gap-10 will-change-transform">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="font-display text-[clamp(2.2rem,6.5vw,4.5rem)] font-black uppercase leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_var(--color-violet)]"
            >
              {profile.first} {profile.last} ★
            </span>
          ))}
        </div>
      </div>

      <div className="shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <p className="pixel pixel-cyan">Game Over</p>
            <p className="mt-4 max-w-sm text-[0.925rem] leading-relaxed text-ink-dim">
              Set in Orbitron, Space Grotesk and Press Start 2P. Built with Next.js,
              Three.js and Framer Motion. Written in {profile.location}.
            </p>
            <p className="pixel mt-5">{profile.timezone}</p>
          </div>

          <nav aria-label="Footer">
            <p className="pixel pixel-magenta">Levels</p>
            <ul className="mt-4 space-y-2">
              {levels.map((l) => (
                <li key={l.id} className="flex items-baseline gap-3">
                  <span className="font-display text-[10px] font-bold tabular-nums text-ink-faint">
                    {l.num}
                  </span>
                  <button
                    onClick={() => scrollToSection(l.id)}
                    className="text-sm text-ink-dim transition-colors duration-300 hover:text-cyan"
                  >
                    {l.tag}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="pixel pixel-lime">Contact</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-sm text-ink-dim transition-colors duration-300 hover:text-cyan"
                >
                  {profile.email}
                </a>
              </li>
              {socials.map((s) => (
                <li key={s.label} className="flex items-center gap-2.5">
                  <SocialIcon
                    name={s.icon}
                    className="h-3.5 w-3.5 shrink-0 text-ink-faint"
                  />
                  <a
                    href={s.href}
                    target={s.href.startsWith("http") ? "_blank" : undefined}
                    rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                    className="text-sm text-ink-dim transition-colors duration-300 hover:text-cyan"
                  >
                    {s.handle}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={profile.resume}
                  download
                  className="text-sm text-ink-dim transition-colors duration-300 hover:text-cyan"
                >
                  Résumé (PDF)
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-violet/20 pt-5 sm:flex-row sm:items-center">
          <p className="pixel">
            © {year} {profile.name}
          </p>
          <p className="pixel pixel-lime flex items-center gap-2">
            <span className="h-2 w-2 bg-live" />
            {profile.availability}
          </p>
          <button
            onClick={() => scrollToSection("hero")}
            className="pixel pixel-cyan transition-opacity duration-300 hover:opacity-70"
          >
            ▲ Restart
          </button>
        </div>
      </div>
    </footer>
  );
}
