"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "larp-phantom:tour-seen";
export const TOUR_EVENT = "fw:tour";
export const ADD_TOKEN_EVENT = "fw:add-token";
export const SAVED_EVENT = "fw:token-saved";

type Step = {
  /** element carrying data-tour="..." */
  target: string;
  caption: string;
  hint?: string;
  /** underline the target instead of ringing it */
  underline?: boolean;
  /** advances when the editor opens, rather than on an event */
  awaitEditor?: boolean;
  /** advances when this window event fires */
  awaitEvent?: string;
};

const STEPS: Step[] = [
  {
    target: "balance",
    caption: "tap this five times, fast",
    hint: "there is no settings button, this is the way in",
    underline: true,
    awaitEditor: true,
  },
  {
    target: "add-token",
    caption: "now add a token",
    hint: "anything you like, any amount",
    awaitEvent: ADD_TOKEN_EVENT,
  },
  {
    target: "save",
    caption: "fill it in, then save",
    hint: "or paste a solana mint and let jupiter do it",
    awaitEvent: SAVED_EVENT,
  },
];

type Rect = { top: number; left: number; width: number; height: number };

export function Tour({ editorOpen }: { editorOpen: boolean }) {
  const root = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(-1);
  const [rect, setRect] = useState<Rect | null>(null);

  const stop = useCallback(() => {
    setStep(-1);
    setRect(null);
  }, []);

  const start = useCallback(() => setStep(0), []);

  // Runs itself on a first visit only. After that it is on demand.
  useEffect(() => {
    let seen = true;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;
    const id = window.setTimeout(() => {
      try {
        window.localStorage.setItem(SEEN_KEY, "1");
      } catch {}
      start();
    }, 1200);
    return () => window.clearTimeout(id);
  }, [start]);

  useEffect(() => {
    const onEvt = () => start();
    window.addEventListener(TOUR_EVENT, onEvt);
    return () => window.removeEventListener(TOUR_EVENT, onEvt);
  }, [start]);

  /* ------------------------- advance on real actions ------------------------ */

  const s = step >= 0 ? STEPS[step] : null;

  const next = useCallback(
    () => setStep((n) => (n + 1 >= STEPS.length ? -1 : n + 1)),
    []
  );

  useEffect(() => {
    if (!s?.awaitEditor) return;
    if (editorOpen) next();
  }, [s, editorOpen, next]);

  const awaitEvent = s?.awaitEvent;
  useEffect(() => {
    if (!awaitEvent) return;
    const on = () => next();
    window.addEventListener(awaitEvent, on);
    return () => window.removeEventListener(awaitEvent, on);
  }, [awaitEvent, next]);

  // Closing the editor mid-tour ends it, otherwise the highlight points at
  // something that is no longer on screen.
  useEffect(() => {
    if (step > 0 && !editorOpen) stop();
  }, [step, editorOpen, stop]);

  /* -------------------------------- measure -------------------------------- */

  useEffect(() => {
    if (!s) return;
    let raf = 0;
    const measure = () => {
      const host = root.current;
      const el = document.querySelector<HTMLElement>(`[data-tour="${s.target}"]`);
      if (!el || !host) return setRect(null);
      const a = el.getBoundingClientRect();
      const b = host.getBoundingClientRect();
      // The desktop device is scaled, so convert back to its own coordinates.
      const k = b.width / host.offsetWidth || 1;
      setRect({
        top: (a.top - b.top) / k,
        left: (a.left - b.left) / k,
        width: a.width / k,
        height: a.height / k,
      });
    };
    const t = window.setTimeout(() => {
      measure();
      raf = window.requestAnimationFrame(measure);
    }, 260);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, [s, step]);

  const active = !!s && !!rect;
  const below = rect ? rect.top < 240 : true;
  const pad = 6;

  return (
    <div
      ref={root}
      className="pointer-events-none fixed inset-0 z-[75]"
      aria-hidden={!active}
    >
      {active && s && rect && (
        <>
          {/* spotlight: dims the page but leaves the target tappable */}
          <span
            className="anim-fade absolute rounded-[16px] shadow-[0_0_0_9999px_rgba(0,0,0,0.62)]"
            style={{
              top: rect.top - pad,
              left: rect.left - pad,
              width: rect.width + pad * 2,
              height: rect.height + pad * 2,
            }}
          />

          {s.underline && (
            <span
              className="anim-tour-underline absolute rounded-full bg-ph-purple"
              style={{
                top: rect.top + rect.height + 5,
                left: rect.left,
                width: rect.width,
                height: 3,
              }}
            />
          )}

          <span
            className="anim-tour-cap absolute flex -translate-x-1/2 flex-col items-center gap-[5px]"
            style={{
              left: Math.min(
                Math.max(rect.left + rect.width / 2, 118),
                (root.current?.offsetWidth ?? 412) - 118
              ),
              top: below ? rect.top + rect.height + 22 : rect.top - 68,
            }}
          >
            <span className="flex items-center gap-[8px] whitespace-nowrap rounded-full border border-white/12 bg-[#141416]/92 px-[14px] py-[9px] text-[14px] font-medium text-white shadow-[0_16px_38px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
              <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-ph-purple" />
              {s.caption}
            </span>
            {s.hint && (
              <span className="max-w-[250px] text-center text-[12.5px] leading-[1.45] text-white/45">
                {s.hint}
              </span>
            )}
          </span>

          {/* step dots + an explicit way out */}
          <span className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+20px)] flex flex-col items-center gap-[10px]">
            <span className="flex gap-[5px]">
              {STEPS.map((_, i) => (
                <span
                  key={i}
                  className={`h-[5px] rounded-full transition-all duration-300 ${
                    i === step ? "w-[16px] bg-ph-purple" : "w-[5px] bg-white/25"
                  }`}
                />
              ))}
            </span>
            <button
              onClick={stop}
              className="pointer-events-auto rounded-full px-[12px] py-[5px] text-[12.5px] text-white/45 transition-colors hover:text-white/80"
            >
              skip
            </button>
          </span>
        </>
      )}
    </div>
  );
}

/** Desktop replay link. */
export function TourButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event(TOUR_EVENT))}
      className="pointer-events-auto transition-colors hover:text-white"
    >
      how it works
    </button>
  );
}
