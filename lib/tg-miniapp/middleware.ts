import { NextRequest, NextResponse } from "next/server";
import { verifyToken, JwtError, type TgSession } from "./jwt";
import { isRateLimited } from "./rate-limit";

type AuthHandler = (req: NextRequest, session: TgSession & { iat: number; exp: number; jti: string }) => Promise<NextResponse>;

interface Options {
  allowTemp?: boolean;
}

/**
 * Auth middleware for /api/tg/* routes.
 * Validates JWT from Authorization: Bearer header.
 *
 * Usage:
 *   export const GET = withTgAuth(async (req, session) => {
 *     // session.clientId, session.tgId available
 *     return NextResponse.json({ ... });
 *   });
 */
export function withTgAuth(handler: AuthHandler, options: Options = {}) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing authorization" }, { status: 401 });
    }

    try {
      const session = verifyToken(auth.slice(7));

      if (!options.allowTemp && session.type === "temp") {
        return NextResponse.json({ error: "Phone verification required" }, { status: 403 });
      }

      if (session.type === "session" && !session.clientId) {
        return NextResponse.json({ error: "Invalid session" }, { status: 403 });
      }

      // Per-user rate limit: 60 req/min
      if (isRateLimited(`tg-api:${session.tgId}`, 60, 60)) {
        return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
      }

      return await handler(req, session);
    } catch (err) {
      if (err instanceof JwtError) {
        return NextResponse.json(
          { error: "Authentication failed", code: err.code === "EXPIRED" ? "TOKEN_EXPIRED" : undefined },
          { status: 401 }
        );
      }
      console.error("TG auth error:", err);
      return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
  };
}
