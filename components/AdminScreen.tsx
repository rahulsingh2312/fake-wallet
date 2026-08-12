"use client";

import { useEffect, useRef, useState } from "react";
import { uid } from "@/lib/format";
import { AUTOPILOT_TRACKERS, buildTrackerTokens } from "@/lib/autopilot";
import { searchTokens, type JupToken } from "@/lib/jupiter";
import { useWallet } from "@/lib/store";
import type {
  Account,
  ChainBadge,
  PerpPosition,
  Token,
  WalletState,
} from "@/lib/types";
import { CloseIcon, PlusIcon, TrashIcon } from "./icons";
import { SavedToast } from "./Toast";
import { TokenLogo } from "./ui";

const CHAINS: ChainBadge[] = [
  "none",
  "solana",
  "ethereum",
  "polygon",
  "base",
  "bitcoin",
  "sui",
];

function blankToken(): Token {
  return {
    id: uid(),
    name: "",
    symbol: "",
    image: "",
    mint: "",
    price: 0,
    quantity: 0,
    change24h: 0,
    verified: true,
    chain: "solana",
    live: false,
  };
}

export function AdminScreen({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    state,
    prices,
    setState,
    account,
    setActiveAccount,
    reset,
    refreshPrices,
  } = useWallet();
  const [editing, setEditing] = useState<Token | null>(null);
  const [tab, setTab] = useState<
    "tokens" | "perps" | "accounts" | "profile"
  >("tokens");

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const patchAccount = (id: string, patch: Partial<Account>) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));

  const saveToken = (t: Token) => {
    const exists = account.tokens.some((x) => x.id === t.id);
    patchAccount(account.id, {
      tokens: exists
        ? account.tokens.map((x) => (x.id === t.id ? t : x))
        : [...account.tokens, t],
    });
    setEditing(null);
    refreshPrices();
  };

  const deleteToken = (id: string) =>
    patchAccount(account.id, {
      tokens: account.tokens.filter((t) => t.id !== id),
    });

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-[#0b0b0d]">
      {/* header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[#1f1f24] px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+var(--status-h,0px)+16px)]">
        <div className="flex-1">
          <div data-tour="editor-title" className="text-[19px] font-bold">
            Portfolio Data
          </div>
          <div className="text-[13px] text-ph-mute-2">
            Editing <span className="text-ph-purple">{account.name}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-11 w-11 place-items-center rounded-full bg-[#1b1b1e] active:opacity-70"
        >
          <CloseIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* tabs */}
      <div className="flex shrink-0 gap-2 px-4 py-3">
        {(["tokens", "perps", "accounts", "profile"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-[14px] font-medium capitalize ${
              tab === t ? "bg-ph-purple text-black" : "bg-[#1b1b1e] text-ph-mute"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+64px)]">
        {tab === "tokens" && (
          <>
            <button
              data-tour="add-token"
              onClick={() => setEditing(blankToken())}
              className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#3a3a42] py-4 text-[15px] font-medium text-ph-purple active:opacity-70"
            >
              <PlusIcon className="h-5 w-5" /> Add token
            </button>

            <div className="flex flex-col gap-2">
              {account.tokens.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-2xl bg-[#141416] p-3"
                >
                  <TokenLogo
                    src={t.image}
                    name={t.name || "?"}
                    size={40}
                    chain={t.chain}
                    symbol={t.symbol}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[15px] font-medium">
                      {t.name || "Untitled"}{" "}
                      <span className="text-ph-mute-2">{t.symbol}</span>
                    </div>
                    <div className="tnum truncate text-[13px] text-ph-mute-2">
                      {t.quantity} ×{" "}
                      {t.priceInSol ? `${t.priceInSol} SOL` : `$${t.price}`}{" "}
                      {(t.live || t.priceInSol) && (
                        <span className="text-ph-green">· live</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setEditing(t)}
                    className="rounded-xl bg-[#1f1f22] px-3 py-2 text-[13px] font-medium active:opacity-70"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteToken(t.id)}
                    aria-label="Delete"
                    className="grid h-9 w-9 place-items-center rounded-xl bg-[#1f1f22] text-ph-red active:opacity-70"
                  >
                    <TrashIcon className="h-[18px] w-[18px]" />
                  </button>
                </div>
              ))}
            </div>

            <Field label="Cash balance (USD)">
              <input
                type="number"
                inputMode="decimal"
                value={account.cash}
                onChange={(e) =>
                  patchAccount(account.id, {
                    cash: Number(e.target.value) || 0,
                  })
                }
                className={inputCls}
              />
            </Field>

            <button
              onClick={() => {
                const fresh = buildTrackerTokens(prices);
                const keep = account.tokens.filter(
                  (t) => !AUTOPILOT_TRACKERS.some((a) => a.symbol === t.symbol)
                );
                patchAccount(account.id, { tokens: [...fresh, ...keep] });
                refreshPrices();
              }}
              className="mt-10 mb-2 w-full text-center text-[11px] text-[#3f3f46] active:text-ph-purple"
            >
              load autopilot trackers
            </button>
          </>
        )}

        {tab === "perps" && (
          <PerpsTab
            perps={account.perps}
            onChange={(perps) => patchAccount(account.id, { perps })}
          />
        )}

        {tab === "accounts" && (
          <AccountsTab
            state={state}
            setState={setState}
            setActiveAccount={setActiveAccount}
          />
        )}

        {tab === "profile" && (
          <ProfileTab state={state} setState={setState} onReset={reset} />
        )}
      </div>

      <SavedToast watch={state} />

      {editing && (
        <TokenEditor
          token={editing}
          onCancel={() => setEditing(null)}
          onSave={saveToken}
        />
      )}
    </div>
  );
}

/* --------------------------------- shared -------------------------------- */

const inputCls =
  "w-full rounded-xl bg-[#141416] px-3.5 py-3 text-[15px] text-white outline-none ring-1 ring-[#26262c] focus:ring-ph-purple";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="mt-4 block">
      <div className="mb-1.5 text-[13px] font-medium text-ph-mute">{label}</div>
      {children}
      {hint && <div className="mt-1 text-[12px] text-ph-mute-2">{hint}</div>}
    </label>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="mt-4 flex w-full items-center justify-between rounded-xl bg-[#141416] px-3.5 py-3 ring-1 ring-[#26262c]"
    >
      <span className="text-[15px]">{label}</span>
      <span
        className={`relative h-[26px] w-[46px] rounded-full transition-colors ${
          on ? "bg-ph-purple" : "bg-[#3a3a42]"
        }`}
      >
        <span
          className={`absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all ${
            on ? "left-[23px]" : "left-[3px]"
          }`}
        />
      </span>
    </button>
  );
}

/* ------------------------------ token editor ----------------------------- */

function TokenEditor({
  token,
  onCancel,
  onSave,
}: {
  token: Token;
  onCancel: () => void;
  onSave: (t: Token) => void;
}) {
  const [t, setT] = useState<Token>(token);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<JupToken[]>([]);
  const [searching, setSearching] = useState(false);
  const timer = useRef<number | null>(null);

  const set = <K extends keyof Token>(k: K, v: Token[K]) =>
    setT((prev) => ({ ...prev, [k]: v }));

  // Debounced Jupiter lookup — paste a mint, or type a symbol/name.
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setSearching(true);
    timer.current = window.setTimeout(async () => {
      const r = await searchTokens(query);
      setResults(r.slice(0, 8));
      setSearching(false);
    }, 350);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [query]);

  const applyJup = (j: JupToken) => {
    setT((prev) => ({
      ...prev,
      name: j.name || prev.name,
      symbol: j.symbol || prev.symbol,
      image: j.icon || prev.image,
      mint: j.id,
      price: j.usdPrice ?? prev.price,
      change24h: j.stats24h?.priceChange
        ? Number((j.stats24h.priceChange * 100).toFixed(2))
        : prev.change24h,
      chain: "solana",
      live: true,
    }));
    setQuery("");
    setResults([]);
  };

  const unit = t.priceInSol ? t.priceInSol * (t.price || 0) : t.price || 0;
  const value = unit * (t.quantity || 0);

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-[#0b0b0d]">
      <div className="flex shrink-0 items-center gap-3 border-b border-[#1f1f24] px-4 pb-3 pt-[calc(env(safe-area-inset-top,0px)+var(--status-h,0px)+16px)]">
        <button
          onClick={onCancel}
          className="text-[15px] font-medium text-ph-mute active:opacity-70"
        >
          Cancel
        </button>
        <div className="flex-1 text-center text-[16px] font-bold">
          {token.name ? "Edit token" : "New token"}
        </div>
        <button
          onClick={() => onSave(t)}
          className="rounded-full bg-ph-purple px-4 py-2 text-[14px] font-bold text-black active:opacity-80"
        >
          Save
        </button>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-[calc(env(safe-area-inset-bottom,0px)+var(--safe-b,0px)+64px)]">
        {/* Jupiter autofill */}
        <Field
          label="Autofill from Jupiter"
          hint="Paste a Solana mint address, or type a symbol / name."
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. SOL, JUP, or a mint address"
            className={inputCls}
          />
        </Field>

        {searching && (
          <div className="mt-2 text-[13px] text-ph-mute-2">Searching…</div>
        )}
        {results.length > 0 && (
          <div className="mt-2 flex flex-col gap-1.5">
            {results.map((r) => (
              <button
                key={r.id}
                onClick={() => applyJup(r)}
                className="flex items-center gap-3 rounded-xl bg-[#141416] p-2.5 text-left active:opacity-70"
              >
                <TokenLogo src={r.icon ?? ""} name={r.name} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium">
                    {r.name}{" "}
                    <span className="text-ph-mute-2">{r.symbol}</span>
                  </div>
                  <div className="tnum truncate text-[12px] text-ph-mute-2">
                    ${r.usdPrice?.toPrecision(5) ?? "—"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#141416] p-3">
          <TokenLogo
            src={t.image}
            name={t.name || "?"}
            size={48}
            chain={t.chain}
            symbol={t.symbol}
          />
          <div className="min-w-0">
            <div className="truncate text-[15px] font-medium">
              {t.name || "Untitled"}
            </div>
            <div className="tnum text-[13px] text-ph-mute-2">
              Value ${value.toLocaleString("en-US", { maximumFractionDigits: 6 })}
            </div>
          </div>
        </div>

        <Field label="Token name">
          <input
            value={t.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Polygon"
            className={inputCls}
          />
        </Field>

        <Field label="Symbol">
          <input
            value={t.symbol}
            onChange={(e) => set("symbol", e.target.value)}
            placeholder="POL"
            className={inputCls}
          />
        </Field>

        <Field label="Image URL">
          <input
            value={t.image}
            onChange={(e) => set("image", e.target.value)}
            placeholder="https://…/logo.png"
            className={inputCls}
          />
        </Field>

        <Field label="Quantity">
          <input
            type="number"
            inputMode="decimal"
            value={t.quantity}
            onChange={(e) => set("quantity", Number(e.target.value) || 0)}
            className={inputCls}
          />
        </Field>

        <Field
          label="Price (USD)"
          hint={t.live ? "Overridden by the live Jupiter price." : undefined}
        >
          <input
            type="number"
            inputMode="decimal"
            value={t.price}
            onChange={(e) => set("price", Number(e.target.value) || 0)}
            className={inputCls}
          />
        </Field>

        <Field
          label="Price in SOL (optional)"
          hint="Set this for SOL-denominated tokens like vault shares. The USD price then follows the live SOL price, and this overrides the price above."
        >
          <input
            type="number"
            inputMode="decimal"
            value={t.priceInSol ?? ""}
            onChange={(e) =>
              set(
                "priceInSol",
                e.target.value === "" ? undefined : Number(e.target.value) || 0
              )
            }
            placeholder="e.g. 1.5"
            className={inputCls}
          />
        </Field>

        <Field label="24h change (%)">
          <input
            type="number"
            inputMode="decimal"
            value={t.change24h}
            onChange={(e) => set("change24h", Number(e.target.value) || 0)}
            className={inputCls}
          />
        </Field>

        <Field
          label="Solana mint (for live pricing)"
          hint="Required if live pricing is on."
        >
          <input
            value={t.mint ?? ""}
            onChange={(e) => set("mint", e.target.value.trim())}
            placeholder="So1111…1112"
            className={inputCls}
          />
        </Field>

        <Field label="Chain badge">
          <div className="flex flex-wrap gap-2">
            {CHAINS.map((c) => (
              <button
                key={c}
                onClick={() => set("chain", c)}
                className={`rounded-full px-3.5 py-2 text-[13px] font-medium capitalize ${
                  t.chain === c
                    ? "bg-ph-purple text-black"
                    : "bg-[#1b1b1e] text-ph-mute"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        <Toggle
          on={t.live}
          onChange={(v) => set("live", v)}
          label="Live price from Jupiter"
        />
        <Toggle
          on={t.verified}
          onChange={(v) => set("verified", v)}
          label="Verified badge"
        />
      </div>
    </div>
  );
}

/* -------------------------------- perps tab ------------------------------- */

function PerpsTab({
  perps,
  onChange,
}: {
  perps: PerpPosition[];
  onChange: (p: PerpPosition[]) => void;
}) {
  const patch = (id: string, p: Partial<PerpPosition>) =>
    onChange(perps.map((x) => (x.id === id ? { ...x, ...p } : x)));

  const add = () =>
    onChange([
      ...perps,
      {
        id: uid(),
        name: "Solana",
        symbol: "SOL",
        image: "",
        side: "long",
        leverage: 5,
        value: 0,
        pnl: 0,
        pnlPct: 0,
      },
    ]);

  return (
    <>
      <button
        onClick={add}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#3a3a42] py-4 text-[15px] font-medium text-ph-purple active:opacity-70"
      >
        <PlusIcon className="h-5 w-5" /> Add position
      </button>

      <div className="flex flex-col gap-3">
        {perps.map((p) => (
          <div key={p.id} className="rounded-2xl bg-[#141416] p-3">
            <div className="flex items-center gap-2">
              <TokenLogo src={p.image} name={p.name || "?"} size={36} />
              <input
                value={p.symbol}
                onChange={(e) => patch(p.id, { symbol: e.target.value })}
                placeholder="SOL"
                className="w-20 rounded-xl bg-[#1f1f22] px-3 py-2.5 text-[15px] font-medium outline-none"
              />
              <input
                value={p.name}
                onChange={(e) => patch(p.id, { name: e.target.value })}
                placeholder="Solana"
                className="min-w-0 flex-1 rounded-xl bg-[#1f1f22] px-3 py-2.5 text-[15px] outline-none"
              />
              <button
                onClick={() => onChange(perps.filter((x) => x.id !== p.id))}
                aria-label="Delete position"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1f1f22] text-ph-red active:opacity-70"
              >
                <TrashIcon className="h-[18px] w-[18px]" />
              </button>
            </div>

            <input
              value={p.image}
              onChange={(e) => patch(p.id, { image: e.target.value })}
              placeholder="Image URL"
              className="mt-2 w-full rounded-xl bg-[#1f1f22] px-3 py-2.5 text-[14px] outline-none"
            />

            <div className="mt-2 flex gap-2">
              <button
                onClick={() =>
                  patch(p.id, { side: p.side === "long" ? "short" : "long" })
                }
                className={`rounded-xl px-3.5 py-2.5 text-[14px] font-medium ${
                  p.side === "long"
                    ? "bg-[#12301f] text-ph-green"
                    : "bg-[#2a1416] text-ph-red"
                }`}
              >
                {p.side === "long" ? "Long" : "Short"}
              </button>
              <NumBox
                label="Lev"
                value={p.leverage}
                onChange={(v) => patch(p.id, { leverage: v })}
              />
              <NumBox
                label="Value"
                value={p.value}
                onChange={(v) => patch(p.id, { value: v })}
              />
            </div>

            <div className="mt-2 flex gap-2">
              <NumBox
                label="PnL $"
                value={p.pnl}
                onChange={(v) => patch(p.id, { pnl: v })}
              />
              <NumBox
                label="PnL %"
                value={p.pnlPct}
                onChange={(v) => patch(p.id, { pnlPct: v })}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function NumBox({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="min-w-0 flex-1">
      <div className="mb-1 text-[11px] text-ph-mute-2">{label}</div>
      <input
        type="number"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-xl bg-[#1f1f22] px-3 py-2 text-[14px] outline-none"
      />
    </label>
  );
}

/* ------------------------------ accounts tab ----------------------------- */

function AccountsTab({
  state,
  setState,
  setActiveAccount,
}: {
  state: WalletState;
  setState: (u: (s: WalletState) => WalletState) => void;
  setActiveAccount: (id: string) => void;
}) {
  const addAccount = () =>
    setState((s) => {
      const id = uid();
      return {
        ...s,
        activeAccountId: id,
        accounts: [
          ...s.accounts,
          { id, name: "new account", emoji: "", cash: 0, tokens: [], perps: [] },
        ],
      };
    });

  const patch = (id: string, p: Partial<Account>) =>
    setState((s) => ({
      ...s,
      accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...p } : a)),
    }));

  const remove = (id: string) =>
    setState((s) => {
      const accounts = s.accounts.filter((a) => a.id !== id);
      if (accounts.length === 0) return s;
      return {
        ...s,
        accounts,
        activeAccountId:
          s.activeAccountId === id ? accounts[0].id : s.activeAccountId,
      };
    });

  return (
    <>
      <button
        onClick={addAccount}
        className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#3a3a42] py-4 text-[15px] font-medium text-ph-purple active:opacity-70"
      >
        <PlusIcon className="h-5 w-5" /> Add account
      </button>

      <div className="flex flex-col gap-2">
        {state.accounts.map((a) => (
          <div key={a.id} className="rounded-2xl bg-[#141416] p-3">
            <div className="flex items-center gap-2">
              <input
                value={a.emoji}
                onChange={(e) => patch(a.id, { emoji: e.target.value })}
                placeholder="🖼️"
                className="w-14 rounded-xl bg-[#1f1f22] px-2 py-2.5 text-center text-[18px] outline-none"
              />
              <input
                value={a.name}
                onChange={(e) => patch(a.id, { name: e.target.value })}
                className="min-w-0 flex-1 rounded-xl bg-[#1f1f22] px-3 py-2.5 text-[15px] font-medium outline-none"
              />
              <button
                onClick={() => remove(a.id)}
                aria-label="Delete account"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1f1f22] text-ph-red active:opacity-70"
              >
                <TrashIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[13px] text-ph-mute-2">
                {a.tokens.length} token{a.tokens.length === 1 ? "" : "s"}
              </span>
              <button
                onClick={() => setActiveAccount(a.id)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
                  state.activeAccountId === a.id
                    ? "bg-ph-purple text-black"
                    : "bg-[#1f1f22] text-ph-mute"
                }`}
              >
                {state.activeAccountId === a.id ? "Active" : "Make active"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------ profile tab ------------------------------ */

function ProfileTab({
  state,
  setState,
  onReset,
}: {
  state: WalletState;
  setState: (u: (s: WalletState) => WalletState) => void;
  onReset: () => void;
}) {
  const [io, setIo] = useState("");

  return (
    <>
      <Field label="Username">
        <input
          value={state.username}
          onChange={(e) =>
            setState((s) => ({ ...s, username: e.target.value }))
          }
          className={inputCls}
        />
      </Field>

      <Field label="Avatar image URL">
        <input
          value={state.avatar}
          onChange={(e) => setState((s) => ({ ...s, avatar: e.target.value }))}
          className={inputCls}
        />
      </Field>

      <Field
        label="Export / import"
        hint="Copy this JSON to move your portfolio to another device."
      >
        <textarea
          value={io}
          onChange={(e) => setIo(e.target.value)}
          rows={6}
          className={`${inputCls} font-mono text-[12px]`}
        />
      </Field>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => setIo(JSON.stringify(state, null, 2))}
          className="rounded-xl bg-[#1f1f22] py-3 text-[14px] font-medium active:opacity-70"
        >
          Export
        </button>
        <button
          onClick={() => {
            try {
              const parsed = JSON.parse(io) as WalletState;
              if (parsed?.accounts?.length) setState(() => parsed);
            } catch {
              alert("That isn't valid JSON.");
            }
          }}
          className="rounded-xl bg-ph-purple py-3 text-[14px] font-medium text-black active:opacity-80"
        >
          Import
        </button>
      </div>

      <button
        onClick={() => {
          if (confirm("Reset everything back to the demo data?")) onReset();
        }}
        className="mt-6 w-full rounded-xl bg-[#2a1416] py-3 text-[14px] font-medium text-ph-red active:opacity-70"
      >
        Reset to demo data
      </button>
    </>
  );
}
