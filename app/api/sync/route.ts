import { NextResponse } from "next/server";
import { syncProducts } from "@/lib/bittel/sync";
import { sendSyncReport } from "@/lib/telegram";
import { verifyCronSecret } from "@/lib/security";

export const maxDuration = 60; // Vercel function timeout

// Vercel Cron always sends GET with `Authorization: Bearer <CRON_SECRET>`.
// Previously this was POST — cron was silently 405'ing for 25+ days.
export async function GET(request: Request) {
  const isAuthorized = await verifyCronSecret(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await syncProducts();
    await sendSyncReport(report).catch((err) =>
      console.error("[Sync] Telegram notification failed:", err)
    );
    return NextResponse.json(report);
  } catch (err) {
    console.error("[Sync] Fatal error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
