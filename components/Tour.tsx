"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SEEN_KEY = "larp-phantom:tour-seen";
export const TOUR_EVENT = "fw:tour";

type Step = {
  /** element carrying data-tour="..." */
  target: string;
  caption: string;
  hint?: string;
  /** underline the target instead of ringing it */
  underline?: boolean;
  /** editor should be open on this step */
  editor?: boolean;
};

const STEPS: Step[] = [
  {
    target: "balance",
    caption: "tap this five times, fast",
    hint: "or hit + at the bottom right. this way is cooler",
    underline: true,
  },
  {
    target: "editor-title",
    caption: "that opens the editor",
    hint: "tokens, accounts, your name and avatar",
    editor: true,
  },
  {
    target: "add-token",
    caption: "add any token, any amount",
    hint: "or paste a solana mint and jupiter fills the rest in, live",
    editor: true,
  },
  {
    target: "balance",
    caption: "and the number is yours",
    hint: "everything saves itself as you type",
    underline: true,
  },
];

type Rect = { top: number; left: number; width: number; height: number };

export function Tour({ onEditor }: { onEditor: (open: boolean) => void }) {
  const root = useRef<HTMLDivElement | null>(null);
  const [step, setStep] = useState(-1);
  const [rect, setRect] = useState<Rect | null>(null);

  const stop = useCallback(() => {
    setStep(-1);
    setRect(null);
    onEditor(false);
  }, [onEditor]);

  const start = useCallback(() => {
    setRect(null);
    setStep(0);
  }, []);

  const next = useCallback(() => {
    setRect(null);
    setStep((n) => {
      if (n + 1 >= STEPS.length) return -1;
      return n + 1;
    });
  }, []);

  // Runs itself on a first visit only, then it is on demand.
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

  const s = step >= 0 ? STEPS[step] : null;

  // The tour drives the app so the viewer only has to keep tapping.
  useEffect(() => {
    if (step < 0) return;
    onEditor(!!STEPS[step].editor);
  }, [step, onEditor]);

  useEffect(() => {
    if (step === -1) onEditor(false);
  }, [step, onEditor]);

  /* -------------------------------- measure -------------------------------- */

  useEffect(() => {
    if (!s) return;
    let cancelled = false;
    let tries = 0;

    // The editor animates in, so poll briefly until the target settles.
    const tick = () => {
      if (cancelled) return;
      const host = root.current;
      const el = document.querySelector<HTMLElement>(`[data-tour="${s.target}"]`);
      if (el && host) {
        const a = el.getBoundingClientRect();
        const b = host.getBoundingClientRect();
        if (a.width > 0) {
          // The desktop device is scaled, convert back to its coordinates.
          const k = b.width / host.offsetWidth || 1;
          setRect({
            top: (a.top - b.top) / k,
            left: (a.left - b.left) / k,
            width: a.width / k,
            height: a.height / k,
          });
          if (tries > 3) return;
        }
      }
      if (tries++ < 14) window.setTimeout(tick, 60);
    };
    tick();

    const onResize = () => tick();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [s, step]);

  const active = !!s && !!rect;
  const below = rect ? rect.top < 240 : true;
  const last = step === STEPS.length - 1;
  const pad = 6;

  if (!active || !s || !rect) return <div ref={root} className="pointer-events-none fixed inset-0 z-[75]" />;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[75] cursor-pointer"
      onClick={next}
    >
      {/* spotlight */}
      <span
        className="anim-fade absolute rounded-[16px] shadow-[0_0_0_9999px_rgba(0,0,0,0.66)]"
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
        className="anim-tour-cap absolute flex -translate-x-1/2 flex-col items-center gap-[6px]"
        style={{
          left: Math.min(
            Math.max(rect.left + rect.width / 2, 122),
            (root.current?.offsetWidth ?? 412) - 122
          ),
          top: below ? rect.top + rect.height + 22 : rect.top - 74,
        }}
      >
        <span className="flex items-center gap-[8px] whitespace-nowrap rounded-full border border-white/12 bg-[#141416]/92 px-[14px] py-[9px] text-[14px] font-medium text-white shadow-[0_16px_38px_-12px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-ph-purple" />
          {s.caption}
        </span>
        {s.hint && (
          <span className="max-w-[248px] rounded-[10px] bg-black/70 px-[9px] py-[4px] text-center text-[12.5px] leading-[1.45] text-white/55 backdrop-blur-sm">
            {s.hint}
          </span>
        )}
      </span>

      {/* controls */}
      <span className="absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+20px)] flex flex-col items-center gap-[12px]">
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
        <span className="flex items-center gap-[10px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              stop();
            }}
            className="rounded-full px-[13px] py-[8px] text-[13px] text-white/45 transition-colors hover:text-white/80"
          >
            skip
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="rounded-full bg-ph-purple px-[18px] py-[8px] text-[13.5px] font-bold text-black transition-transform active:scale-95"
          >
            {last ? "done" : "next"}
          </button>
        </span>
        <span className="text-[11.5px] text-white/25">or tap anywhere</span>
      </span>
    </div>
  );
}

/** Desktop replay link. */
export function TourButton({
  label = "how it works",
  className = "transition-colors hover:text-fw-ink",
}: {
  label?: string;
  className?: string;
} = {}) {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event(TOUR_EVENT))}
      className={`pointer-events-auto ${className}`}
    >
      {label}
    </button>
  );
}
