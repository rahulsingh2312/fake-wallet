import type { PriceMap } from "./types";

const PRICE_URL = "https://lite-api.jup.ag/price/v3";
const SEARCH_URL = "https://lite-api.jup.ag/tokens/v2/search";

/** Batch price lookup. Jupiter caps a request at 50 ids, so we chunk. */
export async function fetchPrices(mints: string[]): Promise<PriceMap> {
  const unique = Array.from(new Set(mints.filter(Boolean)));
  if (unique.length === 0) return {};

  const chunks: string[][] = [];
  for (let i = 0; i < unique.length; i += 50) chunks.push(unique.slice(i, i + 50));

  const out: PriceMap = {};
  await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const res = await fetch(`${PRICE_URL}?ids=${chunk.join(",")}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = (await res.json()) as Record<
          string,
          { usdPrice?: number; priceChange24h?: number }
        >;
        for (const [mint, v] of Object.entries(json ?? {})) {
          if (typeof v?.usdPrice === "number") {
            out[mint] = {
              usdPrice: v.usdPrice,
              priceChange24h: v.priceChange24h ?? 0,
            };
          }
        }
      } catch {
        /* offline — callers fall back to the stored manual price */
      }
    })
  );
  return out;
}

export type JupToken = {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  usdPrice?: number;
  stats24h?: { priceChange?: number };
};

/** Search by mint address, symbol or name — used to auto-fill the admin form. */
export async function searchTokens(query: string): Promise<JupToken[]> {
  const q = query.trim();
  if (!q) return [];
  try {
    const res = await fetch(`${SEARCH_URL}?query=${encodeURIComponent(q)}`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? (json as JupToken[]) : [];
  } catch {
    return [];
  }
}
