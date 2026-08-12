import type { Account, WalletState } from "./types";

const TW = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";

export const LOGOS = {
  polygon: "https://coin-images.coingecko.com/coins/images/32440/large/polygon.png",
  ethereum: `${TW}/ethereum/info/logo.png`,
  usdc: `${TW}/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png`,
  solana:
    "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
  bitcoin: `${TW}/bitcoin/info/logo.png`,
  wbtc: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh/logo.png",
};

export const MINTS = {
  sol: "So11111111111111111111111111111111111111112",
  usdc: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  wbtc: "3NZ9JMVBmGAqocybic2c7LQCJScmgsAZ6vQqTDzcqmJh",
};

/** A tiny helper for the placeholder accounts in the accounts sheet. */
function plainAccount(
  id: string,
  name: string,
  emoji: string,
  total: number
): Account {
  return {
    id,
    name,
    emoji,
    cash: 0,
    perps: [],
    tokens:
      total > 0
        ? [
            {
              id: `${id}-sol`,
              name: "Solana",
              symbol: "SOL",
              image: LOGOS.solana,
              mint: "So11111111111111111111111111111111111111112",
              price: 75.98,
              quantity: total / 75.98,
              change24h: -0.35,
              verified: true,
              chain: "solana",
              live: false,
            },
          ]
        : [],
  };
}

export const SEED: WalletState = {
  username: "@anon",
  avatar: "/avatar.png",
  activeAccountId: "fakewallet",
  accounts: [
    {
      id: "fakewallet",
      name: "fakewallet",
      emoji: "😎",
      cash: 0,
      perps: [],
      tokens: [
        {
          id: "sol",
          name: "Solana",
          symbol: "SOL",
          image: LOGOS.solana,
          mint: MINTS.sol,
          price: 76.14495443297918,
          quantity: 525.31386,
          change24h: -0.14,
          verified: true,
          chain: "none",
          live: true,
        },
        {
          id: "usdc",
          name: "USD Coin",
          symbol: "USDC",
          image: LOGOS.usdc,
          mint: MINTS.usdc,
          price: 0.9996351087348352,
          quantity: 40014.600978,
          change24h: 0,
          verified: true,
          chain: "solana",
          live: true,
        },
        {
          id: "wbtc",
          name: "Wrapped BTC",
          symbol: "WBTC",
          image: LOGOS.wbtc,
          mint: MINTS.wbtc,
          price: 63611.38598477049,
          quantity: 0.47161368,
          change24h: -0.52,
          verified: true,
          chain: "solana",
          live: true,
        },
      ],
    },
    plainAccount("trading", "trading", "📈", 8420.55),
    plainAccount("savings", "savings", "🏦", 25000),
    plainAccount("degen", "degen", "🎲", 312.48),
  ],
};
