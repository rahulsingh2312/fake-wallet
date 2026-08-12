"use client";

import { useEffect, useState } from "react";
import type { ChainBadge } from "@/lib/types";

/* ------------------------------- token logo ------------------------------- */

/**
 * Chain marks, drawn inline in a single dark tone. Phantom puts these in a
 * white squircle on the token logo's bottom-right — but only for tokens that
 * are *not* native to that chain (SOL, ETH and POL carry no badge).
 */
const CHAIN_MARKS: Record<Exclude<ChainBadge, "none">, React.ReactNode> = {
  solana: (
    <svg viewBox="0 0 398 312" className="h-[62%] w-[62%]" fill="#111">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" />
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" />
      <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.6z" />
    </svg>
  ),
  ethereum: (
    <svg viewBox="0 0 24 24" className="h-[64%] w-[64%]" fill="#111">
      <path d="M12 1.5 5.2 12.2 12 16.1l6.8-3.9L12 1.5z" />
      <path d="M12 17.5 5.2 13.6 12 22.5l6.8-8.9-6.8 3.9z" />
    </svg>
  ),
  polygon: (
    <svg viewBox="0 0 38 33" className="h-[72%] w-[72%]" fill="#111">
      <path d="M29 10.2c-.7-.4-1.6-.4-2.4 0L21 13.5l-3.8 2.1-5.5 3.3c-.7.4-1.6.4-2.4 0L5 16.3c-.7-.4-1.2-1.2-1.2-2.1v-5c0-.8.4-1.6 1.2-2.1l4.3-2.5c.7-.4 1.6-.4 2.4 0L16 7.2c.7.4 1.2 1.2 1.2 2.1v3.3l3.8-2.2V7c0-.8-.4-1.6-1.2-2.1l-8-4.7c-.7-.4-1.6-.4-2.4 0L1.2 5C.4 5.4 0 6.2 0 7v9.4c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l5.5-3.2 3.8-2.2 5.5-3.2c.7-.4 1.6-.4 2.4 0l4.3 2.5c.7.4 1.2 1.2 1.2 2.1v5c0 .8-.4 1.6-1.2 2.1L29 28.8c-.7.4-1.6.4-2.4 0l-4.3-2.5c-.7-.4-1.2-1.2-1.2-2.1V21l-3.8 2.2v3.3c0 .8.4 1.6 1.2 2.1l8.1 4.7c.7.4 1.6.4 2.4 0l8.1-4.7c.7-.4 1.2-1.2 1.2-2.1V17c0-.8-.4-1.6-1.2-2.1L29 10.2z" />
    </svg>
  ),
  base: (
    <svg viewBox="0 0 24 24" className="h-[62%] w-[62%]" fill="#111">
      <path d="M11.6 2.5c5.2 0 9.4 4.3 9.4 9.5s-4.2 9.5-9.4 9.5c-4.9 0-8.9-3.8-9.4-8.6h12.5v-1.8H2.2c.5-4.8 4.5-8.6 9.4-8.6z" />
    </svg>
  ),
  bitcoin: (
    <span className="text-[#111]" style={{ fontSize: "62%", fontWeight: 800 }}>
      ₿
    </span>
  ),
  sui: (
    <svg viewBox="0 0 24 24" className="h-[64%] w-[64%]" fill="#111">
      <path d="M12 2.2 6.6 10.4a6.6 6.6 0 1 0 10.8 0L12 2.2zm0 4.1 3.6 5.4a4.4 4.4 0 1 1-7.2 0L12 6.3z" />
    </svg>
  ),
};

/**
 * Phantom draws the Solana badge as a chunky squircle, and the EVM chain
 * badges as smaller circles.
 */
const BADGE_STYLE: Record<
  Exclude<ChainBadge, "none">,
  { scale: number; radius: number }
> = {
  solana: { scale: 0.56, radius: 0.32 },
  base: { scale: 0.56, radius: 0.32 },
  sui: { scale: 0.56, radius: 0.32 },
  polygon: { scale: 0.45, radius: 0.5 },
  ethereum: { scale: 0.45, radius: 0.5 },
  bitcoin: { scale: 0.45, radius: 0.5 },
};

/** A token native to its own chain never gets a badge (SOL, ETH, POL, BTC). */
const NATIVE_SYMBOLS: Partial<Record<Exclude<ChainBadge, "none">, string[]>> = {
  solana: ["SOL"],
  ethereum: ["ETH"],
  polygon: ["POL", "MATIC"],
  bitcoin: ["BTC"],
  sui: ["SUI"],
};

/** Small chain marker on the logo's bottom-right, like Phantom's. */
function ChainDot({
  chain,
  size,
  symbol,
}: {
  chain: ChainBadge;
  size: number;
  symbol?: string;
}) {
  if (chain === "none") return null;
  if (NATIVE_SYMBOLS[chain]?.includes((symbol ?? "").toUpperCase())) return null;

  const { scale, radius } = BADGE_STYLE[chain];
  const d = Math.round(size * scale);
  return (
    <span
      className="absolute -bottom-[4px] -right-px grid place-items-center border-[2.5px] border-black bg-white"
      style={{ width: d, height: d, borderRadius: d * radius, fontSize: d }}
    >
      {CHAIN_MARKS[chain]}
    </span>
  );
}

export function TokenLogo({
  src,
  name,
  size = 56,
  chain = "none",
  symbol,
  className = "",
}: {
  src: string;
  name: string;
  size?: number;
  chain?: ChainBadge;
  /** Used to suppress the badge on a chain's own native token */
  symbol?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {src && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover"
          onError={() => setFailed(true)}
          draggable={false}
        />
      ) : (
        <div
          className="grid h-full w-full place-items-center rounded-full bg-ph-card-2 font-medium text-ph-mute"
          style={{ fontSize: size * 0.4 }}
        >
          {name.slice(0, 1).toUpperCase()}
        </div>
      )}
      <ChainDot chain={chain} size={size} symbol={symbol} />
    </div>
  );
}

/* --------------------------------- avatar --------------------------------- */

export function Avatar({
  emoji,
  name,
  size = 44,
}: {
  emoji: string;
  name: string;
  size?: number;
}) {
  if (emoji) {
    return (
      <span
        className="grid shrink-0 place-items-center"
        style={{ width: size, height: size, fontSize: size * 0.78 }}
      >
        {emoji}
      </span>
    );
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-ph-card-2 font-medium text-ph-mute"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

/* ------------------------------- bottom sheet ------------------------------ */

export function Sheet({
  open,
  onClose,
  children,
  full = false,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Full-height sheet (token detail) vs. content-height (accounts) */
  full?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="anim-fade absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        className={`anim-sheet absolute inset-x-0 bottom-0 flex flex-col overflow-hidden rounded-t-[28px] bg-ph-bg ${
          full
            ? "top-[calc(env(safe-area-inset-top,0px)+var(--status-h,0px)+12px)]"
            : "max-h-[88vh]"
        }`}
      >
        <div className="flex shrink-0 justify-center pb-1 pt-2.5">
          <div className="h-[5px] w-[38px] rounded-full bg-[#4a4a4f]" />
        </div>
        {children}
      </div>
    </div>
  );
}

/* -------------------------------- sparkline ------------------------------- */

/** Deterministic PRNG so a token's chart is stable across re-renders. */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Stepped price line, matching Phantom's chart: a stair-stepped random walk
 * pinned so that (last - first) / first equals the token's 24h change.
 */
export function Sparkline({
  seed,
  changePct,
  points = 64,
  width = 360,
  height = 190,
  rightInset = 0,
  className = "",
}: {
  seed: string;
  changePct: number;
  points?: number;
  width?: number;
  height?: number;
  /** Blank space kept to the right of the final point, in viewBox units. */
  rightInset?: number;
  className?: string;
}) {
  const up = changePct >= 0;
  const color = up ? "#21de7f" : "#ff3b46";

  // Phantom's line holds flat for long stretches, then jumps. A plain random
  // walk reads as a comb, so most ticks hold and a few move hard.
  const rand = mulberry(hash(seed + points));
  const raw: number[] = [];
  let v = 0;
  for (let i = 0; i < points; i++) {
    const r = rand();
    if (r < 0.34) {
      /* hold */
    } else if (r > 0.93) {
      v += (rand() - 0.5) * 6.5;
    } else {
      v += (rand() - 0.5) * 1.5;
    }
    raw.push(v);
  }
  // Detrend, then re-apply the true drift so the endpoints tell the truth.
  const first = raw[0];
  const last = raw[raw.length - 1];
  const detrended = raw.map(
    (x, i) => x - (first + ((last - first) * i) / (points - 1))
  );
  const amp = Math.max(...detrended.map(Math.abs)) || 1;
  const drift = Math.max(Math.min(changePct / 100, 0.9), -0.9);
  const series = detrended.map(
    (x, i) => 1 + (x / amp) * 0.06 + drift * (i / (points - 1))
  );

  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const padY = 12;
  const usable = height - padY * 2;
  const x = (i: number) => (i / (points - 1)) * (width - 6 - rightInset) + 3;
  const y = (val: number) => padY + (1 - (val - min) / span) * usable;

  // Stair-step path
  let d = `M ${x(0)} ${y(series[0])}`;
  for (let i = 1; i < points; i++) {
    d += ` H ${x(i)} V ${y(series[i])}`;
  }

  const endX = x(points - 1);
  const endY = y(series[points - 1]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={endX} cy={endY} r="4.5" fill={color} />
    </svg>
  );
}
