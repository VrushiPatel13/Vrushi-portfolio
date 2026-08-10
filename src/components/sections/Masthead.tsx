"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { profile, sections } from "@/lib/data";
import { useBoot } from "@/components/providers/BootProvider";
import { scrollToSection } from "@/lib/scroll";

const MastheadCanvas = dynamic(() => import("@/components/three/MastheadCanvas"), {
  ssr: false,
  loading: () => null,
});

export function Masthead() {
  const { booted } = useBoot();
  const reduced = useReducedMotion();
  const [canRender3D, setCanRender3D] = useState(false);

  useEffect(() => {
    if (booted && !reduced) setCanRender3D(true);
  }, [booted, reduced]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: booted ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      id="masthead"
      className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden pb-10 pt-24 sm:pb-14"
    >
      {/* Ornament */}
      <div className="pointer-events-none absolute inset-y-0 right-[-18%] w-[86%] opacity-70 sm:right-[-8%] sm:w-[62%] lg:right-0 lg:w-[48%]">
        {canRender3D ? (
          <MastheadCanvas />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="block h-64 w-64 rounded-full border border-rule-2" />
          </div>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--color-paper)_18%,transparent_75%)]" />

      {/* Folio line */}
      <motion.div
        {...rise(0.05)}
        className="shell relative flex items-baseline justify-between gap-4 border-t border-rule pt-4"
      >
        <span className="label label-accent">{profile.edition}</span>
        <span className="label hidden md:block">{profile.role}</span>
        <span className="label">{profile.locationLine}</span>
      </motion.div>

      {/* Name */}
      <div className="shell relative flex-1 py-10">
        <h1 className="font-display text-[clamp(3.2rem,13.5vw,11rem)] font-black leading-[0.84] tracking-[-0.04em] text-ink-hi">
          <span className="block overflow-hidden">
            <motion.span {...rise(0.12)} className="block">
              {profile.first}
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span {...rise(0.2)} className="block italic text-accent">
              {profile.last}
            </motion.span>
          </span>
        </h1>

        <motion.div {...rise(0.3)} className="mt-8 max-w-lg border-t border-rule pt-5">
          <p className="font-serif text-[1.15rem] leading-snug text-ink sm:text-[1.35rem]">
            {profile.positioning}
          </p>
        </motion.div>

        <motion.div {...rise(0.4)} className="mt-9 flex flex-wrap items-center gap-3">
          <button
            onClick={() => scrollToSection("work")}
            className="btn btn-solid"
            data-cursor="read"
          >
            Selected work
          </button>
          <a href={profile.resume} download className="btn">
            Résumé
          </a>
          <a href={`mailto:${profile.email}`} className="btn">
            Get in touch
          </a>
        </motion.div>
      </div>

      {/* Contents strip */}
      <motion.div {...rise(0.55)} className="shell relative">
        <div className="flex items-center gap-3 border-t border-rule pt-4">
          <span className="label label-accent shrink-0">Inside</span>
          <ul className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1.5">
            {sections.map((s) => (
              <li key={s.id} className="flex items-baseline gap-1.5">
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
          <span className="label hidden shrink-0 items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-live" />
            {profile.availability}
          </span>
        </div>
      </motion.div>
    </section>
  );
}
