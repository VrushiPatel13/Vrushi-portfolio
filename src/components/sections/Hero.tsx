"use client";

import { motion, useReducedMotion } from "framer-motion";
import { profile, levels } from "@/lib/data";
import { useBoot } from "@/components/providers/BootProvider";
import { scrollToSection } from "@/lib/scroll";

export function Hero() {
  const { booted } = useBoot();
  const reduced = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-between pb-10 pt-24 sm:pb-14"
    >
      {/* Cabinet frame */}
      <div className="pointer-events-none absolute inset-4 hidden lg:block">
        {(
          [
            "left-0 top-0 border-l-2 border-t-2",
            "right-0 top-0 border-r-2 border-t-2",
            "bottom-0 left-0 border-b-2 border-l-2",
            "bottom-0 right-0 border-b-2 border-r-2",
          ] as const
        ).map((cls) => (
          <span key={cls} className={`absolute h-12 w-12 border-cyan/40 ${cls}`} />
        ))}
      </div>

      {/* Top rail */}
      <motion.div
        {...rise(0.05)}
        className="shell relative flex items-center justify-between gap-4"
      >
        <span className="pixel pixel-cyan">1UP</span>
        <span className="hud hidden md:block">{profile.role}</span>
        <span className="pixel">{profile.location}</span>
      </motion.div>

      {/* Title */}
      <div className="shell relative flex-1 py-12">
        <motion.p {...rise(0.1)} className="pixel pixel-magenta mb-6">
          ▸ Portfolio · 2026
        </motion.p>

        <h1 className="font-display font-black uppercase leading-[0.86] tracking-[-0.02em]">
          <span className="block overflow-hidden">
            <motion.span
              {...rise(0.16)}
              className="neon-cyan block text-[clamp(2.8rem,12vw,9rem)]"
            >
              {profile.first}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              {...rise(0.24)}
              className="neon-magenta block text-[clamp(2.8rem,12vw,9rem)]"
            >
              {profile.last}
            </motion.span>
          </span>
        </h1>

        <motion.div
          {...rise(0.34)}
          className="mt-8 max-w-xl border-l-2 border-lime pl-5"
        >
          <p className="text-[1.05rem] leading-snug text-ink sm:text-[1.25rem]">
            {profile.positioning}
          </p>
        </motion.div>

        <motion.div {...rise(0.44)} className="mt-9 flex flex-wrap items-center gap-3">
          <button
            onClick={() => scrollToSection("work")}
            className="btn btn-primary"
            data-cursor="go"
          >
            Press Start
          </button>
          <a href={profile.resume} download className="btn">
            Résumé
          </a>
          <a href={`mailto:${profile.email}`} className="btn">
            Contact
          </a>
        </motion.div>

        <motion.p {...rise(0.54)} className="pixel mt-7 flex items-center gap-2">
          <span className="h-2 w-2 bg-live" />
          {profile.availability}
        </motion.p>
      </div>

      {/* Level select strip */}
      <motion.div {...rise(0.64)} className="shell relative">
        <div className="flex items-center gap-3 border-t border-violet/30 pt-4">
          <span className="pixel pixel-lime shrink-0">Levels</span>
          <ul className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2">
            {levels.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollToSection(l.id)}
                  className="group flex items-baseline gap-1.5"
                >
                  <span className="font-display text-[10px] font-bold tabular-nums text-ink-faint transition-colors duration-300 group-hover:text-magenta">
                    {l.num}
                  </span>
                  <span className="text-sm text-ink-dim transition-colors duration-300 group-hover:text-cyan">
                    {l.tag}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => scrollToSection("about")}
            className="hud hidden shrink-0 items-center gap-2 transition-colors duration-300 hover:text-cyan sm:flex"
            aria-label="Scroll to first level"
          >
            Scroll
            <motion.span
              className="block h-3 w-px bg-cyan"
              animate={reduced ? {} : { scaleY: [1, 0.3, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
