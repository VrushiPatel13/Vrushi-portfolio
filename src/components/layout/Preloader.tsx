"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useBoot } from "@/components/providers/BootProvider";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { profile } from "@/lib/data";

const DURATION = 1700;

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
      }, 850);
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

  return (
    <AnimatePresence>
      {!booted && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[10000] flex flex-col justify-between bg-paper px-6 py-6 sm:px-10 sm:py-10"
          initial={{ opacity: 1 }}
          animate={exiting ? { y: "-100%" } : { y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
          role="status"
          aria-live="polite"
          aria-label={`Loading, ${progress} percent`}
        >
          {/* Head */}
          <div className="flex items-start justify-between border-t border-rule pt-4">
            <span className="label label-accent">{profile.edition}</span>
            <span className="label hidden sm:block">{profile.locationLine}</span>
          </div>

          {/* Name */}
          <div className="flex flex-1 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(2.6rem,10vw,7rem)] font-black leading-[0.88] tracking-[-0.035em] text-ink-hi"
              >
                {profile.first}
                <br />
                {profile.last}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.25 }}
                className="label mt-5"
              >
                {profile.role}
              </motion.p>
            </div>
          </div>

          {/* Press rule */}
          <div>
            <div className="mb-3 flex items-baseline justify-between">
              <span className="label">Setting type</span>
              <span className="font-mono text-sm tabular-nums text-ink-hi">
                {String(progress).padStart(3, "0")}
                <span className="text-ink-mute">/100</span>
              </span>
            </div>
            <div className="relative h-px w-full bg-rule">
              <motion.span
                className="absolute inset-y-0 left-0 bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
