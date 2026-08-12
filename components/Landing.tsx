"use client";

import { useState } from "react";
import { TourButton } from "./Tour";

const REPO = "https://github.com/rahulsingh2312/fake-wallet";
const URL = "fakewalletz.vercel.app";

/** Frosted panel with a top sheen, used for every raised block on the page. */
function Glass({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] border border-white/[0.09] bg-white/[0.035] backdrop-blur-xl ${className}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.06] to-transparent"
      />
      <div className="relative">{children}</div>
    </div>
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
      <span className="reveal reveal-1 font-mono text-[11px] uppercase tracking-[0.22em] text-white/40">
        up only, allegedly
      </span>

      <h1 className="reveal reveal-2 mt-[26px] font-display text-[78px] font-bold leading-[0.86] tracking-[-0.048em] text-white">
        larp
        <br />
        wallet<span className="text-ph-purple">.</span>
      </h1>

      <p className="reveal reveal-3 mt-[26px] font-display text-[27px] leading-[1.22] tracking-[-0.022em] text-white/92">
        your portfolio, <em className="not-italic text-ph-purple">exactly</em>{" "}
        <em className="italic">as big as you say it is.</em>
      </p>

      <p className="reveal reveal-4 mt-[17px] text-[16.5px] leading-[1.62] text-white/50">
        the real phantom ui, measured to the pixel. real prices off jupiter, so
        the bag <em className="italic text-white/70">moves on its own</em>. the
        gains are imaginary. the screenshot is not.
      </p>

      <div className="reveal reveal-5 mt-[32px] flex flex-wrap items-center gap-[10px]">
        <button
          onClick={copy}
          className="group inline-flex items-center gap-[10px] rounded-full bg-ph-purple px-[19px] py-[12px] text-[15px] font-medium text-black shadow-[0_10px_30px_-8px_rgba(171,159,242,0.6)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          <span className="font-mono">{copied ? "copied, go" : URL}</span>
          <span className="text-black/50">{copied ? "✓" : "copy"}</span>
        </button>
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-[7px] rounded-full border border-white/12 bg-white/[0.03] px-[19px] py-[12px] text-[15px] text-white/70 backdrop-blur-xl transition-colors hover:border-white/30 hover:text-white"
        >
          github <span className="text-white/35">↗</span>
        </a>
      </div>

      <p className="reveal reveal-6 mt-[18px] text-[13.5px] leading-[1.55] text-white/32">
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
    t: "put it on your phone",
    d: "add to home screen. android offers properly, iphone hides it in the safari share sheet like it is ashamed.",
  },
  {
    n: "02",
    t: "tap the balance five times",
    d: "fast. there is no settings button anywhere in this app, and that is not an oversight.",
  },
  {
    n: "03",
    t: "become extremely wealthy",
    d: "type a name, a logo, an amount. or paste a solana mint and jupiter fills the rest in, live, so your fake bag has real volatility.",
  },
];

export function LandingRight() {
  return (
    <div className="flex max-w-[400px] flex-col">
      <span className="reveal reveal-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
        three steps to generational wealth
      </span>

      <ol className="mt-[22px] flex flex-col gap-[10px]">
        {STEPS.map((s, i) => (
          <li key={s.n} className={`reveal reveal-${i + 4}`}>
            <Glass className="p-[17px]">
              <div className="flex gap-[14px]">
                <span className="mt-[2px] font-mono text-[12px] tabular-nums text-ph-purple">
                  {s.n}
                </span>
                <span>
                  <span className="block text-[16.5px] font-medium tracking-[-0.012em] text-white">
                    {s.t}
                  </span>
                  <span className="mt-[5px] block text-[14px] leading-[1.58] text-white/45">
                    {s.d}
                  </span>
                </span>
              </div>
            </Glass>
          </li>
        ))}
      </ol>

      <div className="reveal reveal-7 mt-[16px]">
        <Glass className="p-[18px]">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/35">
            the fine print
          </span>
          <p className="mt-[10px] text-[14px] leading-[1.62] text-white/45">
            no seed phrase, no keys, no wallet connection. it cannot send,
            receive or sign a single thing.{" "}
            <em className="italic text-white/70">
              it is a screenshot machine with excellent taste.
            </em>
          </p>
        </Glass>
      </div>
    </div>
  );
}

/* ---------------------------------- bars --------------------------------- */

export function LandingTopBar() {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden items-center justify-between px-[38px] py-[26px] lg:flex">
      <span className="pointer-events-auto font-display text-[17px] font-bold tracking-[-0.03em] text-white">
        larpwallet<span className="text-ph-purple">.</span>
      </span>
      <nav className="pointer-events-auto flex items-center gap-[22px] text-[14px] text-white/45">
        <a
          href={REPO}
          target="_blank"
          rel="noreferrer"
          className="transition-colors hover:text-white"
        >
          source
        </a>
        <TourButton />
        <span className="italic text-white/25">deeply unofficial</span>
      </nav>
    </header>
  );
}

export function LandingFooter() {
  return (
    <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-20 hidden justify-between px-[38px] py-[24px] text-[12.5px] text-white/25 lg:flex">
      <span>a ui clone for mockups and content. not affiliated with phantom.</span>
      <span className="font-mono italic">fake it till u make it</span>
    </footer>
  );
}
