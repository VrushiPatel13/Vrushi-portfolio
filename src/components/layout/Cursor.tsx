"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor]';

/**
 * A single hairline ring with a small centre dot — deliberately quiet, so it
 * reads as a print registration mark rather than a game reticle.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 420, damping: 34, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 420, damping: 34, mass: 0.4 });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ok = fine.matches && !reduced.matches;
    setEnabled(ok);
    if (!ok) return;

    document.documentElement.dataset.cursor = "custom";

    let nextX = 0;
    let nextY = 0;

    const flush = () => {
      dotX.set(nextX);
      dotY.set(nextY);
      rafRef.current = null;
    };

    const onMove = (e: PointerEvent) => {
      nextX = e.clientX;
      nextY = e.clientY;
      setVisible(true);
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(flush);
    };

    const onOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.(INTERACTIVE) as HTMLElement | null;
      setHovering(Boolean(target));
      setLabel(target?.dataset?.cursor || null);
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      delete document.documentElement.dataset.cursor;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-accent"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: label ? 74 : hovering ? 40 : 26,
          height: label ? 74 : hovering ? 40 : 26,
          opacity: visible ? (hovering || label ? 1 : 0.55) : 0,
          backgroundColor: label ? "rgba(233,166,60,0.10)" : "rgba(233,166,60,0)",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 36, mass: 0.5 }}
      >
        {label ? (
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
            {label}
          </span>
        ) : null}
      </motion.div>

      <motion.div
        className="absolute left-0 top-0 h-[3px] w-[3px] rounded-full bg-accent"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
