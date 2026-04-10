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
    console.log("[Sync] Starting product sync...");
    const report = await syncProducts();
    console.log("[Sync] Complete:", report);

    // Send Telegram notification
    await sendSyncReport(report).catch((err) =>
      console.error("[Sync] Telegram notification failed:", err)
    );

    return NextResponse.json(report);
  } catch (err) {
    console.error("[Sync] Fatal error:", err);
    return NextResponse.json(
      { error: "Sync failed", details: String(err) },
      { status: 500 }
    );
  }
}

// Also allow GET for manual triggering in development
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }
  return POST(request);
}
