"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [data-cursor]';

/**
 * A targeting reticle: four corner brackets that close in on interactive
 * elements, plus a centre pip. Reads as a crosshair rather than a dot.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 400, damping: 32, mass: 0.42 });
  const ry = useSpring(y, { stiffness: 400, damping: 32, mass: 0.42 });

  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const ok = fine.matches && !reduced.matches;
    setEnabled(ok);
    if (!ok) return;

    document.documentElement.dataset.cursor = "custom";

    let nx = 0;
    let ny = 0;

    const flush = () => {
      x.set(nx);
      y.set(ny);
      rafRef.current = null;
    };

    const onMove = (e: PointerEvent) => {
      nx = e.clientX;
      ny = e.clientY;
      setVisible(true);
      if (rafRef.current === null) rafRef.current = requestAnimationFrame(flush);
    };

    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(INTERACTIVE) as HTMLElement | null;
      setHovering(Boolean(t));
      setLabel(t?.dataset?.cursor || null);
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
  }, [x, y]);

  if (!enabled) return null;

  const size = label ? 78 : hovering ? 44 : 26;

  const corners = [
    { cls: "left-0 top-0 border-l-2 border-t-2" },
    { cls: "right-0 top-0 border-r-2 border-t-2" },
    { cls: "bottom-0 left-0 border-b-2 border-l-2" },
    { cls: "bottom-0 right-0 border-b-2 border-r-2" },
  ];

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[9999]">
      {/* Reticle */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? 1 : 0,
          rotate: hovering ? 45 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 34, mass: 0.5 }}
      >
        {corners.map((c) => (
          <span
            key={c.cls}
            className={`absolute h-2 w-2 border-cyan ${c.cls}`}
            style={{ boxShadow: "0 0 8px -1px var(--color-cyan)" }}
          />
        ))}
        {label ? (
          <span
            className="font-display text-[8px] font-bold uppercase tracking-[0.16em] text-cyan"
            style={{ transform: hovering ? "rotate(-45deg)" : undefined }}
          >
            {label}
          </span>
        ) : null}
      </motion.div>

      {/* Centre pip */}
      <motion.div
        className="absolute left-0 top-0 h-[3px] w-[3px] bg-magenta"
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
          boxShadow: "0 0 8px 1px var(--color-magenta)",
        }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
}
