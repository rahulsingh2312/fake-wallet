import { uid } from "./format";
import type { PriceMap, Token } from "./types";
import { SOL_MINT } from "./store";

const AVATAR = "https://autopilot-solana.vercel.app/tokens";

/**
 * The Autopilot tracker vaults. Each share is denominated in SOL (NAV 1.0),
 * so `priceInSol` drives the USD value off the live SOL price and `targetUsd`
 * decides how big the position should be when the preset is applied.
 */
export type TrackerPreset = {
  symbol: string;
  name: string;
  image: string;
  vault: string;
  /** Share price in SOL */
  priceInSol: number;
  /** Position size to aim for, in USD */
  targetUsd: number;
  /** Daily alpha on top of SOL's own move, in percent */
  alpha: number;
};

export const AUTOPILOT_TRACKERS: TrackerPreset[] = [
  {
    symbol: "aiSOL",
    name: "AI Infrastructure",
    image: `${AVATAR}/aisol.png`,
    vault: "DCiDx1StRS",
    priceInSol: 2.0,
    targetUsd: 15000,
    alpha: 3.4,
  },
  {
    symbol: "bwSOL",
    name: "Buffett Tracker",
    image: `${AVATAR}/bwsol.png`,
    vault: "A1CsoP2AqD",
    priceInSol: 1.5,
    targetUsd: 15000,
    alpha: 0.6,
  },
  {
    symbol: "pltSOL",
    name: "Pelosi Tracker",
    image: `${AVATAR}/pltsol.png`,
    vault: "GGVwhCE4tJ",
    priceInSol: 1.6,
    targetUsd: 14000,
    alpha: 2.1,
  },
  {
    symbol: "icSOL",
    name: "Inverse Cramer Index",
    image: `${AVATAR}/icsol.png`,
    vault: "9GMDuBbwKd",
    priceInSol: 1.3,
    targetUsd: 13000,
    alpha: 1.8,
  },
  {
    symbol: "mg7SOL",
    name: "Magnificent Seven",
    image: `${AVATAR}/mg7sol.png`,
    vault: "7TxXLq5uDa",
    priceInSol: 1.45,
    targetUsd: 12500,
    alpha: 1.2,
  },
  {
    symbol: "dtSOL",
    name: "Tepper Tracker",
    image: `${AVATAR}/dtsol.png`,
    vault: "CQvjc5RrQ8",
    priceInSol: 1.75,
    targetUsd: 12000,
    alpha: 2.6,
  },
  {
    symbol: "rdSOL",
    name: "Bridgewater Tracker",
    image: `${AVATAR}/rdsol.png`,
    vault: "5vhYtg7qoW",
    priceInSol: 1.35,
    targetUsd: 11000,
    alpha: 0.9,
  },
  {
    symbol: "cgSOL",
    name: "Congress Tracker",
    image: `${AVATAR}/cgsol.png`,
    vault: "Au7Bt2qFn8",
    priceInSol: 1.2,
    targetUsd: 10500,
    alpha: 0.4,
  },
  {
    symbol: "psqSOL",
    name: "Ackman Tracker",
    image: `${AVATAR}/psqsol.png`,
    vault: "3oTrE2Z4uZ",
    priceInSol: 1.1,
    targetUsd: 10000,
    alpha: -0.3,
  },
];

/** Fallback SOL price if Jupiter has not answered yet. */
const SOL_FALLBACK = 76;

/**
 * Turn the presets into wallet tokens, sizing each position so it lands on its
 * target USD value at the current SOL price.
 */
export function buildTrackerTokens(prices: PriceMap): Token[] {
  const sol = prices[SOL_MINT]?.usdPrice ?? SOL_FALLBACK;
  return AUTOPILOT_TRACKERS.map((t) => {
    const unitUsd = t.priceInSol * sol;
    const quantity = Number((t.targetUsd / unitUsd).toFixed(4));
    return {
      id: uid(),
      name: t.name,
      symbol: t.symbol,
      image: t.image,
      price: sol, // used only until the live SOL price lands
      priceInSol: t.priceInSol,
      quantity,
      change24h: t.alpha,
      verified: true,
      chain: "solana",
      live: false,
    } satisfies Token;
  });
}
