export type ChainBadge =
  | "none"
  | "solana"
  | "ethereum"
  | "polygon"
  | "base"
  | "bitcoin"
  | "sui";

export type Token = {
  id: string;
  /** Display name, e.g. "Polygon" */
  name: string;
  /** Ticker shown under the name, e.g. "POL" */
  symbol: string;
  /** Logo URL or data: URI */
  image: string;
  /** Solana mint — when set and `live` is true, price comes from Jupiter */
  mint?: string;
  /** Manual USD price (fallback / used when live is off) */
  price: number;
  /**
   * Price expressed in SOL. When set, the USD price becomes
   * `priceInSol x live SOL price`, so SOL-denominated vault tokens move with
   * the market instead of sitting frozen.
   */
  priceInSol?: number;
  quantity: number;
  /** 24h change in percent, e.g. -2.88 */
  change24h: number;
  verified: boolean;
  chain: ChainBadge;
  /** Pull live price + 24h change from the Jupiter price API */
  live: boolean;
};

export type PerpPosition = {
  id: string;
  name: string;
  symbol: string;
  image: string;
  side: "long" | "short";
  leverage: number;
  value: number;
  pnl: number;
  pnlPct: number;
};

export type Account = {
  id: string;
  name: string;
  /** Emoji avatar, e.g. "🖼️" — empty string falls back to the first letter */
  emoji: string;
  cash: number;
  tokens: Token[];
  perps: PerpPosition[];
};

export type WalletState = {
  username: string;
  /** Profile avatar image URL (the ghost/pfp in the top-left) */
  avatar: string;
  activeAccountId: string;
  accounts: Account[];
};

export type PriceMap = Record<
  string,
  { usdPrice: number; priceChange24h: number }
>;
