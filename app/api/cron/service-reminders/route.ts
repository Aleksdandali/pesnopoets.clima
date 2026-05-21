/**
 * Daily service-reminder cron.
 *
 * Scans `due_service_reminders` (migration 021): every installation whose
 * next_service_at lands on day +14 / +7 / today and whose owner has a push
 * token that we haven't already notified for that bucket.
 *
 * Wired via vercel.json at 09:00 UTC = 12:00 Sofia in winter / 11:00 in summer.
 * Bucket dedup via UNIQUE INDEX on notification_log(kind, ref_id, bucket).
 *
 * GET /api/cron/service-reminders
 * Headers: Authorization: Bearer <CRON_SECRET>
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCronSecret } from "@/lib/security";
import { sendExpoPush, type ExpoPushPayload } from "@/lib/push";

export const runtime = "nodejs";
export const maxDuration = 60;

interface DueRow {
  installation_id: string;
  client_id: number;
  brand: string;
  model: string;
  next_service_at: string;
  bucket: "14d" | "7d" | "0d";
  days: number;
  recipient_user_id: string;
  expo_push_token: string;
  language: "bg" | "en" | "ru" | "ua";
}

const COPY = {
  bg: {
    title14: "Профилактика след 2 седмици",
    title7: "Профилактика след 1 седмица",
    title0: "Време за профилактика днес",
    body: (brand: string, model: string) =>
      `Климатикът ${brand} ${model} се нуждае от годишна профилактика. Натиснете, за да заявите дата.`,
  },
  ru: {
    title14: "Профилактика через 2 недели",
    title7: "Профилактика через 1 неделю",
    title0: "Профилактика сегодня",
    body: (brand: string, model: string) =>
      `Кондиционеру ${brand} ${model} нужно годовое ТО. Нажмите, чтобы записаться.`,
  },
  en: {
    title14: "Maintenance in 2 weeks",
    title7: "Maintenance in 1 week",
    title0: "Maintenance due today",
    body: (brand: string, model: string) =>
      `${brand} ${model} is due for annual maintenance. Tap to schedule.`,
  },
  ua: {
    title14: "Профілактика через 2 тижні",
    title7: "Профілактика через 1 тиждень",
    title0: "Профілактика сьогодні",
    body: (brand: string, model: string) =>
      `Кондиціонеру ${brand} ${model} потрібне річне ТО. Натисніть, щоб записатися.`,
  },
};

function pickTitle(lang: DueRow["language"], bucket: DueRow["bucket"]): string {
  const c = COPY[lang] ?? COPY.bg;
  if (bucket === "14d") return c.title14;
  if (bucket === "7d") return c.title7;
  return c.title0;
}

export async function GET(req: Request) {
  const isAuthorized = await verifyCronSecret(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: due, error } = await admin
    .from("due_service_reminders")
    .select(
      "installation_id, client_id, brand, model, next_service_at, bucket, days, recipient_user_id, expo_push_token, language",
    );
  if (error) {
    return NextResponse.json(
      { error: "Failed to load due reminders", detail: error.message },
      { status: 500 },
    );
  }

  const rows = (due ?? []) as DueRow[];
  if (rows.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, due: 0 });
  }

  // Build push payloads, parallel arrays so we can correlate tickets back to rows.
  const payloads: ExpoPushPayload[] = rows.map((r) => {
    const copy = COPY[r.language] ?? COPY.bg;
    return {
      to: r.expo_push_token,
      title: pickTitle(r.language, r.bucket),
      body: copy.body(r.brand || "Климатик", r.model || ""),
      sound: "default",
      data: {
        kind: "service_reminder",
        installation_id: r.installation_id,
        bucket: r.bucket,
      },
    };
  });

  // Expo accepts up to 100 per batch — chunk just in case.
  const CHUNK = 100;
  const logRows: Array<{
    recipient_user_id: string;
    kind: "service_reminder";
    ref_id: string;
    bucket: string;
    expo_ticket_id: string | null;
    status: "sent" | "failed";
    error: string | null;
  }> = [];

  for (let i = 0; i < payloads.length; i += CHUNK) {
    const slice = payloads.slice(i, i + CHUNK);
    const rowSlice = rows.slice(i, i + CHUNK);
    try {
      const tickets = await sendExpoPush(slice);
      for (let j = 0; j < rowSlice.length; j++) {
        const r = rowSlice[j];
        const t = tickets[j];
        if (!r) continue;
        logRows.push({
          recipient_user_id: r.recipient_user_id,
          kind: "service_reminder",
          ref_id: r.installation_id,
          bucket: r.bucket,
          expo_ticket_id: t?.id ?? null,
          status: t?.status === "ok" ? "sent" : "failed",
          error:
            t?.status === "error"
              ? t?.message ?? t?.details?.error ?? null
              : null,
        });
      }
    } catch (err) {
      for (const r of rowSlice) {
        logRows.push({
          recipient_user_id: r.recipient_user_id,
          kind: "service_reminder",
          ref_id: r.installation_id,
          bucket: r.bucket,
          expo_ticket_id: null,
          status: "failed",
          error: err instanceof Error ? err.message : "Push batch failed",
        });
      }
    }
  }

  if (logRows.length > 0) {
    // Upsert with ignoreDuplicates so a re-run on the same day is a no-op
    // (the partial UNIQUE INDEX on kind/ref_id/bucket guards reminders).
    const { error: logErr } = await admin
      .from("notification_log")
      .upsert(logRows, {
        onConflict: "kind,ref_id,bucket",
        ignoreDuplicates: true,
      });
    if (logErr) {
      console.error("[service-reminders] log upsert failed:", logErr.message);
    }
  }

  const sent = logRows.filter((r) => r.status === "sent").length;
  return NextResponse.json({ ok: true, due: rows.length, sent });
}
