"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBoot } from "@/components/providers/BootProvider";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { profile } from "@/lib/data";

const DURATION = 2000;

const BOOT_LOG = [
  "MOUNTING RENDER PIPELINE",
  "LOADING NEURAL WEIGHTS",
  "COMPILING SHADERS",
  "BUILDING NEON CORRIDOR",
  "READY PLAYER ONE",
];

const BLOCKS = 20;

export function Preloader() {
  const { booted, setBooted } = useBoot();
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const startedAt = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setProgress(100);
      setBooted(true);
      return;
    }

    lockScroll();
    window.scrollTo(0, 0);

    let frame = 0;
    let exitTimer = 0;
    let finished = false;
    startedAt.current = performance.now();

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      setExiting(true);
      exitTimer = window.setTimeout(() => {
        unlockScroll();
        setBooted(true);
      }, 800);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt.current) / DURATION);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -9 * t);
      setProgress(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else finish();
    };

    frame = requestAnimationFrame(tick);

    // Browsers pause rAF in background tabs. Without this watchdog a visitor
    // opening the site in a background tab would return to a frozen loading
    // screen with scrolling still locked.
    const watchdog = window.setTimeout(finish, DURATION + 800);

    // A fully suspended page stops timers too, so the watchdog alone isn't
    // enough. Re-check the wall clock the moment the tab is looked at again.
    const onVisible = () => {
      if (
        document.visibilityState === "visible" &&
        performance.now() - startedAt.current >= DURATION
      ) {
        finish();
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(watchdog);
      window.clearTimeout(exitTimer);
      document.removeEventListener("visibilitychange", onVisible);
      unlockScroll();
    };
  }, [setBooted]);

  const logIndex = Math.min(
    BOOT_LOG.length - 1,
    Math.floor((progress / 100) * BOOT_LOG.length),
  );
  const litBlocks = Math.round((progress / 100) * BLOCKS);

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          key="preloader"
          className="scanlines vignette fixed inset-0 z-[10000] flex flex-col justify-between overflow-hidden bg-void px-5 py-6 sm:px-10 sm:py-10"
          initial={{ opacity: 1 }}
          animate={exiting ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
          role="status"
          aria-live="polite"
          aria-label={`Loading, ${progress} percent`}
        >
          {/* Cabinet grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--color-grid) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Top rail */}
          <div className="relative flex items-start justify-between">
            <span className="pixel pixel-cyan">Player 1</span>
            <span className="pixel hidden sm:block">{profile.location}</span>
          </div>

          {/* Title */}
          <div className="relative flex flex-1 flex-col items-center justify-center text-center">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="pixel pixel-magenta mb-6 animate-blink"
            >
              Insert Coin
            </motion.p>

            {/* Deliberately not an <h1> — the hero owns the page's only one. */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="animate-flicker font-display text-[clamp(2rem,9vw,6rem)] font-black leading-[0.92] tracking-tight"
            >
              <span className="neon-cyan">{profile.first}</span>
              <br />
              <span className="neon-magenta">{profile.last}</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="hud mt-6"
            >
              {profile.role}
            </motion.p>
          </div>

          {/* Loading blocks */}
          <div className="relative">
            <div className="mb-3 flex items-baseline justify-between">
              <span className="pixel pixel-lime">{BOOT_LOG[logIndex]}</span>
              <span className="font-display text-2xl font-black tabular-nums text-ink-hi sm:text-3xl">
                {String(progress).padStart(3, "0")}
                <span className="ml-1 text-sm text-cyan">%</span>
              </span>
            </div>

            <div className="flex gap-1">
              {Array.from({ length: BLOCKS }).map((_, i) => (
                <span
                  key={i}
                  className="h-3 flex-1 transition-colors duration-150"
                  style={{
                    background:
                      i < litBlocks
                        ? i > BLOCKS - 5
                          ? "var(--color-magenta)"
                          : "var(--color-cyan)"
                        : "color-mix(in oklab, var(--color-violet) 22%, transparent)",
                    boxShadow:
                      i < litBlocks
                        ? "0 0 12px -2px var(--color-cyan)"
                        : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
