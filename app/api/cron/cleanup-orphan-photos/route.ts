/**
 * Orphan photo cleanup cron.
 *
 * Installer uploads photos at `{installation_id}/{kind}.jpg` BEFORE the
 * installations row is created (the row creation happens at form submit via
 * RPC installer_create_installation). If the installer abandons the form,
 * the photos are left orphaned in the bucket.
 *
 * This route lists root folders in the `installations` bucket, checks each
 * UUID against the installations table, and deletes any folder whose
 * youngest object is older than ORPHAN_TTL_HOURS and has no matching row.
 *
 * GET /api/cron/cleanup-orphan-photos
 * Headers: Authorization: Bearer <CRON_SECRET>
 *
 * Wired in vercel.json — runs daily at 03:00 UTC (low-traffic window).
 */

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCronSecret } from "@/lib/security";

export const runtime = "nodejs";
export const maxDuration = 60;

const BUCKET = "installations";
const ORPHAN_TTL_HOURS = 24;
const LIST_LIMIT = 1000;
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: Request) {
  const isAuthorized = await verifyCronSecret(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const cutoff = Date.now() - ORPHAN_TTL_HOURS * 3600 * 1000;

  // List root entries — each is a folder named after an installation UUID
  // (or a stray file we should ignore).
  const { data: rootEntries, error: listErr } = await admin.storage
    .from(BUCKET)
    .list("", { limit: LIST_LIMIT, offset: 0 });
  if (listErr) {
    return NextResponse.json(
      { error: "Failed to list bucket", detail: listErr.message },
      { status: 500 },
    );
  }

  const candidateIds: string[] = (rootEntries ?? [])
    .map((e) => e.name)
    .filter((name) => UUID_RE.test(name));

  if (candidateIds.length === 0) {
    return NextResponse.json({ ok: true, scanned: 0, deleted: 0 });
  }

  // Bulk-check which candidates have a matching installations row.
  const { data: existing } = await admin
    .from("installations")
    .select("id")
    .in("id", candidateIds);
  const liveIds = new Set((existing ?? []).map((r) => r.id as string));

  let deleted = 0;
  const errors: string[] = [];

  for (const id of candidateIds) {
    if (liveIds.has(id)) continue;

    // List the folder, find the youngest mtime.
    const { data: files, error: folderErr } = await admin.storage
      .from(BUCKET)
      .list(id, { limit: 100, offset: 0 });
    if (folderErr || !files || files.length === 0) {
      continue;
    }

    const youngest = files.reduce<number>((max, f) => {
      const t = f.created_at ? new Date(f.created_at).getTime() : 0;
      return t > max ? t : max;
    }, 0);

    // Skip folders with recent activity — installer might still be filling form.
    if (youngest > cutoff) continue;

    const toDelete = files.map((f) => `${id}/${f.name}`);
    const { error: delErr } = await admin.storage.from(BUCKET).remove(toDelete);
    if (delErr) {
      errors.push(`${id}: ${delErr.message}`);
      continue;
    }
    deleted += toDelete.length;
  }

  return NextResponse.json({
    ok: true,
    scanned: candidateIds.length,
    orphan_folders: candidateIds.length - liveIds.size,
    deleted_files: deleted,
    errors: errors.length > 0 ? errors : undefined,
  });
}
