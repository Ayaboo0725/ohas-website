import { settings } from "@/lib/content";
import { HeroStage } from "@/components/hero/HeroStage";
import { ArrowDownIcon } from "@/components/ui/Icons";

const d = (s: number) => ({ ["--d" as string]: `${s}s` });

export function Hero() {
  return (
    <section id="top" aria-label="Welcome" className="relative h-[100svh] min-h-[640px] overflow-hidden bg-flour">
      {/* Morning light through the window */}
      <div className="hero-light" aria-hidden="true" />
      <div className="hero-beams" aria-hidden="true" />

      {/* OHAS — Boulangerie & Café */}
      <h1 className="absolute inset-x-0 top-[15svh] px-[var(--gutter)] md:top-[13svh]" data-hero-word>
        <span className="sr-only">OHAS </span>
        <span
          className="block whitespace-nowrap text-center font-display text-[33vw] leading-[0.78] tracking-[-0.045em] text-espresso md:text-[27vw] 2xl:text-[25vw]"
          aria-hidden="true"
        >
          {["O", "H", "A", "S"].map((l, i) => (
            <span key={l} className="intro-word" style={d(i * 0.09)}>
              {l}
            </span>
          ))}
        </span>
        <span
          className="intro mt-3 block text-right font-display text-[1.45rem] italic leading-none text-crust md:mr-[4vw] md:mt-[1.5vw] md:text-[clamp(1.6rem,2.4vw,2.6rem)]"
          style={d(0.45)}
        >
          {settings.subtitle}
        </span>
      </h1>

      <HeroStage />

      {/* Rotating seal */}
      <div
        className="intro absolute right-[var(--gutter)] top-[calc(var(--header-h)+5svh)] z-20 hidden h-28 w-28 md:block"
        style={d(1)}
        aria-hidden="true"
      >
        <svg viewBox="0 0 120 120" className="spin-slow h-full w-full text-espresso">
          <defs>
            <path id="seal-path" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
          </defs>
          <text fontSize="10.5" letterSpacing="3.2" fill="currentColor" style={{ fontFamily: "var(--font-dm)", fontWeight: 600 }}>
            <textPath href="#seal-path">BAKED IN-HOUSE · EVERY DAY · GARAPAN ·</textPath>
          </text>
        </svg>
        <span className="absolute inset-0 grid place-items-center font-display text-3xl text-crust">O</span>
      </div>

      {/* Statement + calls to action */}
      <div
        className="absolute inset-x-0 bottom-0 z-20 px-[var(--gutter)] pb-[calc(96px+env(safe-area-inset-bottom))] lg:pb-10"
        data-hero-copy
      >
        <div className="mx-auto grid max-w-[1600px] items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="intro eyebrow" style={d(0.55)}>
              Beach Road &amp; Orchid Street · Garapan, Saipan
            </p>
            <p className="intro mt-3 font-display text-[2rem] leading-[1.02] md:text-[2.9rem]" style={d(0.62)}>
              {settings.mantra}
            </p>
            <p className="intro mt-2 text-sm font-semibold uppercase tracking-[0.28em] text-mocha" style={d(0.7)}>
              {settings.brandLine}
            </p>
          </div>

          <div className="hidden justify-center lg:col-span-2 lg:flex">
            <a href="#story" className="intro flex flex-col items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.3em]" style={d(1.1)}>
              <span>Scroll</span>
              <span className="scroll-cue" aria-hidden="true" />
            </a>
          </div>

          <div className="intro flex flex-wrap gap-3 lg:col-span-5 lg:justify-end" style={d(0.8)}>
            <a href="#menu" className="btn flex-1 sm:flex-none">
              See What&apos;s Fresh <ArrowDownIcon />
            </a>
            <a href="#cakes" className="btn btn-ghost flex-1 bg-flour/60 backdrop-blur-sm sm:flex-none">
              Order a Cake
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
