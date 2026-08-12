"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "larp-phantom:tour-seen";
export const TOUR_EVENT = "fw:tour";

type Step = {
  /** element carrying data-tour="..." */
  target: string;
  caption: string;
  /** underline the target rather than ring it */
  underline?: boolean;
  ms: number;
  /** true = editor should be open during this step */
  editor?: boolean;
};

const STEPS: Step[] = [
  {
    target: "balance",
    caption: "tap this five times, fast",
    underline: true,
    ms: 2600,
  },
  { target: "editor-title", caption: "the hidden editor", ms: 2100, editor: true },
  {
    target: "add-token",
    caption: "add any token, any amount",
    ms: 2400,
    editor: true,
  },
  { target: "balance", caption: "that is the whole app", underline: true, ms: 1800 },
];

type Rect = { top: number; left: number; width: number; height: number };

export function Tour({ onEditor }: { onEditor: (open: boolean) => void }) {
  const root = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(-1);
  const [rect, setRect] = useState<Rect | null>(null);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setStep(-1);
    setRect(null);
    onEditor(false);
  }, [onEditor]);

  const start = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    setStep(0);
  }, []);

  // First visit runs it automatically. After that it is on demand only.
  useEffect(() => {
    let seen = true;
    try {
      seen = window.localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) {
      const id = window.setTimeout(() => {
        try {
          window.localStorage.setItem(SEEN_KEY, "1");
        } catch {}
        start();
      }, 1400);
      return () => window.clearTimeout(id);
    }
  }, [start]);

  useEffect(() => {
    const onEvt = () => start();
    window.addEventListener(TOUR_EVENT, onEvt);
    return () => window.removeEventListener(TOUR_EVENT, onEvt);
  }, [start]);

  // Drive the editor and advance.
  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return;
    const s = STEPS[step];
    onEditor(!!s.editor);

    // Let the editor mount before measuring.
    const measure = window.setTimeout(() => {
      const host = root.current;
      const el = document.querySelector<HTMLElement>(`[data-tour="${s.target}"]`);
      if (!el || !host) return setRect(null);
      const a = el.getBoundingClientRect();
      const b = host.getBoundingClientRect();
      // Inside the desktop device the frame is scaled, so convert measured
      // pixels back into the frame's own coordinate space.
      const k = b.width / host.offsetWidth || 1;
      setRect({
        top: (a.top - b.top) / k,
        left: (a.left - b.left) / k,
        width: a.width / k,
        height: a.height / k,
      });
    }, 260);

    timer.current = window.setTimeout(() => {
      if (step === STEPS.length - 1) stop();
      else setStep((n) => n + 1);
    }, s.ms);

    return () => {
      window.clearTimeout(measure);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [step, onEditor, stop]);

  const active = step >= 0 && !!rect;
  const s = active ? STEPS[step] : null;
  const below = rect ? rect.top < 260 : true;

  return (
    <div
      ref={root}
      className={`fixed inset-0 z-[75] ${
        active
          ? "anim-fade pointer-events-auto bg-black/45 backdrop-blur-[1.5px]"
          : "pointer-events-none"
      }`}
      onClick={active ? stop : undefined}
    >
      {active && s && rect && (
        <>
      {/* highlight */}
      {s.underline ? (
        <span
          className="anim-tour-underline absolute rounded-full bg-ph-purple"
          style={{
            top: rect.top + rect.height + 4,
            left: rect.left,
            width: rect.width,
            height: 3,
          }}
        />
      ) : (
        <span
          className="anim-tour-ring absolute rounded-[14px] ring-2 ring-ph-purple"
          style={{
            top: rect.top - 5,
            left: rect.left - 5,
            width: rect.width + 10,
            height: rect.height + 10,
          }}
        />
      )}

      {/* caption */}
      <span
        className="anim-tour-cap absolute flex max-w-[260px] -translate-x-1/2 items-center gap-[8px] whitespace-nowrap rounded-full border border-white/12 bg-[#141416]/90 px-[14px] py-[9px] text-[14px] font-medium text-white shadow-[0_16px_38px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        style={{
          left: Math.min(
            Math.max(rect.left + rect.width / 2, 100),
            (root.current?.offsetWidth ?? 412) - 100
          ),
          top: below ? rect.top + rect.height + 20 : rect.top - 52,
        }}
      >
        <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-ph-purple" />
        {s.caption}
      </span>

      <span className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+22px)] text-center text-[12.5px] text-white/40">
        tap anywhere to skip
      </span>
        </>
      )}
    </div>
  );
}

/** Desktop replay button. */
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
