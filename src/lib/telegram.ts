/**
 * Sends a notification message to the configured Telegram chat / channel.
 * Will silently skip if TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not configured.
 *
 * @param message - The HTML or plain text message string to dispatch
 */
export async function sendTelegramNotification(
  message: string
): Promise<{ success: boolean; error?: unknown; skipped?: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !token.trim()) {
    return { success: false, skipped: true, error: 'TELEGRAM_BOT_TOKEN not configured' };
  }

  if (!chatId || !chatId.trim()) {
    console.warn('[Telegram] TELEGRAM_BOT_TOKEN is set but TELEGRAM_CHAT_ID is missing.');
    return { success: false, skipped: true, error: 'TELEGRAM_CHAT_ID not configured' };
  }

  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[Telegram] API error (HTTP ${response.status}):`, errText);
      return { success: false, error: errText };
    }

    await response.json();
    return { success: true, error: undefined, skipped: false };
  } catch (error) {
    console.error('[Telegram] Network or unexpected error sending message:', error);
    return { success: false, error };
  }
}
