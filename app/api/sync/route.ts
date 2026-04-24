import { NextResponse } from "next/server";
import { syncProducts } from "@/lib/bittel/sync";
import { sendSyncReport } from "@/lib/telegram";
import { verifyCronSecret } from "@/lib/security";

export const maxDuration = 60; // Vercel function timeout

export async function POST(request: Request) {
  // Verify cron secret
  const isAuthorized = await verifyCronSecret(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await syncProducts();

    // Send Telegram notification
    await sendSyncReport(report).catch((err) =>
      console.error("[Sync] Telegram notification failed:", err)
    );

    return NextResponse.json(report);
  } catch (err) {
    console.error("[Sync] Fatal error:", err);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}

// Sync is POST-only, triggered by Vercel Cron
