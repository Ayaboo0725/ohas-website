"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/** Scroll to an in-page anchor ("#menu") with smooth scrolling when allowed. */
export function scrollToHash(hash: string) {
  const target: HTMLElement | null = hash === "#top" ? null : document.querySelector(hash);
  if (hash !== "#top" && !target) return false;
  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(target ?? 0, { duration: 1.4 });
  } else if (target) {
    target.scrollIntoView({ block: "start" });
  } else {
    window.scrollTo({ top: 0 });
  }
  if (target) {
    // Move keyboard focus to the section for screen-reader and keyboard users
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }
  return true;
}

/**
 * Smooth scrolling (Lenis) wired into GSAP's ticker, plus smooth in-page
 * anchor navigation. Disabled entirely for reduced-motion users.
 */
export function SmoothScroll() {
  useEffect(() => {
    let tick: ((time: number) => void) | null = null;

    if (!prefersReducedMotion()) {
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisInstance = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!a) return;
      const hash = a.getAttribute("href") ?? "";
      if (hash.length < 2) return;
      if (scrollToHash(hash)) {
        e.preventDefault();
        history.replaceState(null, "", hash === "#top" ? window.location.pathname + window.location.search : hash);
      }
    };
    document.addEventListener("click", onClick);

    // Re-measure triggers once web fonts settle
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    // Honour a hash on first load (e.g. shared link to #cakes)
    if (window.location.hash.length > 1) {
      const hash = window.location.hash;
      setTimeout(() => scrollToHash(hash), 300);
    }

    return () => {
      document.removeEventListener("click", onClick);
      if (tick) gsap.ticker.remove(tick);
      lenisInstance?.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}
