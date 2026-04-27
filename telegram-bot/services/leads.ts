import { getSupabase } from "./supabase";

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string | null;
  status: string;
  admin_notes: string | null;
  locale: string;
  product_id: number | null;
  created_at: string;
}

export interface LeadWithProduct extends Lead {
  products?: { title: string; price_client: number | null; btu: number | null } | null;
}

export async function getNewLeads(limit = 5): Promise<LeadWithProduct[]> {
  const { data } = await getSupabase()
    .from("inquiries")
    .select("*, products(title, price_client, btu)")
    .eq("status", "new")
    .order("created_at", { ascending: true })
    .limit(limit);
  return data ?? [];
}

export async function getLeadById(id: number): Promise<LeadWithProduct | null> {
  const { data } = await getSupabase()
    .from("inquiries")
    .select("*, products(title, price_client, btu)")
    .eq("id", id)
    .single();
  return data;
}

export async function getNextLead(): Promise<LeadWithProduct | null> {
  const { data } = await getSupabase()
    .from("inquiries")
    .select("*, products(title, price_client, btu)")
    .eq("status", "new")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function updateLeadStatus(id: number, status: string): Promise<boolean> {
  const valid = ["new", "contacted", "completed", "cancelled"];
  if (!valid.includes(status)) return false;
  const { error } = await getSupabase()
    .from("inquiries")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return !error;
}

export async function addLeadNote(id: number, note: string): Promise<boolean> {
  const { data: existing } = await getSupabase()
    .from("inquiries")
    .select("admin_notes")
    .eq("id", id)
    .single();

  const prev = existing?.admin_notes || "";
  const timestamp = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Sofia" });
  const newNotes = prev ? `${prev}\n[${timestamp}] ${note}` : `[${timestamp}] ${note}`;

  const { error } = await getSupabase()
    .from("inquiries")
    .update({ admin_notes: newNotes.slice(0, 2000), updated_at: new Date().toISOString() })
    .eq("id", id);
  return !error;
}

export async function getDashboardKPIs() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();

  const db = getSupabase();
  const [today, week, newCount, overdue, completed, total, chatWeek] = await Promise.all([
    db.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    db.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    db.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    db.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new").lt("created_at", new Date(now.getTime() - 3600000).toISOString()),
    db.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "completed"),
    db.from("inquiries").select("id", { count: "exact", head: true }),
    db.from("chat_sessions").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
  ]);

  const t = total.count ?? 0;
  const c = completed.count ?? 0;

  return {
    leadsToday: today.count ?? 0,
    leadsWeek: week.count ?? 0,
    leadsNew: newCount.count ?? 0,
    leadsOverdue: overdue.count ?? 0,
    conversionRate: t > 0 ? Math.round(c / t * 100) : 0,
    chatWeek: chatWeek.count ?? 0,
  };
}
