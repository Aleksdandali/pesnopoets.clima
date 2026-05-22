/**
 * Google Analytics 4 Data API wrapper for the insights agent.
 *
 * Auth: service account JSON in env GA4_SERVICE_ACCOUNT_JSON.
 *   The SA must be added as Viewer on GA4 Property GA4_PROPERTY_ID.
 *
 * Public surface: getGa4Metrics({ daysBack }) — returns daily rows of
 *   sessions, users, pageviews, engaged sessions, avg engagement time.
 *
 * Never logs raw credentials. The JSON env stays in memory only.
 */

import { BetaAnalyticsDataClient } from "@google-analytics/data";

let cachedClient: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient {
  if (cachedClient) return cachedClient;
  const raw = process.env.GA4_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error("GA4_SERVICE_ACCOUNT_JSON is not set");
  const credentials = JSON.parse(raw) as {
    client_email: string;
    private_key: string;
  };
  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("GA4_SERVICE_ACCOUNT_JSON missing client_email/private_key");
  }
  cachedClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: credentials.client_email,
      private_key: credentials.private_key,
    },
  });
  return cachedClient;
}

function getPropertyPath(): string {
  const id = (process.env.GA4_PROPERTY_ID || "").trim();
  if (!id) throw new Error("GA4_PROPERTY_ID is not set");
  return `properties/${id}`;
}

export interface Ga4DailyRow {
  date: string; // YYYY-MM-DD
  sessions: number;
  active_users: number;
  new_users: number;
  page_views: number;
  engaged_sessions: number;
  avg_engagement_seconds: number;
}

function parseGa4Date(s: string): string {
  // GA4 returns "YYYYMMDD"
  if (s.length !== 8) return s;
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

export async function getGa4Daily(daysBack: number): Promise<Ga4DailyRow[]> {
  const safeDays = Math.max(1, Math.min(180, Math.floor(daysBack)));
  const [response] = await getClient().runReport({
    property: getPropertyPath(),
    dateRanges: [{ startDate: `${safeDays}daysAgo`, endDate: "today" }],
    dimensions: [{ name: "date" }],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "newUsers" },
      { name: "screenPageViews" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
    ],
    orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    limit: safeDays + 1,
  });

  const rows = response.rows ?? [];
  return rows.map((r): Ga4DailyRow => {
    const d = r.dimensionValues?.[0]?.value ?? "";
    const m = r.metricValues ?? [];
    const num = (i: number) => Number(m[i]?.value ?? 0) || 0;
    return {
      date: parseGa4Date(d),
      sessions: num(0),
      active_users: num(1),
      new_users: num(2),
      page_views: num(3),
      engaged_sessions: num(4),
      avg_engagement_seconds: Math.round(num(5)),
    };
  });
}

export interface Ga4SourceRow {
  source: string;
  medium: string;
  sessions: number;
  active_users: number;
  engaged_sessions: number;
  conversions: number;
}

export async function getGa4BySource(daysBack: number): Promise<Ga4SourceRow[]> {
  const safeDays = Math.max(1, Math.min(180, Math.floor(daysBack)));
  const [response] = await getClient().runReport({
    property: getPropertyPath(),
    dateRanges: [{ startDate: `${safeDays}daysAgo`, endDate: "today" }],
    dimensions: [
      { name: "sessionSource" },
      { name: "sessionMedium" },
    ],
    metrics: [
      { name: "sessions" },
      { name: "activeUsers" },
      { name: "engagedSessions" },
      { name: "conversions" },
    ],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 30,
  });

  const rows = response.rows ?? [];
  return rows.map((r): Ga4SourceRow => {
    const dv = r.dimensionValues ?? [];
    const m = r.metricValues ?? [];
    const num = (i: number) => Number(m[i]?.value ?? 0) || 0;
    return {
      source: dv[0]?.value ?? "(unknown)",
      medium: dv[1]?.value ?? "(unknown)",
      sessions: num(0),
      active_users: num(1),
      engaged_sessions: num(2),
      conversions: num(3),
    };
  });
}
