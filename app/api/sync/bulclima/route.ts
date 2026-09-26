import { NextResponse } from "next/server";
import { syncBulclimaProducts } from "@/lib/bulclima/sync";
import { sendSyncReport } from "@/lib/telegram";
import { verifyCronSecret } from "@/lib/security";

// ~650 feed items fetched in ~5 s and written in batches of 100 — far below the limit.
export const maxDuration = 300;

export async function GET(request: Request) {
  const isAuthorized = await verifyCronSecret(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await syncBulclimaProducts();
    const { skipped, unmappedCategories } = report;
    const label = (key: string) => key.split("|").map((part) => part || "—").join(" / ");
    const notes = [
      `⏭ Извън каталога: ${skipped.outOfScope}`,
      skipped.duplicate > 0 ? `♊ Дубликати на Bittel: ${skipped.duplicate}` : null,
      skipped.noPrice > 0 ? `💸 Без цена: ${skipped.noPrice}` : null,
      unmappedCategories.length > 0
        ? `❓ Без съответствие на категория (${skipped.unmappedCategory}): ${unmappedCategories.map(label).join("; ")}`
        : null,
    ].filter((n): n is string => n !== null);
    await sendSyncReport(report, { supplier: "Bulclima", notes }).catch((err) =>
      console.error("[Bulclima sync] Telegram notification failed:", err)
    );
    return NextResponse.json(report);
  } catch (err) {
    console.error("[Bulclima sync] Fatal error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
