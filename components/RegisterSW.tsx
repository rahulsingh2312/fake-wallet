"use client";

import { useEffect } from "react";

/** Registers the service worker so the app installs as a real PWA. */
export function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration is best-effort, the app works without it */
      });
    };

    // Hydration can happen after `load` has already fired, in which case the
    // listener would never run and Chrome would never offer to install.
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
