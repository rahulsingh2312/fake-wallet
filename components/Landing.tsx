"use client";

import { useState } from "react";
import { TourButton } from "./Tour";

const REPO = "https://github.com/rahulsingh2312/fake-wallet";
const URL = "fakewallet.fun";

/** Raised card on the paper background. Used for every block on the page. */
function Card({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-fw-line bg-white/85 shadow-[0_1px_2px_rgba(20,16,25,0.04),0_12px_28px_-18px_rgba(76,29,149,0.28)] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

/** The cat, at whatever size the slot needs. */
export function CatMark({
  size = 30,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/brand/cat-mark.svg"
      alt=""
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}

/* --------------------------------- left ---------------------------------- */

export function LandingLeft() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${URL}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked, the url is on screen anyway */
    }
  };

  return (
    <div className="flex max-w-[440px] flex-col items-start">
      <span className="reveal reveal-1 font-mono text-[11px] uppercase tracking-[0.22em] text-fw-mute">
        up only, allegedly
      </span>

      <h1 className="reveal reveal-2 mt-[26px] font-display text-[78px] font-bold leading-[0.86] tracking-[-0.048em] text-fw-ink">
        fake
        <br />
        wallet<span className="fw-grad-text">.</span>
      </h1>

      <p className="reveal reveal-3 mt-[26px] font-display text-[27px] leading-[1.22] tracking-[-0.022em] text-fw-ink">
        your portfolio, <em className="fw-grad-text not-italic">exactly</em>{" "}
        <em className="italic">as big as you say it is.</em>
      </p>

      <p className="reveal reveal-4 mt-[17px] text-[16.5px] leading-[1.62] text-fw-mute">
        a wallet ui measured to the pixel, with real prices off jupiter, so the
        bag <em className="italic text-fw-ink-2">moves on its own</em>. the gains
        are imaginary. the screenshot is not.
      </p>

      <div className="reveal reveal-5 mt-[32px] flex flex-wrap items-center gap-[10px]">
        <button
          onClick={copy}
          className="fw-btn-grad group inline-flex items-center gap-[10px] rounded-full px-[19px] py-[12px] text-[15px] font-medium transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          <span className="font-mono">{copied ? "copied, go" : URL}</span>
          <span className="text-[#16161c]/45">{copied ? "✓" : "copy"}</span>
        </button>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-[7px] rounded-full border border-fw-line bg-white/70 px-[19px] py-[12px] text-[15px] text-fw-ink-2 backdrop-blur-xl transition-colors hover:border-fw-violet/40 hover:text-fw-ink"
        >
          github <span className="text-fw-mute">↗</span>
        </a>
      </div>

      <p className="reveal reveal-6 mt-[18px] text-[13.5px] leading-[1.55] text-fw-mute">
        open it on your phone, add to home screen, and it goes fullscreen with
        no browser bars. your camera roll will never know.
      </p>
    </div>
  );
}

/* --------------------------------- right --------------------------------- */

const STEPS = [
  {
    n: "01",
    icon: "/brand/step-1.svg",
    t: "put it on your phone",
    d: "add to home screen. android offers properly, iphone hides it in the safari share sheet like it is ashamed.",
  },
  {
    n: "02",
    icon: "/brand/step-2.svg",
    t: "tap the balance five times",
    d: "fast. there is no settings button anywhere in this app, and that is not an oversight.",
  },
  {
    n: "03",
    icon: "/brand/step-3.svg",
    t: "become extremely wealthy",
    d: "type a name, a logo, an amount. or paste a solana mint and jupiter fills the rest in, live, so your fake bag has real volatility.",
  },
];

export function LandingRight() {
  return (
    <div className="flex max-w-[400px] flex-col">
      <span className="reveal reveal-3 font-mono text-[11px] uppercase tracking-[0.2em] text-fw-mute">
        three steps to generational wealth
      </span>

      <ol className="mt-[22px] flex flex-col gap-[10px]">
        {STEPS.map((s, i) => (
          <li key={s.n} className={`reveal reveal-${i + 4}`}>
            <Card className="p-[15px]">
              <div className="flex items-center gap-[14px]">
                <img
                  src={s.icon}
                  alt=""
                  width={64}
                  height={64}
                  className="h-[64px] w-[64px] shrink-0"
                />
                <span>
                  <span className="flex items-baseline gap-[8px]">
                    <span className="font-mono text-[11px] tabular-nums text-fw-violet">
                      {s.n}
                    </span>
                    <span className="text-[16.5px] font-medium tracking-[-0.012em] text-fw-ink">
                      {s.t}
                    </span>
                  </span>
                  <span className="mt-[4px] block text-[13.5px] leading-[1.55] text-fw-mute">
                    {s.d}
                  </span>
                </span>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <div className="reveal reveal-7 mt-[16px]">
        <Card className="p-[18px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fw-mute">
            the fine print
          </span>
          <p className="mt-[10px] text-[14px] leading-[1.62] text-fw-mute">
            no seed phrase, no keys, no wallet connection. it cannot send,
            receive or sign a single thing.{" "}
            <em className="italic text-fw-ink-2">
              it is a screenshot machine with excellent taste.
            </em>
          </p>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------- bars --------------------------------- */

export function LandingTopBar() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden items-center justify-between px-[38px] py-[26px] lg:flex">
      <span className="pointer-events-auto flex items-center gap-[9px] font-display text-[17px] font-bold tracking-[-0.03em] text-fw-ink">
        <CatMark size={26} />
        fakewallet<span className="fw-grad-text -ml-[7px]">.</span>
      </span>
      <nav className="pointer-events-auto flex items-center gap-[22px] text-[14px] text-fw-mute">
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-fw-ink"
        >
          source
        </a>
        <TourButton />
        <a href="/brand" className="transition-colors hover:text-fw-ink">
          brand
        </a>
        <span className="italic text-fw-mute/60">deeply unofficial</span>
      </nav>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden justify-between px-[38px] py-[24px] text-[12.5px] text-fw-mute/70 lg:flex">
      <span>a ui clone for mockups and content. not affiliated with any wallet.</span>
      <span className="font-mono italic">fake it till u make it</span>
    </footer>
  );
}
