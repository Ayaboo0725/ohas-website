"use client";

import { useEffect, useRef, useState } from "react";
import { settings } from "@/lib/content";
import { PinIcon } from "@/components/ui/Icons";

/** Google Map that only loads when it scrolls near the viewport. */
export function MapEmbed() {
  const box = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLoad(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className="relative h-[60svh] min-h-[380px] overflow-hidden rounded-[32px] bg-cream ring-1 ring-espresso/10 lg:h-full lg:min-h-[640px]">
      {/* Stylised stand-in while the map loads */}
      <div className="absolute inset-0 grid place-items-center" aria-hidden={load}>
        <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="400" height="300" fill="#f4ecde" />
          <path d="M-20 200 C80 180 160 210 250 160 C320 120 380 130 430 90" stroke="#bfd4dc" strokeWidth="60" fill="none" opacity="0.55" />
          <path d="M60 -10 L150 310" stroke="#fff" strokeWidth="14" />
          <path d="M-10 120 L410 150" stroke="#fff" strokeWidth="9" />
          <path d="M260 -10 L230 310" stroke="#fff" strokeWidth="7" />
        </svg>
        <div className="relative flex flex-col items-center gap-3 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-espresso text-flour shadow-lg">
            <PinIcon size={22} />
          </span>
          <span className="rounded-full bg-flour px-4 py-2 text-sm font-semibold shadow">OHAS · Beach Road &amp; Orchid St.</span>
        </div>
      </div>
      {load && (
        <iframe
          title="Map showing OHAS Boulangerie & Café on Beach Road, Garapan"
          src={settings.links.mapEmbed}
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.75)_sepia(0.12)]"
          allowFullScreen
        />
      )}
      <a
        href={settings.links.googleMaps}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 z-10 rounded-full bg-flour px-4 py-2.5 text-sm font-semibold shadow-md ring-1 ring-espresso/10 transition hover:bg-espresso hover:text-flour"
      >
        Open in Google Maps ↗
      </a>
    </div>
  );
}
