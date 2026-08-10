import type Lenis from "lenis";

/**
 * Module-level handle on the single Lenis instance so any component can drive
 * scrolling without prop-drilling a context through the whole tree.
 */
let instance: Lenis | null = null;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};

export const getLenis = () => instance;

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -8, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export const lockScroll = () => {
  const lenis = getLenis();
  if (lenis) lenis.stop();
  document.documentElement.style.overflow = "hidden";
};

export const unlockScroll = () => {
  const lenis = getLenis();
  if (lenis) lenis.start();
  document.documentElement.style.overflow = "";
};
