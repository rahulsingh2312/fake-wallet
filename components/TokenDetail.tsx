"use client";

import { useState } from "react";
import {
  pct,
  qty,
  usd,
  usdDelta,
  usdDeltaPrecise,
  usdPrice,
} from "@/lib/format";
import {
  tokenChangePct,
  tokenChangeUsd,
  tokenPrice,
  tokenValue,
  useWallet,
} from "@/lib/store";
import type { Token } from "@/lib/types";
import { DotsIcon, QrIcon, SendIcon, ShareIcon, VerifiedBadge } from "./icons";
import { Sheet, Sparkline, TokenLogo } from "./ui";

const RANGES = ["1H", "1D", "1W", "1M", "YTD", "ALL"] as const;

/** Stable "N people here" per token, so it doesn't flicker between renders. */
function peopleHere(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 40 + (h % 460);
}

export function TokenDetail({
  token,
  onClose,
}: {
  token: Token | null;
  onClose: () => void;
}) {
  const { prices } = useWallet();
  const [range, setRange] = useState<(typeof RANGES)[number]>("1D");
  const [following, setFollowing] = useState(false);

  if (!token) return null;

  const price = tokenPrice(token, prices);
  const changePct = tokenChangePct(token, prices);
  const down = changePct < 0;
  const priceDelta = price - price / (1 + changePct / 100);
  const value = tokenValue(token, prices);
  const holdingDelta = tokenChangeUsd(token, prices);
  const people = peopleHere(token.id);

  return (
    <Sheet open={!!token} onClose={onClose} full>
      {/* ------------------------------- header ------------------------------ */}
      <div className="flex shrink-0 items-center gap-[13px] bg-ph-bg px-[21px] pb-[12px] pt-[2px]">
        <TokenLogo
          src={token.image}
          name={token.name}
          size={40}
          chain={token.chain}
          symbol={token.symbol}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[21px] font-bold leading-[1.2] tracking-[-0.01em]">
              {token.name}
            </span>
            {token.verified && (
              <VerifiedBadge className="h-[15px] w-[15px] shrink-0" />
            )}
          </div>
          <div className="mt-[1px] flex items-center gap-[6px] text-[16px] text-ph-mute">
            <span className="h-[7px] w-[7px] rounded-full bg-ph-green" />
            {people} people here
          </div>
        </div>

        <button
          onClick={() => setFollowing((f) => !f)}
          className={`h-[41px] shrink-0 rounded-full px-[15px] text-[16px] font-medium active:opacity-70 ${
            following ? "bg-ph-purple text-black" : "bg-[#191919] text-white"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
        <button
          aria-label="Share"
          className="grid h-[41px] w-[41px] shrink-0 place-items-center rounded-full bg-[#191919] active:opacity-70"
        >
          <ShareIcon className="h-[18px] w-[18px] text-white" />
        </button>
      </div>

      {/* ------------------------------- scroller ---------------------------- */}
      <div className="no-scrollbar flex-1 overflow-y-auto px-[21px] pb-[110px]">
        <div className="tnum mt-[10px] text-[45px] font-bold leading-[1.08] tracking-[-0.025em]">
          {usdPrice(price)}
        </div>
        <div className="mt-[4px] flex items-center gap-[7px]">
          <span
            className={`tnum text-[19px] font-medium leading-[1.2] ${
              down ? "text-ph-red" : "text-ph-green"
            }`}
          >
            {usdDeltaPrecise(priceDelta)}
          </span>
          <span
            className={`tnum rounded-[6px] px-[5px] py-[1px] text-[19px] font-medium leading-[1.15] text-white ${
              down ? "bg-ph-red-badge" : "bg-[#17a761]"
            }`}
          >
            {down ? "" : "+"}
            {pct(changePct)}
          </span>
        </div>

        <Sparkline
          seed={token.id + range}
          changePct={changePct}
          points={range === "1H" ? 34 : range === "1D" ? 64 : 90}
          rightInset={33}
          className="-mx-[21px] mt-[18px] h-[190px] w-[calc(100%+42px)]"
        />

        <div className="mt-[14px] flex items-center justify-between">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`rounded-[10px] px-[11px] py-[6px] text-[16px] font-medium transition-colors ${
                r === range
                  ? "bg-[#191919] text-ph-purple"
                  : "text-[#8e9296] active:opacity-60"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="mt-[22px] grid grid-cols-3 gap-[13px]">
          <Action icon={<SendIcon className="h-[23px] w-[23px]" />} label="Send" />
          <Action icon={<QrIcon className="h-[23px] w-[23px]" />} label="Receive" />
          <Action icon={<DotsIcon className="h-[20px] w-[20px]" />} label="More" />
        </div>

        {/* -------------------------------- chat ------------------------------ */}
        <div className="mt-[22px] flex h-[72px] items-center gap-[11px] rounded-[16px] bg-ph-card px-[16px]">
          <div className="flex -space-x-3">
            {["#6ee7b7", "#c4b5fd", "#fb923c"].map((c, i) => (
              <span
                key={c}
                className="grid h-[32px] w-[32px] place-items-center rounded-full border-[2px] border-ph-card text-[14px]"
                style={{ background: c, zIndex: 3 - i }}
              >
                {["😎", "🧠", "🧢"][i]}
              </span>
            ))}
          </div>
          <span className="text-[17px] font-medium text-white">
            {3 + (people % 5)} chatting...
          </span>
          <button className="ml-auto shrink-0 rounded-full bg-[#232323] px-[15px] py-[9px] text-[16px] font-medium active:opacity-70">
            Join Chat
          </button>
        </div>

        {/* ------------------------------ position ---------------------------- */}
        <div className="mb-[14px] mt-[32px] flex items-center gap-[5px]">
          <h3 className="text-[24px] font-bold leading-[1.2] tracking-[-0.015em]">Position</h3>
          <svg viewBox="0 0 24 24" fill="none" className="mt-[2px] h-[17px] w-[17px]">
            <path
              d="M9 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-[13px]">
          <Stat label="Value" value={usd(value)} />
          <Stat label="Balance" value={qty(token.quantity, token.symbol)} />
          <Stat
            label="24h Change"
            value={usdDelta(holdingDelta)}
            tone={holdingDelta < 0 ? "red" : "green"}
          />
          <Stat
            label="Unrealized Return"
            value={usdDelta(holdingDelta * 0.0136 + holdingDelta)}
            tone={holdingDelta < 0 ? "red" : "green"}
          />
        </div>

        {/* --------------------------- native stakes -------------------------- */}
        <h3 className="mb-[12px] mt-[32px] text-[17px] font-medium text-ph-mute">
          Native Stakes
        </h3>
        <div className="overflow-hidden rounded-[18px] bg-ph-card p-[18px]">
          <div className="text-[16px] font-medium text-white">
            Stake with Phantom
          </div>
          <div className="mt-[3px] text-[21px] font-bold leading-[1.25]">
            Earn <span className="text-ph-green">5.96% APY</span> per year*
          </div>

          <svg viewBox="0 0 320 140" className="mt-[14px] h-[112px] w-full">
            <defs>
              <linearGradient id="stakeFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#21de7f" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#21de7f" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M8 130 C 110 128, 200 100, 300 12 L300 132 L8 132 Z"
              fill="url(#stakeFill)"
            />
            <path
              d="M8 130 C 110 128, 200 100, 300 12"
              fill="none"
              stroke="#5fd6a0"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="11 11"
            />
          </svg>

          <div className="mt-4 grid grid-cols-2 gap-[13px]">
            <button className="rounded-full bg-[#232323] py-[13px] text-[16px] font-medium active:opacity-70">
              Learn More
            </button>
            <button className="rounded-full bg-[#3ee98a] py-[13px] text-[16px] font-medium text-black active:opacity-80">
              Start Earning
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------ buy / sell --------------------------- */}
      <div className="safe-b pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/95 to-transparent pb-[14px] pt-8">
        <div className="pointer-events-auto grid grid-cols-2 gap-[13px] px-4">
          <button className="rounded-full bg-ph-purple py-[14px] text-[18px] font-medium text-black active:opacity-80">
            Buy
          </button>
          <button className="rounded-full bg-ph-purple py-[14px] text-[18px] font-medium text-black active:opacity-80">
            Sell
          </button>
        </div>
      </div>
    </Sheet>
  );
}

function Action({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-[7px] rounded-[16px] bg-ph-card py-[15px] active:opacity-70">
      <span className="text-ph-purple">{icon}</span>
      <span className="text-[16px] font-medium text-white">{label}</span>
    </button>
  );
}

function Stat({
  label,
  value,
  tone = "white",
}: {
  label: string;
  value: string;
  tone?: "white" | "green" | "red";
}) {
  const color =
    tone === "green"
      ? "text-ph-green"
      : tone === "red"
        ? "text-ph-red"
        : "text-white";
  return (
    <div className="rounded-[16px] bg-ph-card px-[16px] py-[13px]">
      <div className="text-[16px] text-ph-mute">{label}</div>
      <div className={`tnum mt-[3px] text-[19px] font-medium ${color}`}>
        {value}
      </div>
    </div>
  );
}
