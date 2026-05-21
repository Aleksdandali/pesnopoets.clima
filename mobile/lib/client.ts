import { supabase } from "./supabase";

export interface InstallationSummary {
  id: string;
  client_id: number;
  brand: string;
  model: string;
  serial: string | null;
  btu: number | null;
  install_date: string;
  warranty_months: number;
  warranty_until: string;
  next_service_at: string;
  indoor_photo_path: string | null;
  outdoor_photo_path: string | null;
  label_photo_path: string | null;
  address: string | null;
}

export interface InstallationFull extends InstallationSummary {
  extra_photo_paths: string[];
  notes: string | null;
}

/**
 * Fetch summary list for client home — uses the SECURITY-DEFINER-friendly
 * view created in migration 019, gated by RLS on `installations` underneath.
 */
export async function fetchMyInstallations(): Promise<InstallationSummary[]> {
  const { data, error } = await supabase
    .from("client_installation_summary")
    .select("*")
    .order("install_date", { ascending: false });

  if (error) throw error;
  return (data ?? []) as InstallationSummary[];
}

export async function fetchInstallation(id: string): Promise<InstallationFull | null> {
  const { data, error } = await supabase
    .from("installations")
    .select(
      "id, client_id, brand, model, serial, btu, install_date, warranty_months, next_service_at, " +
        "indoor_photo_path, outdoor_photo_path, label_photo_path, extra_photo_paths, address, notes",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const warrantyUntil = addMonths(new Date(data.install_date), data.warranty_months)
    .toISOString()
    .slice(0, 10);

  return { ...(data as Omit<InstallationFull, "warranty_until">), warranty_until: warrantyUntil };
}

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

/**
 * Signed URL cache — Storage bucket is private; sign each path for 1h and
 * memoize so a list scroll doesn't refetch URLs on every render.
 */
const urlCache = new Map<string, { url: string; expires: number }>();
const SIGN_TTL_SEC = 3600;

export async function getSignedPhotoUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  const cached = urlCache.get(path);
  const now = Date.now();
  if (cached && cached.expires > now + 60_000) return cached.url;

  const { data, error } = await supabase.storage
    .from("installations")
    .createSignedUrl(path, SIGN_TTL_SEC);
  if (error || !data) return null;

  urlCache.set(path, { url: data.signedUrl, expires: now + SIGN_TTL_SEC * 1000 });
  return data.signedUrl;
}

export async function getSignedPhotoUrls(paths: Array<string | null>): Promise<Array<string | null>> {
  return Promise.all(paths.map(getSignedPhotoUrl));
}

/**
 * Create a service_job row in status='requested'. RLS in migration 018 allows
 * this only when the installation belongs to the current user's client_id.
 */
export async function requestMaintenance(installationId: string): Promise<void> {
  const { error } = await supabase
    .from("service_jobs")
    .insert({ installation_id: installationId, type: "maintenance", status: "requested" });
  if (error) throw error;
}

export interface ServiceJobSummary {
  id: string;
  type: "maintenance" | "repair";
  status: "requested" | "scheduled" | "in_progress" | "done" | "cancelled";
  scheduled_at: string | null;
  completed_at: string | null;
  work_done: string | null;
  price_eur: number | null;
  created_at: string;
}

export async function fetchInstallationJobs(installationId: string): Promise<ServiceJobSummary[]> {
  const { data, error } = await supabase
    .from("service_jobs")
    .select("id, type, status, scheduled_at, completed_at, work_done, price_eur, created_at")
    .eq("installation_id", installationId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ServiceJobSummary[];
}

/**
 * Days until next maintenance is due. Negative if overdue.
 */
export function daysUntilService(nextServiceAt: string): number {
  const next = new Date(nextServiceAt + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const ms = next.getTime() - today.getTime();
  return Math.round(ms / 86_400_000);
}
