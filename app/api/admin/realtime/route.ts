/**
 * /api/admin/realtime
 *   GET — GA4 realtime snapshot (active users in last 30 min, top pages,
 *         per-minute timeline). Polled by the dashboard widget every ~20s.
 *
 * Returns 503 if the GA4 SA isn't configured or doesn't have Viewer access
 * on the property — the widget shows a setup hint in that case.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getGa4Realtime } from "@/lib/insights/ga4";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  if (!process.env.GA4_SERVICE_ACCOUNT_JSON || !process.env.GA4_PROPERTY_ID) {
    return NextResponse.json(
      { ok: false, error: "GA4 not configured" },
      { status: 503 },
    );
  }

  try {
    const snapshot = await getGa4Realtime();
    return NextResponse.json({ ok: true, ...snapshot });
  } catch (err) {
    const message = err instanceof Error ? err.message : "GA4 fetch failed";
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
