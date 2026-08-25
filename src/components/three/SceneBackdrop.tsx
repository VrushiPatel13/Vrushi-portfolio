"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { useBoot } from "@/components/providers/BootProvider";
import { startScrollTracking } from "@/lib/scrollState";

const ArcadeScene = dynamic(() => import("@/components/three/ArcadeScene"), {
  ssr: false,
  loading: () => null,
});

/**
 * Holds the scroll-driven 3D world behind the entire page.
 *
 * WebGL only spins up once the boot sequence is done and the visitor hasn't
 * asked for reduced motion — otherwise a static neon gradient stands in, so
 * the page still reads as an arcade cabinet without a single animated frame.
 */
export function SceneBackdrop() {
  const { booted } = useBoot();
  const reduced = useReducedMotion();
  const [live, setLive] = useState(false);

  useEffect(() => startScrollTracking(), []);

  useEffect(() => {
    if (booted && !reduced) setLive(true);
  }, [booted, reduced]);

  return (
    <div
      aria-hidden
      className="scanlines vignette pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-void"
    >
      {live ? (
        <ArcadeScene />
      ) : (
        <>
          {/* Static stand-in: horizon glow plus a perspective grid, drawn in
              CSS so reduced-motion visitors still get the cabinet. */}
          <div className="absolute inset-x-0 top-1/2 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_100%,var(--color-magenta),transparent_70%)] opacity-25 blur-2xl" />
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(to right, var(--color-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--color-grid) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "linear-gradient(to bottom, transparent, #000 60%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 60%)",
            }}
          />
        </>
      )}
    </div>
  );
}
