"use client";

/**
 * DEV-ONLY asset tool (exists only under `next dev`, see next.config.ts).
 * Renders the 3D croissant in a fixed pose on a transparent background so
 * `npm run render:assets` can capture public/hero/croissant-still.webp.
 */
import { useRef } from "react";
import dynamic from "next/dynamic";

const CroissantScene = dynamic(() => import("@/components/hero/CroissantScene"), { ssr: false });

export default function RenderStill() {
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <div style={{ position: "fixed", inset: 0, background: "transparent" }}>
      <style>{`html,body{background:transparent!important} body::after{display:none!important}`}</style>
      <CroissantScene progress={progress} pointer={pointer} active still />
    </div>
  );
}
