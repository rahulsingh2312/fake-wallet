"use client";

import { useRef } from "react";
import { qty, usd, usdDelta, pct } from "@/lib/format";
import {
  accountChangePct,
  accountChangeUsd,
  accountTotal,
  tokenChangeUsd,
  tokenValue,
  useWallet,
} from "@/lib/store";
import type { Token } from "@/lib/types";
import { CashIcon, ChevronDown, ChevronRight, VerifiedBadge } from "./icons";
import { TokenLogo } from "./ui";

export function HomeScreen({
  onAccounts,
  onToken,
  onSecret,
}: {
  onAccounts: () => void;
  onToken: (t: Token) => void;
  onSecret: () => void;
}) {
  const { account, prices } = useWallet();

  const total = accountTotal(account, prices);
  const change = accountChangeUsd(account, prices);
  const changePct = accountChangePct(account, prices);
  const down = change < 0;

  // Secret door: 5 taps on the balance within 1.5s.
  const taps = useRef<number[]>([]);
  const onBalanceTap = () => {
    const now = Date.now();
    taps.current = [...taps.current, now].filter((t) => now - t < 1500);
    if (taps.current.length >= 5) {
      taps.current = [];
      onSecret();
    }
  };

  return (
    <div className="px-[21px]">
      {/* ------------------------------ balance ------------------------------ */}
      <button
        onClick={onAccounts}
        className="mt-[21px] flex items-center gap-1 text-[18px] font-medium leading-[1.2] text-ph-mute active:opacity-60"
      >
        {account.name}
        <ChevronDown className="h-[17px] w-[17px]" />
      </button>

      <div
        onClick={onBalanceTap}
        className="tnum mt-[3px] cursor-default text-[45px] font-bold leading-[1.08] tracking-[-0.025em]"
      >
        {usd(total, { dust: false })}
      </div>

      <div className="mt-[8px] flex items-center gap-[7px]">
        <span
          className={`tnum text-[19px] font-semibold leading-[1.2] ${
            down ? "text-ph-red" : "text-ph-green"
          }`}
        >
          {usdDelta(change)}
        </span>
        <span
          className={`tnum rounded-[6px] px-[5px] py-[1px] text-[19px] font-semibold leading-[1.15] text-white ${
            down ? "bg-ph-red-badge" : "bg-[#17a761]"
          }`}
        >
          {down ? "" : "+"}
          {pct(changePct)}
        </span>
      </div>

      {/* -------------------------------- cash ------------------------------- */}
      <div className="mt-[32px] flex h-[62px] items-center gap-[16px] rounded-[16px] bg-ph-card px-[20px]">
        <CashIcon className="h-[18px] w-[30px]" />
        <span className="text-[18px] font-medium">Cash</span>
        <span className="tnum ml-auto text-[18px] font-medium">
          {usd(account.cash, { dust: false })}
        </span>
      </div>

      {/* ------------------------------- tokens ------------------------------ */}
      <SectionHeading label="Tokens" />

      <div className="flex flex-col gap-[18px]">
        {account.tokens.length === 0 && <EmptyRow label="No tokens yet" />}
        {account.tokens.map((t) => (
          <TokenRow key={t.id} token={t} onClick={() => onToken(t)} />
        ))}
      </div>

      {/* -------------------------------- perps ------------------------------ */}
      <SectionHeading label="Perps" />
      {account.perps.length === 0 ? (
        <EmptyRow label="No open positions" />
      ) : (
        <div className="no-scrollbar -mx-[21px] flex gap-[14px] overflow-x-auto px-[21px] pb-1">
          {account.perps.map((p) => (
            <div
              key={p.id}
              className="w-[168px] shrink-0 rounded-[16px] bg-ph-card p-[16px]"
            >
              <div className="flex items-center gap-2">
                <TokenLogo src={p.image} name={p.name} size={28} />
                <span className="truncate text-[16px] font-semibold">
                  {p.symbol}
                </span>
              </div>
              <div className="mt-[10px] flex items-center gap-2 text-[13px] font-semibold">
                <span
                  className={p.side === "long" ? "text-ph-green" : "text-ph-red"}
                >
                  {p.side === "long" ? "Long" : "Short"}
                </span>
                <span className="text-ph-mute">{p.leverage}x</span>
              </div>
              <div className="tnum mt-[6px] text-[20px] font-bold">
                {usd(p.value)}
              </div>
              <div
                className={`tnum text-[14px] font-semibold ${
                  p.pnl < 0 ? "text-ph-red" : "text-ph-green"
                }`}
              >
                {usdDelta(p.pnl)} ({pct(p.pnlPct)})
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="h-[110px]" />
    </div>
  );
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-[19px] mt-[32px] flex items-center gap-[5px]">
      <h2 className="text-[24px] font-bold leading-[1.2] tracking-[-0.015em]">
        {label}
      </h2>
      <ChevronRight className="mt-[2px] h-[17px] w-[17px] text-white" />
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="flex h-[60px] items-center rounded-[16px] bg-ph-card px-[20px] text-[16px] text-ph-mute-2">
      {label}
    </div>
  );
}

function TokenRow({ token, onClick }: { token: Token; onClick: () => void }) {
  const { prices } = useWallet();
  const value = tokenValue(token, prices);
  const delta = tokenChangeUsd(token, prices);
  const down = delta < 0;

  return (
    <button
      onClick={onClick}
      className="flex h-[60px] w-full items-center gap-[14px] rounded-[16px] bg-ph-card px-[20px] text-left transition-opacity active:opacity-70"
    >
      <TokenLogo
        src={token.image}
        name={token.name}
        size={40}
        chain={token.chain}
        symbol={token.symbol}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-[5px]">
          <span className="truncate text-[18px] font-semibold leading-[1.2]">
            {token.name}
          </span>
          {token.verified && (
            <VerifiedBadge className="h-[14px] w-[14px] shrink-0" />
          )}
        </div>
        <div className="tnum truncate text-[17px] leading-[1.25] text-ph-mute">
          {qty(token.quantity, token.symbol)}
        </div>
      </div>

      <div className="shrink-0 text-right">
        <div className="tnum text-[18px] font-semibold leading-[1.2]">
          {usd(value)}
        </div>
        <div
          className={`tnum text-[17px] font-medium leading-[1.25] ${
            down ? "text-ph-red" : "text-ph-green"
          }`}
        >
          {usdDelta(delta)}
        </div>
      </div>
    </button>
  );
}
