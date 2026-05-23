/**
 * IndexNow ping cron.
 *
 * Submits high-priority URLs from the sitemap to the IndexNow protocol so
 * Bing, Yandex and Seznam pick up content changes faster (Google does not
 * participate but reads our sitemap.xml directly).
 *
 * Protocol: https://www.indexnow.org/documentation
 *   POST https://api.indexnow.org/IndexNow
 *   Body: { host, key, keyLocation, urlList: string[] }   (≤10 000 URLs)
 *
 * The verification key file lives at /public/<key>.txt and is fetched by
 * the search engines at the URL declared in `keyLocation`.
 *
 * GET /api/cron/indexnow
 * Headers: Authorization: Bearer <CRON_SECRET>
 *
 * Wired in vercel.json — runs weekly (Monday 05:00 UTC).
 */

import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/security";
import sitemap from "@/app/sitemap";

export const runtime = "nodejs";
export const maxDuration = 60;

const INDEXNOW_KEY = "72937624e711783502213eeaae6356a4";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://pesnopoets-clima.com";
const HOST = new URL(SITE_URL).host;
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const PRIORITY_THRESHOLD = 0.8;

export async function GET(req: Request) {
  const isAuthorized = await verifyCronSecret(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await sitemap();
  const urlList = Array.from(
    new Set(
      entries
        .filter((e) => (e.priority ?? 0) >= PRIORITY_THRESHOLD)
        .map((e) => e.url)
    )
  );

  if (urlList.length === 0) {
    return NextResponse.json({ ok: true, submitted: 0 });
  }

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  const ok = res.ok || res.status === 202;
  return NextResponse.json({
    ok,
    status: res.status,
    submitted: urlList.length,
  });
}
