export type MarketType = "crypto" | "stock";
export type SymbolRole = "context" | "signal";

export interface SymbolConfig {
  key: string;          // used for state (SPY, AAPL, BTC)
  symbol: string;       // exchange symbol
  market: MarketType;  // crypto | stock
  role: SymbolRole;    // context | signal
}

export const SYMBOLS: SymbolConfig[] = [
  // 🔹 MARKET CONTEXT
  {
    key: "SPY",
    symbol: "SPY",
    market: "stock",
    role: "context"
  },

  // 🔹 CRYPTO
  {
    key: "BTC",
    symbol: "BTC-USD",
    market: "crypto",
    role: "signal"
  },

  // 🔹 BIG TECH (CORE)
  { key: "AAPL", symbol: "AAPL", market: "stock", role: "signal" },
  { key: "MSFT", symbol: "MSFT", market: "stock", role: "signal" },
  { key: "NVDA", symbol: "NVDA", market: "stock", role: "signal" },

  // 🔹 BIG TECH (EXPANSION)
  { key: "GOOGL", symbol: "GOOGL", market: "stock", role: "signal" },
  { key: "AMZN", symbol: "AMZN", market: "stock", role: "signal" },
  { key: "META", symbol: "META", market: "stock", role: "signal" },

  // 🔹 OPTIONAL / HIGH BETA
  { key: "TSLA", symbol: "TSLA", market: "stock", role: "signal" }
];
