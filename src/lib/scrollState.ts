/**
 * Shared scroll state, mutated in place.
 *
 * The 3D scene reads this every frame inside `useFrame`. Keeping it out of
 * React state is deliberate: a scroll-driven scene updates ~60x/second, and
 * routing that through `useState` would re-render the whole tree each frame.
 */

export const scrollState = {
  /** 0 → 1 across the full document height. */
  progress: 0,
  /** Raw scrollY in pixels. */
  y: 0,
  /** Pixels moved since the last event — drives motion-reactive effects. */
  velocity: 0,
  /** Smoothed pointer position, -1 → 1 on each axis. */
  pointerX: 0,
  pointerY: 0,
};

let started = false;

/** Idempotent: safe to call from more than one component. */
export function startScrollTracking() {
  if (started || typeof window === "undefined") return () => {};
  started = true;

  let last = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    const max = Math.max(
      1,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    scrollState.y = y;
    scrollState.progress = Math.min(1, Math.max(0, y / max));
    scrollState.velocity = y - last;
    last = y;
  };

  const onPointer = (e: PointerEvent) => {
    scrollState.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
    scrollState.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("pointermove", onPointer, { passive: true });
  onScroll();

  return () => {
    started = false;
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.removeEventListener("pointermove", onPointer);
  };
}
