//trading-signal-bot\src\telegram\notify.ts
import axios from "axios";

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

export async function notify(text: string): Promise<void> {
  if (!token || !chatId) return; // silent fail for local/dev

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await axios.post(url, {
    chat_id: chatId,
    text
  });
}
