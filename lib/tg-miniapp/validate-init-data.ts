import { createHmac, timingSafeEqual } from "crypto";

/**
 * Telegram Mini App initData HMAC-SHA256 validation.
 * https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface ValidatedInitData {
  user: TelegramUser;
  authDate: number;
  hash: string;
}

const MAX_AUTH_AGE_SECONDS = 300; // 5 minutes — reject replayed initData

export function validateInitData(initDataRaw: string): ValidatedInitData {
  if (!initDataRaw) throw new InitDataError("MISSING_DATA", "initData is empty");

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!botToken) throw new InitDataError("CONFIG_ERROR", "Bot token not configured");

  // Parse
  const params = new URLSearchParams(initDataRaw);
  const hash = params.get("hash");
  if (!hash) throw new InitDataError("MISSING_HASH", "No hash in initData");

  // Build data_check_string (all params except hash, sorted)
  params.delete("hash");
  const entries: string[] = [];
  params.forEach((value, key) => entries.push(`${key}=${value}`));
  entries.sort();
  const dataCheckString = entries.join("\n");

  // secret_key = HMAC-SHA256("WebAppData", bot_token)
  const secretKey = createHmac("sha256", "WebAppData").update(botToken).digest();

  // computed_hash = HMAC-SHA256(secret_key, data_check_string)
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  // Constant-time comparison
  const hashBuf = Buffer.from(hash, "utf8");
  const computedBuf = Buffer.from(computedHash, "utf8");
  if (hashBuf.length !== computedBuf.length || !timingSafeEqual(hashBuf, computedBuf)) {
    throw new InitDataError("INVALID_SIGNATURE", "HMAC signature mismatch");
  }

  // Check auth_date freshness
  const authDateStr = params.get("auth_date");
  if (!authDateStr) throw new InitDataError("MISSING_AUTH_DATE", "No auth_date");
  const authDate = parseInt(authDateStr, 10);
  if (isNaN(authDate)) throw new InitDataError("INVALID_AUTH_DATE", "auth_date is not a number");
  const now = Math.floor(Date.now() / 1000);
  if (now - authDate > MAX_AUTH_AGE_SECONDS) {
    throw new InitDataError("EXPIRED", "initData is too old");
  }

  // Parse user
  const userStr = params.get("user");
  if (!userStr) throw new InitDataError("MISSING_USER", "No user in initData");
  let user: TelegramUser;
  try {
    user = JSON.parse(userStr);
  } catch {
    throw new InitDataError("INVALID_USER", "user is not valid JSON");
  }
  if (!user.id || typeof user.id !== "number") {
    throw new InitDataError("INVALID_USER_ID", "user.id is missing");
  }

  return { user, authDate, hash };
}

export class InitDataError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "InitDataError";
  }
}
