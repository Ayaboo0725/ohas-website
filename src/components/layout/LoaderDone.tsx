"use client";

import { useEffect } from "react";

/** Remembers that the intro played, so it is skipped for the rest of the session. */
export function LoaderDone() {
  useEffect(() => {
    try {
      sessionStorage.setItem("ohas-intro", "1");
    } catch {
      /* storage blocked — intro simply plays again next time */
    }
  }, []);
  return null;
}
