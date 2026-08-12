"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Drag distance needed to arm the refresh. */
const THRESHOLD = 68;
/** How far the content can be dragged, after damping. */
const MAX = 96;
/** Keep the spinner up at least this long so a fast refresh still reads. */
const MIN_SPIN = 550;

export function PullToRefresh({
  onRefresh,
  children,
}: {
  onRefresh: () => void | Promise<void>;
  children: React.ReactNode;
}) {
  const [offset, setOffset] = useState(0);
  const [busy, setBusy] = useState(false);
  const [settling, setSettling] = useState(false);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const busyRef = useRef(false);

  const setPull = useCallback((v: number) => {
    offsetRef.current = v;
    setOffset(v);
  }, []);

  const run = useCallback(async () => {
    busyRef.current = true;
    setBusy(true);
    setSettling(true);
    setPull(THRESHOLD);

    const started = Date.now();
    try {
      await onRefresh();
      // Also pick up a newer deploy, since an installed PWA has no reload button.
      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.getRegistration();
        await reg?.update().catch(() => {});
      }
    } catch {
      /* a failed refresh should still release the spinner */
    }
    const wait = Math.max(0, MIN_SPIN - (Date.now() - started));
    window.setTimeout(() => {
      setPull(0);
      setBusy(false);
      busyRef.current = false;
      window.setTimeout(() => setSettling(false), 320);
    }, wait);
  }, [onRefresh, setPull]);

  useEffect(() => {
    // On phones the document scrolls; inside the desktop device frame an inner
    // element does. Pull only when whichever one it is sits at the top.
    const scrollTop = () => {
      const el = hostRef.current?.closest<HTMLElement>(".ptr-scroll");
      return el ? el.scrollTop : window.scrollY;
    };
    const canPull = () =>
      scrollTop() <= 0 &&
      !busyRef.current &&
      // A sheet or the editor is open on top of the wallet.
      document.body.style.overflow !== "hidden";

    const onStart = (e: TouchEvent) => {
      startY.current = canPull() ? e.touches[0].clientY : null;
    };

    const onMove = (e: TouchEvent) => {
      if (startY.current === null) return;
      const dy = e.touches[0].clientY - startY.current;
      if (dy <= 0) {
        if (offsetRef.current !== 0) setPull(0);
        return;
      }
      if (scrollTop() > 0) {
        startY.current = null;
        setPull(0);
        return;
      }
      // Non-passive listener, so this actually suppresses the rubber band.
      e.preventDefault();
      // Damped so the pull gets heavier the further it goes.
      setPull(Math.min(MAX, dy * 0.55));
    };

    const onEnd = () => {
      if (startY.current === null) return;
      startY.current = null;
      if (offsetRef.current >= THRESHOLD) {
        void run();
      } else if (offsetRef.current > 0) {
        setSettling(true);
        setPull(0);
        window.setTimeout(() => setSettling(false), 320);
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    window.addEventListener("touchcancel", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
      window.removeEventListener("touchcancel", onEnd);
    };
  }, [run, setPull]);

  const progress = Math.min(1, offset / THRESHOLD);
  const armed = progress >= 1;
  const ease = settling
    ? "transform 300ms cubic-bezier(0.32, 0.72, 0, 1)"
    : "none";

  return (
    <div ref={hostRef} className="relative">
      {/* revealed in the gap that opens below the header as content slides down */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 flex justify-center overflow-hidden"
        style={{
          height: offset,
          opacity: offset > 4 ? 1 : 0,
          transition: ease,
        }}
      >
        <span
          className="mt-[10px] grid h-[26px] w-[26px] place-items-center"
          style={{
            transform: `scale(${0.45 + progress * 0.55})`,
            opacity: 0.25 + progress * 0.75,
          }}
        >
          <svg
            viewBox="0 0 512 512"
            className={`h-full w-full ${busy ? "animate-ghost-bob" : ""}`}
            style={busy ? undefined : { transform: `rotate(${offset * 2}deg)` }}
          >
            <path d="M9 402.313C9 458.146 37.7123 471 67.5731 471C130.74 471 178.211 413.56 206.541 368.171C203.095 378.212 201.181 388.254 201.181 397.895C201.181 424.405 215.729 443.284 244.441 443.284C283.872 443.284 325.984 407.133 347.805 368.171C346.274 373.794 345.508 379.016 345.508 383.836C345.508 402.313 355.462 413.962 375.752 413.962C439.684 413.962 504 295.467 504 191.834C504 111.097 464.951 40 366.947 40C194.673 40 9 260.119 9 402.313ZM307.608 182.997C307.608 162.913 318.327 148.855 334.023 148.855C349.336 148.855 360.056 162.913 360.056 182.997C360.056 203.081 349.336 217.541 334.023 217.541C318.327 217.541 307.608 203.081 307.608 182.997ZM389.534 182.997C389.534 162.913 400.253 148.855 415.949 148.855C431.262 148.855 441.981 162.913 441.981 182.997C441.981 203.081 431.262 217.541 415.949 217.541C400.253 217.541 389.534 203.081 389.534 182.997Z" fill="#ab9ff2" />
          </svg>
        </span>
      </div>

      <div
        style={{
          transform: `translateY(${offset}px)`,
          transition: ease,
          willChange: armed || offset ? "transform" : undefined,
        }}
      >
        {children}
      </div>
    </div>
  );
}
