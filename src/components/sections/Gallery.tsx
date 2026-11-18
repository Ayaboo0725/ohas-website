"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gallery } from "@/lib/content";
import { Media } from "@/components/ui/Media";
import { getLenis } from "@/components/motion/SmoothScroll";
import { useReview } from "@/lib/review";

const SPAN: Record<string, string> = {
  wide: "md:col-span-2 aspect-[16/10] md:aspect-auto",
  tall: "md:row-span-2 aspect-[4/5] md:aspect-auto",
  square: "aspect-square md:aspect-auto",
};

export function Gallery() {
  const review = useReview();
  // The live site shows real photos only; frames still waiting for a photo appear in review mode
  const shots = gallery.shots.filter((s) => s.photo || review);
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);
  const touchX = useRef<number | null>(null);
  const wasOpen = useRef(false);

  const show = (i: number, el: HTMLButtonElement) => {
    lastTrigger.current = el;
    setOpen(i);
  };
  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + shots.length) % shots.length)), [shots.length]);

  // Drive the native <dialog> from state; never rely on its async "close" event alone
  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    if (open !== null) {
      if (!dlg.open) {
        dlg.showModal();
        getLenis()?.stop();
      }
    } else if (wasOpen.current) {
      if (dlg.open) dlg.close();
      getLenis()?.start();
      lastTrigger.current?.focus({ preventScroll: true });
    }
    wasOpen.current = open !== null;
  }, [open]);

  useEffect(() => {
    const dlg = dialog.current;
    if (!dlg) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dlg.addEventListener("keydown", onKey);
    return () => dlg.removeEventListener("keydown", onKey);
  }, [step]);

  const current = open !== null ? shots[open] : null;

  return (
    <section id="cafe" aria-labelledby="cafe-title" className="relative bg-cream px-[var(--gutter)] py-28 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              The Café
            </p>
            <h2 id="cafe-title" className="h-section mt-6" data-split>
              Two floors on <span className="italic text-crust">Beach Road.</span>
            </h2>
          </div>
          <p className="lede self-end lg:col-span-4 lg:col-start-9" data-reveal="0.1">
            The counter and display cases downstairs; upstairs, a seating area with a long table for groups and a terrace
            for watching Beach Road go by.
          </p>
        </div>

        <p className="mt-10 inline-flex items-center gap-3 rounded-full bg-flour px-4 py-2 text-xs font-semibold text-mocha ring-1 ring-espresso/10">
          <span className="h-2 w-2 rounded-full border-[1.5px] border-dashed border-crust" aria-hidden="true" />
          {review
            ? "Review mode: frames marked Placeholder still need a real photo — each lists the shot to take."
            : "Photos of OHAS, from OHAS’s own Facebook and Instagram."}
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-flow-dense md:auto-rows-[minmax(220px,22vw)] md:grid-cols-4 md:gap-5" data-stagger>
          {shots.map((s, i) => (
            <li key={s.id} className={`${SPAN[s.span]} relative`}>
              <button
                type="button"
                onClick={(e) => show(i, e.currentTarget)}
                className="group relative block h-full w-full overflow-hidden rounded-[24px] text-left"
                aria-label={`View larger: ${s.title}`}
                data-cursor="View"
              >
                <Media
                  art={s.art}
                  tone={s.tone}
                  alt={s.alt}
                  photo={s.photo}
                  brief={s.brief}
                  className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-expo)] group-hover:scale-[1.04]"
                />
                <span className="absolute inset-x-0 bottom-0 z-[3] flex items-end justify-between bg-gradient-to-t from-espresso/45 to-transparent p-5 pt-16 text-flour opacity-100 transition-opacity duration-500 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100">
                  <span className="font-display text-2xl leading-none">{s.title}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-flour/90 text-espresso" aria-hidden="true">
                    +
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Full-screen viewer */}
      <dialog
        ref={dialog}
        aria-label={current ? current.title : "Photo viewer"}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-espresso/95 p-0 text-flour backdrop:bg-espresso/80"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-[var(--gutter)] py-4">
              <p className="text-sm text-flour/70">
                {open! + 1} / {shots.length}
              </p>
              <button type="button" onClick={close} className="min-h-[44px] rounded-full px-5 text-sm font-semibold ring-1 ring-flour/30 hover:bg-flour hover:text-espresso">
                Close
              </button>
            </div>
            <div className="relative flex flex-1 items-center justify-center px-[var(--gutter)]">
              <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-flour/10 text-2xl hover:bg-flour/20 md:left-6">
                ‹
              </button>
              <div key={current.id} className="relative aspect-[4/3] w-full max-w-[min(1200px,calc((100dvh-220px)*1.333))] overflow-hidden rounded-[20px]">
                <Media art={current.art} tone={current.tone} alt={current.alt} photo={current.photo} className="absolute inset-0" />
              </div>
              <button type="button" onClick={() => step(1)} aria-label="Next photo" className="absolute right-2 z-10 grid h-12 w-12 place-items-center rounded-full bg-flour/10 text-2xl hover:bg-flour/20 md:right-6">
                ›
              </button>
            </div>
            <div className="px-[var(--gutter)] pb-8 pt-5 text-center">
              <p className="font-display text-3xl">{current.title}</p>
              {!current.photo && <p className="mx-auto mt-2 max-w-xl text-sm text-flour/65">Placeholder · Shot to take: {current.brief}</p>}
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
