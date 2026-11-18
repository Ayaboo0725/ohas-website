"use client";

import { useRef } from "react";
import { menu, type Tone } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import { Media } from "@/components/ui/Media";
import { ArrowIcon } from "@/components/ui/Icons";
import { MENU_TAB_EVENT } from "@/components/sections/Menu";

const desc = (id: string) => menu.items.find((i) => i.id === id)?.description ?? "";
const brief = (id: string) => menu.items.find((i) => i.id === id)?.photoBrief ?? "";
const photoOf = (id: string) => menu.items.find((i) => i.id === id)?.photo ?? null;

const SIGNATURES: {
  id: string;
  title: string;
  kicker: string;
  text: string;
  tab: string;
  tone: Tone;
  art: string;
  bg: string;
  dark?: boolean;
}[] = [
  { id: "apple-bread", title: "Apple Bread", kicker: "Shaped like an apple", text: desc("apple-bread"), tab: "breads", tone: "strawberry", art: "apple", bg: "#f8e5e1" },
  { id: "tinian-baguette", title: "Tinian Baguette", kicker: "A local twist", text: desc("tinian-baguette"), tab: "breads", tone: "crust", art: "baguette", bg: "#f2dfc6" },
  { id: "croissant", title: "Croissants", kicker: "Crisp outside, soft inside", text: "Plain, or with chocolate. Baked in-house, every day.", tab: "pastries", tone: "butter", art: "croissant", bg: "#f7eac8" },
  { id: "ube-cream-latte", title: "Ube Cream Latte", kicker: "Ube cream over espresso", text: desc("ube-cream-latte"), tab: "coffee", tone: "ube", art: "iced", bg: "#efe6f5" },
  { id: "chocolate-croissant", title: "Pain au Chocolat", kicker: "Two-tone, rolled with chocolate", text: desc("chocolate-croissant"), tab: "pastries", tone: "espresso", art: "croissant", bg: "#2a1a12", dark: true },
  {
    id: "coconut-ube-bingsu",
    title: "Coconut Series & Bingsu",
    kicker: "Five coconut drinks, one bingsu",
    text: "Coconut Strawberry, Coconut Matcha, Coconut Ube, Coconut Mango and Coconut Coffee — plus Coconut Ube Bingsu.",
    tab: "coconut",
    tone: "ube",
    art: "bingsu",
    bg: "#ebe3f4",
  },
];

export function Signatures() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Desktop: pinned horizontal journey through the signatures
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });

        gsap.utils.toArray<HTMLElement>("[data-sig]", el).forEach((panel) => {
          const art = panel.querySelector("[data-sig-art]");
          const ring = panel.querySelector("[data-sig-ring]");
          const words = panel.querySelectorAll("[data-sig-text] > *");
          gsap.fromTo(
            art,
            { clipPath: "circle(22% at 50% 50%)", scale: 0.92 },
            {
              clipPath: "circle(50% at 50% 50%)",
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 85%", end: "left 15%", scrub: true },
            },
          );
          gsap.fromTo(
            ring,
            { rotate: -40 },
            {
              rotate: 40,
              ease: "none",
              scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
          gsap.from(words, {
            y: 40,
            autoAlpha: 0,
            stagger: 0.06,
            ease: "expo.out",
            duration: 1,
            scrollTrigger: { trigger: panel, containerAnimation: tween, start: "left 60%", toggleActions: "play none none reverse" },
          });
        });
      });

      // Phones, tablets, reduced motion: stacked panels with a gentle reveal
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-sig-art]", track.current).forEach((art) => {
          gsap.fromTo(
            art,
            { clipPath: "circle(26% at 50% 50%)" },
            { clipPath: "circle(50% at 50% 50%)", ease: "none", scrollTrigger: { trigger: art, start: "top 90%", end: "top 35%", scrub: true } },
          );
        });
      });
    },
    { scope: root },
  );

  const openTab = (tab: string) => window.dispatchEvent(new CustomEvent(MENU_TAB_EVENT, { detail: tab }));

  return (
    <section ref={root} id="signatures" aria-labelledby="sig-title" className="relative overflow-hidden bg-cream">
      <h2 id="sig-title" className="sr-only">
        OHAS signatures
      </h2>
      <div ref={track} className="flex flex-col lg:motion-safe:h-[100svh] lg:motion-safe:w-max lg:motion-safe:flex-row">
        {/* Intro panel */}
        <div className="flex flex-col justify-center px-[var(--gutter)] py-28 lg:motion-safe:h-full lg:motion-safe:w-[52vw] lg:motion-safe:py-0">
          <p className="eyebrow">Signatures</p>
          <p className="h-section mt-6 max-w-[11ch]" aria-hidden="true">
            Six things to <span className="italic text-crust">try first.</span>
          </p>
          <p className="lede mt-8 max-w-md">
            A few OHAS signatures — from an apple-shaped bun to a baguette with a Tinian kick.
          </p>
          <p className="mt-10 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-mocha lg:motion-safe:flex">
            Keep scrolling <ArrowIcon />
          </p>
        </div>

        {SIGNATURES.map((s, i) => (
          <article
            key={s.id}
            data-sig
            aria-label={s.title}
            style={{ backgroundColor: s.bg }}
            className={`relative flex flex-col justify-center gap-10 px-[var(--gutter)] py-20 lg:motion-safe:h-full lg:motion-safe:w-screen lg:motion-safe:flex-row lg:motion-safe:items-center lg:motion-safe:gap-[6vw] lg:motion-safe:py-0 ${
              s.dark ? "text-flour" : "text-espresso"
            }`}
          >
            <div data-sig-text className="order-2 max-w-xl lg:motion-safe:order-1 lg:motion-safe:w-[38vw]">
              <p className={`font-display text-xl ${s.dark ? "text-butter" : "text-crust"}`}>
                {String(i + 1).padStart(2, "0")} <span className="opacity-50">/ {String(SIGNATURES.length).padStart(2, "0")}</span>
              </p>
              <p className={`eyebrow mt-6 ${s.dark ? "!text-butter" : ""}`}>{s.kicker}</p>
              <h3 className="mt-4 font-display text-[clamp(3rem,7vw,7.5rem)] leading-[0.9] tracking-[-0.03em]">{s.title}</h3>
              <p className={`mt-6 max-w-md text-lg leading-relaxed ${s.dark ? "text-flour/75" : "text-mocha"}`}>{s.text}</p>
              <a
                href="#menu"
                onClick={() => openTab(s.tab)}
                className={`btn mt-8 ${s.dark ? "btn-light" : "btn-ghost"}`}
              >
                Find it on the menu <ArrowIcon />
              </a>
            </div>

            <div className="relative order-1 mx-auto aspect-square w-[min(84vw,520px)] lg:motion-safe:order-2 lg:motion-safe:mx-0 lg:motion-safe:w-[min(40vw,74svh)]">
              <svg data-sig-ring viewBox="0 0 100 100" className="absolute -inset-[6%] h-[112%] w-[112%] overflow-visible" aria-hidden="true">
                <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.25" strokeDasharray="0.6 1.4" />
                <circle cx="50" cy="1" r="1.1" fill="currentColor" opacity="0.6" />
              </svg>
              <div data-sig-art className="absolute inset-0 overflow-hidden rounded-full [clip-path:circle(50%_at_50%_50%)]">
                <Media art={s.art} tone={s.tone} alt={s.title} photo={photoOf(s.id)} brief={brief(s.id)} round className="absolute inset-0" />
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Progress */}
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] bottom-8 hidden h-px bg-espresso/15 lg:motion-safe:block" aria-hidden="true">
        <div ref={bar} className="h-full origin-left scale-x-0 bg-espresso" />
      </div>
    </section>
  );
}
