/** $18.64 — Phantom shows `<$0.01` for dust and never rounds a real balance to $0.00 */
export function usd(n: number, opts: { dust?: boolean } = {}): string {
  const { dust = true } = opts;
  if (!isFinite(n)) return "$0.00";
  const abs = Math.abs(n);
  if (dust && abs > 0 && abs < 0.01) return "<$0.01";
  if (abs >= 1_000_000_000)
    return `$${(n / 1_000_000_000).toFixed(2).replace(/\.00$/, "")}B`;
  return `$${n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Signed money delta: +$1.20 / -$0.55 / +<$0.01 */
export function usdDelta(n: number): string {
  const sign = n < 0 ? "-" : "+";
  const abs = Math.abs(n);
  if (abs > 0 && abs < 0.01) return `${sign}<$0.01`;
  if (abs === 0) return "$0.00";
  return `${sign}$${abs.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Signed price delta that keeps precision for sub-cent tokens: -$0.0022 */
export function usdDeltaPrecise(n: number): string {
  const sign = n < 0 ? "-" : "+";
  const abs = Math.abs(n);
  if (abs === 0) return "$0.00";
  if (abs >= 0.01)
    return `${sign}$${abs.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  return `${sign}$${abs.toPrecision(2)}`;
}

/** Account-row money — keeps small balances precise, like "$0.0042129" */
export function usdPrecise(n: number): string {
  if (!isFinite(n) || n === 0) return "$0.00";
  const abs = Math.abs(n);
  if (abs >= 0.01)
    return `$${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  return `$${n.toPrecision(5).replace(/0+$/, "").replace(/\.$/, "")}`;
}

export function pct(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}${Math.abs(n).toFixed(2)}%`;
}

/** Token quantity: "241.83044 POL", "< 0.00001 USDC.e" */
export function qty(n: number, symbol: string): string {
  if (n === 0) return `0 ${symbol}`;
  if (n > 0 && n < 0.00001) return `< 0.00001 ${symbol}`;
  const decimals = n >= 1000 ? 2 : n >= 1 ? 5 : 8;
  const s = n
    .toLocaleString("en-US", { maximumFractionDigits: decimals })
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
  return `${s} ${symbol}`;
}

/** Price header on the token screen — sub-dollar tokens need more precision */
export function usdPrice(n: number): string {
  if (!isFinite(n)) return "$0.00";
  if (n >= 1)
    return `$${n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  if (n === 0) return "$0.00";
  return `$${n.toPrecision(4)}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}
