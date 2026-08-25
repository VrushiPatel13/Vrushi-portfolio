"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { levels, profile } from "@/lib/data";
import { scrollToSection, lockScroll, unlockScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/**
 * The cabinet HUD: a running head with a power bar, a right-hand level select
 * rail on wide screens, and a full-screen level menu on everything else.
 */
export function Hud() {
  const [active, setActive] = useState<string>("hero");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  useEffect(() => {
    const ids = ["hero", ...levels.map((l) => l.id)];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) lockScroll();
    else unlockScroll();
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToSection(id), 60);
  };

  const activeLevel = levels.find((l) => l.id === active);

  return (
    <>
      {/* ------------------------- Running head ------------------------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[500] transition-colors duration-500",
          scrolled
            ? "border-b border-violet/30 bg-void/85 backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <div className="shell flex items-center justify-between gap-4 py-3">
          <button
            onClick={() => go("hero")}
            className="group flex items-center gap-3"
            aria-label="Back to top"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-cyan bg-cyan/10 font-display text-[10px] font-black text-cyan transition-colors duration-300 group-hover:bg-cyan group-hover:text-void">
              {profile.initials}
            </span>
            <span className="hidden font-display text-sm font-bold tracking-wide text-ink-hi sm:block">
              {profile.name}
            </span>
          </button>

          {/* Current level readout — the arcade score panel */}
          <div className="flex items-center gap-3">
            <span className="pixel hidden sm:block">
              Lv
              <span className="pixel-cyan ml-1.5">
                {activeLevel ? activeLevel.num : "00"}
              </span>
            </span>
            <span className="hud hidden text-ink-dim md:block">
              {activeLevel ? activeLevel.tag : "Start"}
            </span>

            <a
              href={profile.resume}
              download
              className="hud hidden transition-colors duration-300 hover:text-cyan lg:block"
            >
              Résumé
            </a>

            <button
              onClick={() => setOpen(true)}
              className="hud flex items-center gap-2 transition-colors duration-300 hover:text-cyan"
              aria-expanded={open}
            >
              Levels
              <span className="flex flex-col gap-[3px]">
                <span className="block h-[2px] w-4 bg-current" />
                <span className="block h-[2px] w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Power bar */}
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="h-[3px] origin-left bg-gradient-to-r from-cyan via-violet to-magenta"
        />
      </header>

      {/* --------------------------- Level rail --------------------------- */}
      <nav
        aria-label="Level navigation"
        className="fixed right-[max(0.9rem,2.2vw)] top-1/2 z-[400] hidden -translate-y-1/2 xl:block"
      >
        <ul className="space-y-3.5">
          {levels.map((l) => {
            const isActive = active === l.id;
            return (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center justify-end gap-3"
                >
                  <span
                    className={cn(
                      "hud transition-all duration-300",
                      isActive
                        ? "text-cyan opacity-100"
                        : "text-ink-faint opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {l.tag}
                  </span>
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center border font-display text-[10px] font-bold tabular-nums transition-all duration-300",
                      isActive
                        ? "border-cyan bg-cyan/15 text-cyan shadow-[0_0_16px_-4px_var(--color-cyan)]"
                        : "border-violet/40 text-ink-faint group-hover:border-cyan/60 group-hover:text-ink-dim",
                    )}
                  >
                    {l.num}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* -------------------------- Level select -------------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="scanlines fixed inset-0 z-[600] overflow-hidden bg-void/97 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(to right, var(--color-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--color-grid) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            <div className="relative flex h-full flex-col">
              <div className="shell flex items-center justify-between border-b border-violet/30 py-3">
                <span className="pixel pixel-cyan">Select Level</span>
                <button
                  onClick={() => setOpen(false)}
                  className="hud transition-colors duration-300 hover:text-magenta"
                >
                  Close
                </button>
              </div>

              <div className="shell flex flex-1 flex-col justify-center overflow-y-auto py-8">
                <ul>
                  {levels.map((l, i) => (
                    <motion.li
                      key={l.id}
                      initial={{ opacity: 0, x: -18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 * i + 0.06,
                        duration: 0.45,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b border-violet/20"
                    >
                      <button
                        onClick={() => go(l.id)}
                        className="group flex w-full items-center gap-4 py-3.5 text-left sm:gap-6 sm:py-4"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-violet/50 font-display text-[11px] font-bold tabular-nums text-ink-faint transition-colors duration-300 group-hover:border-cyan group-hover:text-cyan">
                          {l.num}
                        </span>
                        <span
                          className="glitch font-display text-[clamp(1.25rem,5vw,2.4rem)] font-black uppercase tracking-tight text-ink-hi transition-colors duration-300 group-hover:text-cyan"
                          data-text={l.tag}
                        >
                          {l.tag}
                        </span>
                        <span className="mx-2 hidden h-px flex-1 bg-violet/30 sm:block" />
                        <span className="hud hidden shrink-0 sm:block">{l.label}</span>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a href={profile.resume} download className="btn btn-primary">
                    Download résumé
                  </a>
                  <a href={`mailto:${profile.email}`} className="btn">
                    {profile.email}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
