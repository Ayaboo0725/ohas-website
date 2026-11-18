"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/** A small "View" badge that follows the pointer over gallery images (fine pointers only). */
export function CursorBadge() {
  const el = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const node = el.current!;
    const xTo = gsap.quickTo(node, "x", { duration: 0.45, ease: "power3" });
    const yTo = gsap.quickTo(node, "y", { duration: 0.45, ease: "power3" });

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest?.<HTMLElement>("[data-cursor]");
      const next = t?.dataset.cursor ?? "";
      setLabel((prev) => (prev === next ? prev : next));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div ref={el} aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block">
      <div
        className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-espresso text-xs font-semibold uppercase tracking-[0.2em] text-flour transition-[width,height,opacity] duration-500 ease-[var(--ease-expo)] ${
          label ? "grid h-20 w-20 place-items-center opacity-100" : "h-0 w-0 opacity-0"
        }`}
      >
        {label}
      </div>
    </div>
  );
}
