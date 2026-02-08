// src/data/yahoo.ts
import YahooFinance from "yahoo-finance2";

const yahoo = new YahooFinance({
  suppressNotices: ["ripHistorical"]
});

export async function fetchStock1dCandles(symbol: string): Promise<number[]> {
  // 5 years ago (in seconds)
  const now = Math.floor(Date.now() / 1000);
  const fiveYearsAgo = now - 5 * 365 * 24 * 60 * 60;

  const result = await yahoo.chart(symbol, {
    period1: fiveYearsAgo,
    period2: now,
    interval: "1d"
  });

  if (!result?.quotes || result.quotes.length === 0) {
    throw new Error(`No Yahoo data for ${symbol}`);
  }

  return result.quotes
    .map(q => q.close)
    .filter((c): c is number => typeof c === "number");
}
