"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Autosave confirmation. Everything in the editor writes straight to
 * localStorage, so there is no save button to press and nothing tells you it
 * worked. This does.
 *
 * It sits inside the editor overlay, so on desktop it stays inside the phone.
 */
export function SavedToast({ watch }: { watch: unknown }) {
  const [shown, setShown] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const first = useRef(true);
  const hide = useRef<number | null>(null);
  const clear = useRef<number | null>(null);

  useEffect(() => {
    // The first run is just the editor opening, not an edit.
    if (first.current) {
      first.current = false;
      return;
    }

    setLeaving(false);
    setShown(true);

    if (hide.current) window.clearTimeout(hide.current);
    if (clear.current) window.clearTimeout(clear.current);
    hide.current = window.setTimeout(() => setLeaving(true), 1500);
    clear.current = window.setTimeout(() => setShown(false), 1900);

    return () => {
      if (hide.current) window.clearTimeout(hide.current);
      if (clear.current) window.clearTimeout(clear.current);
    };
  }, [watch]);

  if (!shown) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+26px)] z-[80] flex justify-center px-6">
      <div
        className={`flex items-center gap-[10px] rounded-full border border-white/12 bg-[#141416]/85 py-[10px] pl-[11px] pr-[16px] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl ${
          leaving ? "anim-toast-out" : "anim-toast-in"
        }`}
      >
        <span className="grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-ph-green/15">
          <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="none">
            <path
              d="M5 12.5l4.6 4.5L19 7.5"
              stroke="#21de7f"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="anim-toast-check"
              pathLength={1}
            />
          </svg>
        </span>
        <span className="whitespace-nowrap text-[14px] font-medium text-white">
          saved automatically
        </span>
      </div>
    </div>
  );
}
