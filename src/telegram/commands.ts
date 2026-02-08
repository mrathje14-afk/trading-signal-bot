import TelegramBot, { Message } from "node-telegram-bot-api";
import { SYMBOLS } from "../config/symbols";

// ---- Env ----
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

// ---- State (CommonJS safe) ----
const { loadState, saveState } = require("../state/stateStore");

// ---- Command window config ----
const COMMAND_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const isGitHub = process.env.GITHUB_ACTIONS === "true";
const enableCommandWindow =
  isGitHub && process.env.ENABLE_COMMAND_WINDOW === "true";

// ---- Types ----
type SymbolState = {
  trend: "BULLISH" | "BEARISH" | null;
  lastFlip: "BULLISH" | "BEARISH" | null;
  inPosition: boolean;
};

// ---- Helpers ----
function isValidSymbol(key: string) {
  return SYMBOLS.some(s => s.key === key && s.role === "signal");
}

function createEmptySymbolState(): SymbolState {
  return {
    trend: null,
    lastFlip: null,
    inPosition: false
  };
}

// ---- Telegram Commands (TIME-BOXED) ----
if (token && chatId && enableCommandWindow) {
  const bot = new TelegramBot(token, { polling: true });

  console.log("🟢 Telegram command window opened (1 hour)");

  bot.sendMessage(
    chatId,
    "🕒 Command window OPEN\nYou have 60 minutes to use /IN /OUT /STATUS"
  );

  bot.on("message", (msg: Message) => {
    if (msg.chat.id.toString() !== chatId) return;
    if (!msg.text) return;

    const parts = msg.text.trim().toUpperCase().split(" ");
    const command = parts[0];
    const symbol = parts[1];

    const state = loadState();

    // /IN BTC
    if (command === "/IN" && symbol) {
      if (!isValidSymbol(symbol)) {
        bot.sendMessage(chatId, `❌ Unknown symbol: ${symbol}`);
        return;
      }

      state[symbol] ??= createEmptySymbolState();
      state[symbol].inPosition = true;
      saveState(state);

      bot.sendMessage(chatId, `✅ ${symbol} marked as IN position`);
      return;
    }

    // /OUT BTC
    if (command === "/OUT" && symbol) {
      if (!isValidSymbol(symbol)) {
        bot.sendMessage(chatId, `❌ Unknown symbol: ${symbol}`);
        return;
      }

      state[symbol] ??= createEmptySymbolState();
      state[symbol].inPosition = false;
      saveState(state);

      bot.sendMessage(chatId, `🚪 ${symbol} marked as OUT of position`);
      return;
    }

    // /STATUS
    if (command === "/STATUS") {
      const lines = Object.entries(state)
        .map(([k, v]) => {
          const s = v as SymbolState;
          return `${k}: ${s.inPosition ? "IN" : "OUT"}`;
        })
        .join("\n");

      bot.sendMessage(
        chatId,
        `📊 Position Status:\n\n${lines || "No positions tracked"}`
      );
      return;
    }
  });

  // ---- Auto shutdown ----
  setTimeout(() => {
    console.log("🔴 Telegram command window closed");
    bot.stopPolling();
    process.exit(0);
  }, COMMAND_WINDOW_MS);

} else {
  console.log("Telegram commands disabled (no command window)");
}
