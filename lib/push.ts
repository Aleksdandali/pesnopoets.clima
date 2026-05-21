/**
 * Expo Push API helper — sends to https://exp.host/--/api/v2/push/send.
 *
 * Used by:
 *   - app/api/mobile/notify-message  (chat messages)
 *   - app/api/cron/service-reminders (scheduled maintenance reminders)
 *
 * Docs: https://docs.expo.dev/push-notifications/sending-notifications/
 *       (response shape is documented in the same page)
 */

export interface ExpoPushPayload {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: "default" | null;
  badge?: number;
  channelId?: string;
}

export interface ExpoTicket {
  status: "ok" | "error";
  id?: string;
  message?: string;
  details?: { error?: string };
}

const EXPO_URL = "https://exp.host/--/api/v2/push/send";

/**
 * Send one or more messages in a single batch. Expo accepts up to 100 per call.
 * Returns the parallel tickets array (one per message in input order).
 */
export async function sendExpoPush(
  messages: ExpoPushPayload[],
): Promise<ExpoTicket[]> {
  if (messages.length === 0) return [];

  const res = await fetch(EXPO_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  if (!res.ok) {
    throw new Error(`Expo push HTTP ${res.status}`);
  }

  const json = (await res.json()) as { data?: ExpoTicket[] | ExpoTicket };
  if (!json.data) return [];
  return Array.isArray(json.data) ? json.data : [json.data];
}

/**
 * Heuristic check: Expo tokens look like ExponentPushToken[xxx] or ExpoPushToken[xxx].
 * Older `expo-server-sdk` libs guard against sending to malformed tokens; we mirror that.
 */
export function isValidExpoPushToken(token: string | null | undefined): token is string {
  if (!token) return false;
  return /^Expo(nent)?PushToken\[.+\]$/.test(token);
}
