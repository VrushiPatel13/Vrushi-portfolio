"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { sections, profile } from "@/lib/data";
import { scrollToSection, lockScroll, unlockScroll } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export function Contents() {
  const [active, setActive] = useState<string>("masthead");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 60));

  /* Whichever section owns the middle band of the viewport is "active". */
  useEffect(() => {
    const ids = ["masthead", ...sections.map((s) => s.id)];
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

  return (
    <>
      {/* ------------------------- Running head ------------------------- */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[500] transition-colors duration-500",
          scrolled
            ? "border-b border-rule bg-paper/92 backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <div className="shell flex items-center justify-between py-3.5">
          <button
            onClick={() => go("masthead")}
            className="group flex items-baseline gap-3"
            aria-label="Back to top"
          >
            <span className="font-display text-base font-bold tracking-tight text-ink-hi">
              {profile.name}
            </span>
            <span className="label hidden sm:block">{profile.role}</span>
          </button>

          <div className="flex items-center gap-5">
            <a
              href={profile.resume}
              download
              className="label label-ink hidden transition-colors duration-300 hover:text-accent sm:block"
            >
              Résumé
            </a>
            <button
              onClick={() => setOpen(true)}
              className="label flex items-center gap-2.5 transition-colors duration-300 hover:text-accent"
              aria-expanded={open}
            >
              Contents
              <span className="flex flex-col gap-[3px]">
                <span className="block h-px w-4 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
            </button>
          </div>
        </div>

        {/* Progress hairline */}
        <motion.div
          aria-hidden
          style={{ scaleX: scrollYProgress }}
          className="h-px origin-left bg-accent"
        />
      </header>

      {/* --------------------------- Side rail --------------------------- */}
      <nav
        aria-label="Section navigation"
        className="fixed right-[max(1rem,3vw)] top-1/2 z-[400] hidden -translate-y-1/2 xl:block"
      >
        <ul className="space-y-3">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <button
                  onClick={() => go(s.id)}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center justify-end gap-3"
                >
                  <span
                    className={cn(
                      "font-mono text-[10px] tracking-[0.16em] transition-all duration-400",
                      isActive
                        ? "text-accent opacity-100"
                        : "text-ink-mute opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {s.label}
                  </span>
                  <span
                    className={cn(
                      "font-mono text-[10px] tabular-nums transition-colors duration-400",
                      isActive ? "text-accent" : "text-ink-mute group-hover:text-ink-dim",
                    )}
                  >
                    {s.num}
                  </span>
                  <span
                    className={cn(
                      "block h-px transition-all duration-500",
                      isActive ? "w-7 bg-accent" : "w-3 bg-rule-2 group-hover:w-5",
                    )}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ------------------------ Contents overlay ------------------------ */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[600] bg-paper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex h-full flex-col">
              <div className="shell flex items-center justify-between border-b border-rule py-3.5">
                <span className="label label-accent">Contents</span>
                <button
                  onClick={() => setOpen(false)}
                  className="label transition-colors duration-300 hover:text-accent"
                >
                  Close
                </button>
              </div>

              <div className="shell flex flex-1 flex-col justify-center overflow-y-auto py-10">
                <ul>
                  {sections.map((s, i) => (
                    <motion.li
                      key={s.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.05 * i + 0.08,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="border-b border-rule"
                    >
                      <button
                        onClick={() => go(s.id)}
                        className="group flex w-full items-baseline gap-5 py-4 text-left sm:py-5"
                      >
                        <span className="font-mono text-[11px] tabular-nums text-ink-mute">
                          {s.num}
                        </span>
                        <span className="font-display text-[clamp(1.5rem,4.5vw,2.6rem)] font-bold tracking-tight text-ink-hi transition-colors duration-300 group-hover:text-accent">
                          {s.label}
                        </span>
                        <span className="mx-3 hidden h-px flex-1 self-center bg-rule sm:block" />
                        <span className="label hidden shrink-0 sm:block">
                          {s.department}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <a href={profile.resume} download className="btn btn-solid">
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
