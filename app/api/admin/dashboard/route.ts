import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const supabase = createAdminClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();

  const [todayRes, weekRes, newRes, productsRes, recentRes] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("inquiries").select("id, name, phone, source, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return NextResponse.json({
    leadsToday: todayRes.count ?? 0,
    leadsWeek: weekRes.count ?? 0,
    leadsNew: newRes.count ?? 0,
    productsActive: productsRes.count ?? 0,
    recentLeads: recentRes.data ?? [],
  });
}
