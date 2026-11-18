"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";

/**
 * One place for the site's scroll choreography, driven by data attributes
 * so sections can stay server-rendered:
 *   data-split          headline lines rise out of a mask
 *   data-reveal         fade + rise on enter (value = delay in s)
 *   data-stagger        children reveal one after another
 *   data-parallax="n"   drifts against the scroll (n ≈ 0.1–0.4)
 *   data-mask           image opens out of a circle — the "O" of OHAS
 *   data-scale-in       image settles from a slight zoom
 * Everything is skipped for prefers-reduced-motion.
 */
export function MotionDirector() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "split-line",
          autoSplit: true,
          onSplit(self) {
            return gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.15,
              ease: "expo.out",
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
            });
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          duration: 1.1,
          delay: parseFloat(el.dataset.reveal || "0") || 0,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-stagger]").forEach((el) => {
        gsap.from(el.children, {
          y: 28,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const s = parseFloat(el.dataset.parallax || "0.2");
        gsap.fromTo(
          el,
          { yPercent: -s * 40 },
          {
            yPercent: s * 40,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((el) => {
        gsap.fromTo(
          el,
          { clipPath: "circle(18% at 50% 55%)" },
          {
            clipPath: "circle(75% at 50% 50%)",
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 30%", scrub: 0.8 },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-scale-in]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.18 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  });

  return null;
}
