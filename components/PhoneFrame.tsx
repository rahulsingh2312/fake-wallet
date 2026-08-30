"use client";

import { useEffect, useState } from "react";

/**
 * On phones this is a plain full-height container and the wallet fills the
 * screen. From `lg` up it becomes an iPhone-style device: titanium rail,
 * Dynamic Island, status bar.
 *
 * The `lg:[transform:translateZ(0)]` matters more than it looks. It makes the
 * frame a containing block, so every `position: fixed` element inside the
 * wallet (bottom bar, sheets, drawer, editor) anchors to the phone instead of
 * escaping to the browser viewport.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  // The device is authored at a fixed 432x892 so the wallet inside always
  // renders at exactly 412 css px, which is what every metric was matched to.
  // Short desktop windows scale the whole device instead of squashing it.
  // The 212px budget is the sticky nav plus the hero card's vertical padding.
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const fit = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) return setScale(1);
      setScale(Math.min(1, (window.innerHeight - 212) / 892));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  return (
    <div
      className="relative lg:h-[calc(892px*var(--s))] lg:w-[calc(432px*var(--s))] lg:shrink-0"
      style={{ "--s": scale } as React.CSSProperties}
    >
      {/* glow, so the phone reads as the light source on the page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-24 hidden lg:block"
        style={{
          background:
            "radial-gradient(closest-side, rgba(171,159,242,0.20), rgba(171,159,242,0.05) 55%, transparent 75%)",
        }}
      />

      <div
        className={[
          "relative",
          // device shell
          "lg:absolute lg:left-0 lg:top-0 lg:h-[892px] lg:w-[432px] lg:origin-top-left lg:rounded-[60px] lg:p-[10px]",
          "lg:[transform:scale(var(--s))]",
          "lg:bg-[linear-gradient(158deg,#b4b4bd_0%,#6b6b74_8%,#3a3a42_24%,#2a2a31_50%,#3a3a42_74%,#74747e_92%,#bcbcc6_100%)]",
          "lg:shadow-[0_0_0_1px_rgba(255,255,255,0.16)_inset,0_1.5px_1px_rgba(255,255,255,0.30)_inset,0_-1px_1px_rgba(0,0,0,0.5)_inset,0_50px_110px_-28px_rgba(0,0,0,0.95),0_0_90px_-30px_rgba(171,159,242,0.45)]",
        ].join(" ")}
      >
        {/* side buttons */}
        <span className="absolute -left-[3px] top-[132px] hidden h-[26px] w-[3px] rounded-l-sm bg-[#4a4a50] lg:block" />
        <span className="absolute -left-[3px] top-[186px] hidden h-[52px] w-[3px] rounded-l-sm bg-[#4a4a50] lg:block" />
        <span className="absolute -left-[3px] top-[252px] hidden h-[52px] w-[3px] rounded-l-sm bg-[#4a4a50] lg:block" />
        <span className="absolute -right-[3px] top-[212px] hidden h-[84px] w-[3px] rounded-r-sm bg-[#4a4a50] lg:block" />

        {/* screen */}
        <div
          className={[
            "relative isolate bg-black",
            "lg:h-full lg:overflow-hidden lg:rounded-[50px] lg:shadow-[0_0_0_1px_rgba(255,255,255,0.14),0_0_0_3px_#000]",
            "lg:[transform:translateZ(0)]",
            "lg:[--status-h:44px] lg:[--safe-b:22px]",
          ].join(" ")}
        >
          <StatusBar />
          <div className="ptr-scroll no-scrollbar lg:h-full lg:overflow-y-auto">
            {children}
          </div>

          {/* home indicator */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-[8px] left-1/2 z-40 hidden h-[5px] w-[136px] -translate-x-1/2 rounded-full bg-white/85 lg:block"
          />

          {/* Dynamic Island */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[11px] z-40 hidden h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black lg:block"
          >
            <span className="absolute right-[11px] top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full bg-[#0d0d12]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: false,
        })
      );
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-40 hidden h-[44px] items-center justify-between px-[26px] text-white lg:flex">
      <span className="text-[15px] font-medium tabular-nums">
        {time || " "}
      </span>
      <span className="flex items-center gap-[6px]">
        {/* signal */}
        <svg viewBox="0 0 18 12" className="h-[11px] w-[17px]" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="4.7" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="9.4" y="3" width="3" height="9" rx="1" />
          <rect x="14.1" y="0" width="3" height="12" rx="1" opacity="0.35" />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 16 12" className="h-[11px] w-[15px]" fill="currentColor">
          <path d="M8 11.2 5.6 8.6a3.5 3.5 0 0 1 4.8 0L8 11.2z" />
          <path
            d="M3.4 6.3a6.7 6.7 0 0 1 9.2 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <path
            d="M1 3.6a10.3 10.3 0 0 1 14 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
        {/* battery */}
        <span className="flex items-center">
          <span className="relative h-[11px] w-[22px] rounded-[3px] border border-white/40">
            <span className="absolute inset-[1.5px] right-[6px] rounded-[1px] bg-white" />
          </span>
          <span className="ml-[1px] h-[4px] w-[1.5px] rounded-r-sm bg-white/40" />
        </span>
      </span>
    </div>
  );
}
