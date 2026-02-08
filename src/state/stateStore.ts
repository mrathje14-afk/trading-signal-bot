import fs from "fs";
import path from "path";

const STATE_FILE = path.join(__dirname, "state.json");

type Trend = "BULLISH" | "BEARISH" | null;

type SymbolState = {
  trend: Trend;
  lastFlip: Trend;
  inPosition: boolean;
};

type BotState = Record<string, SymbolState>;

function loadState(): BotState {
  if (!fs.existsSync(STATE_FILE)) return {};
  return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
}

function saveState(state: BotState): void {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

/**
 * ✅ PURE COMMONJS EXPORT
 * This is the key.
 */
module.exports = {
  loadState,
  saveState
};
