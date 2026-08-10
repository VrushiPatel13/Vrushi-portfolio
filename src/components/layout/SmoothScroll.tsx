"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling on a plain rAF loop.
 *
 * This used to run off the GSAP ticker so ScrollTrigger and Lenis wouldn't
 * fight over the frame. Nothing on the page uses ScrollTrigger any more —
 * every reveal is Framer Motion's `whileInView` — so the ticker is one loop
 * and GSAP is no longer a dependency.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      lerp: 0.09,
    });

    setLenis(lenis);

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
