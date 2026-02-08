import { SYMBOLS } from "../config/symbols";

const { loadState } = require("../state/stateStore");

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export async function sendWeeklySummary(): Promise<void> {
  if (!token || !chatId) return;

  const state = loadState();

  const lines = SYMBOLS.map(s => {
    const entry = state[s.key];
    if (!entry) return `${s.key}: —`;

    const trend = entry.trend ?? "—";
    const pos = entry.inPosition ? "IN" : "OUT";

    return `${s.key}: ${trend} | ${pos}`;
  });

  const message =
    `📊 WEEKLY MARKET SUMMARY\n\n` +
    lines.join("\n");

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: message
    })
  });
}
