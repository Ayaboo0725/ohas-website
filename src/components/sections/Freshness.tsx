"use client";

import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Illustration } from "@/components/art/Illustration";

const STEPS = [
  {
    n: "01",
    label: "Dough",
    title: "It starts with dough.",
    text: "Breads, pastries and cakes are made in our own bakery — the counter is filled with what we bake.",
    bg: "#f4ecde",
  },
  {
    n: "02",
    label: "Time",
    title: "Natural, low-temperature fermentation.",
    text: "Every OHAS bread is made this way: a cool, natural ferment that gives the dough time.",
    bg: "#e9edee",
  },
  {
    n: "03",
    label: "The oven",
    title: "Baked in-house, every day.",
    text: "Freshness is our recipe. Breads, pastries and cakes come out of our ovens every day.",
    bg: "#f7dcb4",
  },
  {
    n: "04",
    label: "The counter",
    title: "Around 70 baked goods, on rotation.",
    text: "The selection changes by the day and by the season — which is a good reason to come back.",
    bg: "#fbf7f0",
  },
];

// Same command structure so GSAP can interpolate between them
const SHAPES = [
  "M200 320 C138 320 118 302 118 266 C118 218 154 190 200 190 C246 190 282 218 282 266 C282 302 262 320 200 320 Z",
  "M200 322 C112 322 88 300 88 250 C88 180 142 146 200 146 C258 146 312 180 312 250 C312 300 288 322 200 322 Z",
  "M200 322 C106 322 80 298 80 244 C80 168 138 126 200 126 C262 126 320 168 320 244 C320 298 294 322 200 322 Z",
  "M200 322 C106 322 80 298 80 244 C80 168 138 126 200 126 C262 126 320 168 320 244 C320 298 294 322 200 322 Z",
];
const COLORS = [
  ["#fbf3e3", "#e8d6b6"],
  ["#fdf7ec", "#ead9bb"],
  ["#eeb05c", "#9c5019"],
  ["#eeb05c", "#9c5019"],
];

export function Freshness() {
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);

  // Watch which step is in view
  useGSAP(
    () => {
      const blocks = gsap.utils.toArray<HTMLElement>("[data-step]", root.current);
      blocks.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setStep(i),
        });
      });
    },
    { scope: root },
  );

  // Animate the loaf to the current step
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const dur = prefersReducedMotion() ? 0 : 1.3;
      const ease = "expo.out";
      gsap.to(root.current, { backgroundColor: STEPS[step].bg, duration: dur, ease: "power2.out" });
      gsap.to(q("[data-loaf]"), { attr: { d: SHAPES[step] }, duration: dur, ease });
      gsap.to(q("[data-stop-a]"), { stopColor: COLORS[step][0], duration: dur, ease });
      gsap.to(q("[data-stop-b]"), { stopColor: COLORS[step][1], duration: dur, ease });
      gsap.to(q("[data-flour]"), { autoAlpha: step <= 1 ? 1 : 0, duration: dur * 0.6 });
      gsap.to(q("[data-bubbles] circle"), {
        scale: step === 1 ? 1 : 0.2,
        autoAlpha: step === 1 ? 0.7 : 0,
        transformOrigin: "50% 50%",
        stagger: 0.05,
        duration: dur,
        ease,
      });
      gsap.to(q("[data-score]"), { strokeDashoffset: step >= 2 ? 0 : 1, duration: dur, ease });
      gsap.to(q("[data-sheen]"), { autoAlpha: step >= 2 ? 0.55 : 0, duration: dur });
      gsap.to(q("[data-steam]"), { autoAlpha: step === 2 ? 1 : 0, duration: dur * 0.6 });
      gsap.to(q("[data-cool]"), { autoAlpha: step === 1 ? 1 : 0, duration: dur * 0.6 });
      gsap.to(q("[data-glow]"), { autoAlpha: step === 2 ? 1 : 0, scale: step === 2 ? 1 : 0.7, duration: dur, ease });
      gsap.to(q("[data-loafwrap]"), {
        x: step === 3 ? -96 : 0,
        scale: step === 3 ? 0.62 : 1,
        transformOrigin: "50% 100%",
        duration: dur,
        ease,
      });
      gsap.to(q("[data-counter] > *"), {
        autoAlpha: step === 3 ? 1 : 0,
        y: step === 3 ? 0 : 30,
        stagger: 0.08,
        duration: dur,
        ease,
      });
    },
    { scope: root, dependencies: [step] },
  );

  return (
    <section
      ref={root}
      id="freshness"
      aria-labelledby="fresh-title"
      className="relative bg-cream px-[var(--gutter)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="max-w-3xl">
          <p className="eyebrow" data-reveal>
            Freshness is our recipe
          </p>
          <h2 id="fresh-title" className="h-section mt-6" data-split>
            From dough to counter.
          </h2>
        </div>

        <div className="relative mt-12 grid lg:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Sticky stage */}
          <div className="sticky top-[var(--header-h)] z-10 h-[44svh] bg-inherit lg:top-0 lg:h-[100svh] lg:bg-transparent">
            <div className="relative flex h-full items-center justify-center">
              <span
                className="pointer-events-none absolute font-display text-[38vw] leading-none text-espresso/[0.05] lg:text-[22vw]"
                aria-hidden="true"
              >
                {STEPS[step].n}
              </span>
              <svg viewBox="0 0 400 400" className="relative h-full max-h-[620px] w-full overflow-visible" role="img" aria-label={`Illustration: ${STEPS[step].label}`}>
                <defs>
                  <radialGradient id="dough-fill" cx="42%" cy="30%" r="80%">
                    <stop data-stop-a offset="0%" stopColor={COLORS[0][0]} />
                    <stop data-stop-b offset="100%" stopColor={COLORS[0][1]} />
                  </radialGradient>
                  <radialGradient id="oven-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ffb85c" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#ffb85c" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <circle data-glow cx="200" cy="240" r="190" fill="url(#oven-glow)" opacity="0" />

                {/* Low-temperature hint */}
                <g data-cool opacity="0" stroke="#7d93a3" strokeWidth="1.6" fill="none" strokeLinecap="round">
                  <g transform="translate(320 110)">
                    <path d="M0 -18 L0 18 M-16 -9 L16 9 M-16 9 L16 -9" />
                    <path d="M-4 -14 L0 -10 L4 -14 M-4 14 L0 10 L4 14" />
                  </g>
                  <text x="320" y="152" textAnchor="middle" fill="#5f7686" stroke="none" fontSize="12" letterSpacing="2" style={{ fontFamily: "var(--font-dm)", fontWeight: 600 }}>
                    LOW &amp; SLOW
                  </text>
                </g>

                <ellipse cx="200" cy="326" rx="132" ry="14" fill="#2a1a12" opacity="0.12" />

                <g data-loafwrap>
                  <path data-loaf d={SHAPES[0]} fill="url(#dough-fill)" stroke="#2a1a12" strokeOpacity="0.18" strokeWidth="1.2" />
                  <path data-sheen d="M128 214 C140 172 170 150 204 144" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0" />
                  {/* Scoring opens up in the oven */}
                  <g fill="none" stroke="#6e3511" strokeWidth="3.5" strokeLinecap="round">
                    <path data-score pathLength={1} strokeDasharray="1" strokeDashoffset="1" d="M140 196 C170 168 230 164 262 186" />
                    <path data-score pathLength={1} strokeDasharray="1" strokeDashoffset="1" d="M150 236 C178 212 228 210 254 228" />
                  </g>
                  <g data-bubbles fill="none" stroke="#2a1a12" strokeOpacity="0.25">
                    {[[160, 240, 6], [196, 214, 4], [232, 250, 7], [210, 280, 5], [176, 286, 4], [252, 222, 3.5]].map(([x, y, r]) => (
                      <circle key={`${x}${y}`} cx={x} cy={y} r={r} opacity="0" />
                    ))}
                  </g>
                  <g data-flour fill="#fff">
                    {[[150, 206], [178, 192], [214, 188], [246, 200], [262, 222], [134, 236], [196, 200], [230, 194]].map(([x, y]) => (
                      <circle key={`${x}${y}`} cx={x} cy={y} r="2" opacity="0.9" />
                    ))}
                  </g>
                  <g data-steam opacity="0" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" className="steam-svg">
                    <path d="M170 120 C158 96 182 80 170 52" />
                    <path d="M206 112 C194 86 218 70 206 40" />
                    <path d="M242 120 C230 96 254 80 242 52" />
                  </g>
                </g>

                {/* The counter */}
                <g data-counter>
                  <g opacity="0">
                    <path d="M20 330 L380 330" stroke="#2a1a12" strokeOpacity="0.3" strokeWidth="1.5" />
                  </g>
                  <g opacity="0">
                    <g transform="translate(276 256) scale(0.56)" color="#8f511c">
                      <Illustration name="macaron" size={160} />
                    </g>
                  </g>
                  <g opacity="0">
                    <g transform="translate(244 160) scale(0.74)" color="#8f511c">
                      <Illustration name="baguette" size={160} />
                    </g>
                  </g>
                  <g opacity="0">
                    <g transform="translate(186 236) scale(0.64)" color="#8f511c">
                      <Illustration name="croissant" size={160} />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          {/* Steps */}
          <ol className="relative z-0">
            {STEPS.map((s, i) => (
              <li
                key={s.n}
                data-step
                className="flex min-h-[64svh] flex-col justify-center border-t border-espresso/10 py-14 lg:min-h-[86svh]"
              >
                <p className="flex items-center gap-4">
                  <span className="font-display text-2xl text-crust">{s.n}</span>
                  <span className="eyebrow !text-mocha">{s.label}</span>
                </p>
                <h3
                  className={`mt-5 max-w-[16ch] font-display text-[clamp(2.2rem,4.4vw,4.2rem)] leading-[1] tracking-[-0.02em] transition-opacity duration-700 ${
                    step === i ? "opacity-100" : "lg:opacity-35"
                  }`}
                >
                  {s.title}
                </h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-mocha">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
