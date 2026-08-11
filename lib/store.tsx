"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchPrices } from "./jupiter";
import { SEED } from "./seed";
import type { Account, PriceMap, Token, WalletState } from "./types";

const KEY = "larp-phantom:v1";

/** Wrapped SOL, used to value anything priced in SOL. */
export const SOL_MINT = "So11111111111111111111111111111111111111112";

type Ctx = {
  state: WalletState;
  prices: PriceMap;
  ready: boolean;
  account: Account;
  setState: (updater: (s: WalletState) => WalletState) => void;
  setActiveAccount: (id: string) => void;
  reset: () => void;
  refreshPrices: () => void;
};

const WalletCtx = createContext<Ctx | null>(null);

function load(): WalletState {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw) as WalletState;
    if (!parsed?.accounts?.length) return SEED;
    return parsed;
  } catch {
    return SEED;
  }
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setStateRaw] = useState<WalletState>(SEED);
  const [prices, setPrices] = useState<PriceMap>({});
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount so SSR and the first client render match.
  useEffect(() => {
    setStateRaw(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* quota / private mode — the UI still works for this session */
    }
  }, [state, ready]);

  const liveMints = useMemo(() => {
    const mints: string[] = [];
    let needsSol = false;
    for (const acc of state.accounts)
      for (const t of acc.tokens) {
        if (t.live && t.mint) mints.push(t.mint);
        if (t.priceInSol) needsSol = true;
      }
    if (needsSol) mints.push(SOL_MINT);
    return Array.from(new Set(mints)).sort();
  }, [state.accounts]);

  const mintKey = liveMints.join(",");

  const refreshPrices = useCallback(() => {
    if (!mintKey) return;
    fetchPrices(mintKey.split(",")).then((p) => {
      if (Object.keys(p).length) setPrices((prev) => ({ ...prev, ...p }));
    });
  }, [mintKey]);

  // Poll Jupiter for every token flagged "live".
  useEffect(() => {
    if (!ready || !mintKey) return;
    refreshPrices();
    const id = window.setInterval(refreshPrices, 30_000);
    const onFocus = () => refreshPrices();
    window.addEventListener("focus", onFocus);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [ready, mintKey, refreshPrices]);

  const setState = useCallback(
    (updater: (s: WalletState) => WalletState) => setStateRaw(updater),
    []
  );

  const setActiveAccount = useCallback(
    (id: string) => setStateRaw((s) => ({ ...s, activeAccountId: id })),
    []
  );

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {}
    setStateRaw(SEED);
  }, []);

  const account =
    state.accounts.find((a) => a.id === state.activeAccountId) ??
    state.accounts[0];

  const value: Ctx = {
    state,
    prices,
    ready,
    account,
    setState,
    setActiveAccount,
    reset,
    refreshPrices,
  };

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}

export function useWallet(): Ctx {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error("useWallet must be used inside <WalletProvider>");
  return ctx;
}

/* ------------------------------- derivations ------------------------------ */

export function tokenPrice(t: Token, prices: PriceMap): number {
  // SOL-denominated tokens (vault shares, LSTs) follow the SOL price.
  if (t.priceInSol && prices[SOL_MINT])
    return t.priceInSol * prices[SOL_MINT].usdPrice;
  if (t.live && t.mint && prices[t.mint]) return prices[t.mint].usdPrice;
  if (t.priceInSol) return t.priceInSol * t.price;
  return t.price;
}

export function tokenChangePct(t: Token, prices: PriceMap): number {
  // Priced in SOL: SOL's own move, plus whatever alpha the token is set to.
  if (t.priceInSol)
    return (prices[SOL_MINT]?.priceChange24h ?? 0) + t.change24h;
  if (t.live && t.mint && prices[t.mint])
    return prices[t.mint].priceChange24h ?? 0;
  return t.change24h;
}

export function tokenValue(t: Token, prices: PriceMap): number {
  return tokenPrice(t, prices) * t.quantity;
}

/** USD moved in the last 24h for this holding. */
export function tokenChangeUsd(t: Token, prices: PriceMap): number {
  const value = tokenValue(t, prices);
  const pct = tokenChangePct(t, prices);
  const prev = value / (1 + pct / 100);
  if (!isFinite(prev)) return 0;
  return value - prev;
}

export function accountTotal(a: Account, prices: PriceMap): number {
  const tokens = a.tokens.reduce((sum, t) => sum + tokenValue(t, prices), 0);
  const perps = a.perps.reduce((sum, p) => sum + p.value, 0);
  return a.cash + tokens + perps;
}

export function accountChangeUsd(a: Account, prices: PriceMap): number {
  const tokens = a.tokens.reduce((sum, t) => sum + tokenChangeUsd(t, prices), 0);
  const perps = a.perps.reduce((sum, p) => sum + p.pnl, 0);
  return tokens + perps;
}

export function accountChangePct(a: Account, prices: PriceMap): number {
  const total = accountTotal(a, prices);
  const change = accountChangeUsd(a, prices);
  const prev = total - change;
  if (prev <= 0) return 0;
  return (change / prev) * 100;
}
