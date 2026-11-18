"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";

const CroissantScene = dynamic(() => import("./CroissantScene"), { ssr: false });

type Mode = "pending" | "3d" | "static";

/** Decide whether this device should get the live WebGL croissant. */
function pickMode(): Mode {
  try {
    const q = new URLSearchParams(window.location.search).get("3d");
    if (q === "0") return "static";
    if (q === "1") return "3d";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return "static";
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 3) return "static";
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return "static";
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") || c.getContext("webgl");
    if (!gl) return "static";
  } catch {
    return "static";
  }
  return "3d";
}

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function HeroStage() {
  const [mode, setMode] = useState<Mode>("pending");
  const [ready, setReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [active, setActive] = useState(true);
  const [lowPower, setLowPower] = useState(false);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = pickMode();
    const small = window.matchMedia("(max-width: 767px)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- device capabilities are only known in the browser
    setMode(m);
    setLowPower(small);
    if (m === "static") setShowFallback(true);
    // If the 3D scene is slow to arrive, show the rendered still meanwhile
    const id = window.setTimeout(() => setShowFallback(true), 2600);
    return () => window.clearTimeout(id);
  }, []);

  // Pointer parallax (desktop) — normalised to -1..1
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Pause rendering when the hero is off screen
  useEffect(() => {
    const el = wrap.current?.closest("section");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Scroll choreography for the hero
  useGSAP(
    () => {
      const section = wrap.current?.closest("section");
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => (progress.current = self.progress),
      });
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: true },
        });
        tl.to(section.querySelector("[data-hero-word]"), { yPercent: -22, opacity: 0.25, ease: "none" }, 0)
          .to(section.querySelector("[data-hero-copy]"), { y: -80, opacity: 0, ease: "none" }, 0)
          .to(wrap.current, { yPercent: -8, ease: "none" }, 0);
      });
    },
    { scope: wrap },
  );

  const fallbackVisible = mode === "static" || (showFallback && !ready);

  return (
    <div ref={wrap} className="pointer-events-none absolute inset-0 z-10">
      {/* Rendered still of the same 3D croissant: used without WebGL, for reduced motion and while loading */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/croissant-still.webp"
        alt=""
        aria-hidden="true"
        width={1600}
        height={1000}
        decoding="async"
        className={`absolute left-1/2 top-[50%] w-[190vw] max-w-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000 md:top-1/2 md:w-[min(100vw,1700px)] ${
          fallbackVisible ? "opacity-100" : "opacity-0"
        }`}
      />
      {mode === "3d" && (
        <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
          <SceneBoundary onError={() => setMode("static")}>
            <CroissantScene
              progress={progress}
              pointer={pointer}
              active={active}
              quality={lowPower ? "low" : "high"}
              onReady={() => setReady(true)}
              onLost={() => setMode("static")}
            />
          </SceneBoundary>
        </div>
      )}
    </div>
  );
}
