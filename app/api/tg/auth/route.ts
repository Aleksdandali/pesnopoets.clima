import { NextRequest, NextResponse } from "next/server";
import { validateInitData, InitDataError } from "../../../../lib/tg-miniapp/validate-init-data";
import { createToken } from "../../../../lib/tg-miniapp/jwt";
import { isRateLimited } from "../../../../lib/tg-miniapp/rate-limit";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(`tg-auth:${ip}`, 10, 60)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body?.initData || typeof body.initData !== "string") {
      return NextResponse.json({ error: "Missing initData" }, { status: 400 });
    }

    // Validate Telegram HMAC signature
    const { user } = validateInitData(body.initData);

    // Check if this is a team member (for admin Mini App)
    const supabase = createAdminClient();
    const ownerIdStr = process.env.TELEGRAM_OWNER_ID?.trim();
    const ownerId = ownerIdStr ? parseInt(ownerIdStr) : 0;

    let isTeam = user.id === ownerId;
    if (!isTeam) {
      const { data } = await supabase
        .from("telegram_team_members")
        .select("id")
        .eq("telegram_user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();
      isTeam = !!data;
    }

    if (!isTeam) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Issue JWT
    const token = createToken({
      tgId: user.id,
      clientId: null, // admin Mini App — no client link needed
      name: user.first_name,
      type: "session",
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        languageCode: user.language_code,
      },
    });
  } catch (err) {
    if (err instanceof InitDataError) {
      console.warn("Mini App initData validation failed:", err.code);
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
    }
    console.error("TG auth error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
