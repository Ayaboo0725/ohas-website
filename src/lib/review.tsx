"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";

/**
 * Review mode: add ?review=1 to the URL to see everything that is waiting
 * for OHAS to confirm (hours, prices, allergen notes, amenities…), each
 * marked "Pending". ?review=0 turns it off. The live site never shows these.
 */

const KEY = "ohas-review";
let cached: boolean | null = null;
const listeners = new Set<() => void>();

function read(): boolean {
  if (cached !== null) return cached;
  let v = false;
  try {
    const p = new URLSearchParams(window.location.search);
    if (p.has("review")) {
      v = p.get("review") !== "0";
      sessionStorage.setItem(KEY, v ? "1" : "0");
    } else {
      v = sessionStorage.getItem(KEY) === "1";
    }
  } catch {
    /* storage blocked — default off */
  }
  cached = v;
  return v;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function setReview(v: boolean) {
  cached = v;
  try {
    sessionStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useReview(): boolean {
  return useSyncExternalStore(subscribe, read, () => false);
}

/** Renders its children only in review mode, outlined and tagged. */
export function Pending({
  children,
  label = "Pending OHAS confirmation",
  className = "",
  inline = false,
}: {
  children?: ReactNode;
  label?: string;
  className?: string;
  inline?: boolean;
}) {
  const on = useReview();
  if (!on) return null;
  if (inline) {
    return (
      <span className={`pending inline-flex flex-wrap items-center gap-2 px-1 ${className}`}>
        <span className="pending-tag">{label}</span>
        {children}
      </span>
    );
  }
  return (
    <div className={`pending p-3 ${className}`}>
      <span className="pending-tag mb-2">{label}</span>
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

export function ReviewBanner() {
  const on = useReview();
  useEffect(() => {
    document.documentElement.classList.toggle("review", on);
  }, [on]);
  if (!on) return null;
  return (
    <div
      role="status"
      className="fixed left-3 top-[84px] z-[60] flex max-w-[calc(100vw-24px)] items-center gap-3 rounded-full bg-ube px-4 py-2 text-xs font-semibold text-white shadow-lg"
    >
      <span>Review mode · showing items pending OHAS confirmation</span>
      <button
        type="button"
        onClick={() => setReview(false)}
        className="rounded-full bg-white/20 px-2.5 py-1 hover:bg-white/30"
      >
        Exit
      </button>
    </div>
  );
}
