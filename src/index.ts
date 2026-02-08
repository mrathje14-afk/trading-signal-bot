// trading-signal-bot\src\index.ts
import axios from "axios";
import { calculateEMA } from "./indicators/ema";
import { SYMBOLS, SymbolConfig } from "./config/symbols";
import { fetchStock1dCandles } from "./data/yahoo";
import "./telegram/commands";
import { notify } from "./telegram/notify";



// ---- State (CommonJS, safe) ----
const { loadState, saveState } = require("./state/stateStore");


// ---------- Helpers ----------
function positionLabel(inPosition: boolean): "IN" | "OUT" {
  return inPosition ? "IN" : "OUT";
}

// ---------- Core symbol processor ----------
async function processSymbol(
  config: SymbolConfig,
  state: any,
  spyTrend: string | null
): Promise<string> {

  let closes: number[];

  // 🔑 MARKET SEPARATION
 closes = await fetchStock1dCandles(config.symbol);


  const ema9 = calculateEMA(closes, 9);
  const ema50 = calculateEMA(closes, 50);

  const last = closes.length - 1;
  const currentPrice = closes[last];
  const currentTrend = ema9[last] > ema50[last] ? "BULLISH" : "BEARISH";

  // ensure state exists
  if (!state[config.key]) {
    state[config.key] = {
      trend: null,
      lastFlip: null,
      inPosition: false
    };
  }

  console.log(
    `${config.key} | Trend: ${currentTrend} | Price: ${currentPrice}`
  );

  // ---- Trend flip ----
  if (state[config.key].trend && state[config.key].trend !== currentTrend) {

    const isCrypto = config.market === "crypto";
    const spyAllowsStock = spyTrend === "BULLISH";

    const shouldAlert =
      config.role === "signal" &&
      (isCrypto || spyAllowsStock);

    if (shouldAlert) {
      const message =
        `🚨 ${config.key} TREND CHANGE\n` +
        `From: ${state[config.key].trend} → ${currentTrend}\n` +
        `Price: ${currentPrice}\n` +
        `Market (SPY): ${spyTrend}\n` +
        `Position: ${positionLabel(state[config.key].inPosition)}`;

      console.log(message);
      await notify(message);
    }

    state[config.key].lastFlip = currentTrend;
  }

  // always update trend
  state[config.key].trend = currentTrend;
  return currentTrend;
}

// ---------- MAIN ----------
async function main() {
  const state = loadState();

  // 1️⃣ Process SPY first (context)
  const spyConfig = SYMBOLS.find(s => s.key === "SPY")!;
  const spyTrend = await processSymbol(spyConfig, state, null);

  // 2️⃣ Process signal symbols
  for (const symbol of SYMBOLS) {
    if (symbol.role === "signal") {
      await processSymbol(symbol, state, spyTrend);
    }
  }

  saveState(state);

}



main().catch(console.error);
