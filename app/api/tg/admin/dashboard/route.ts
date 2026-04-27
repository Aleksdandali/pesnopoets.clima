import { NextResponse } from "next/server";
import { withTgAuth } from "../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../lib/supabase/admin";

export const GET = withTgAuth(async () => {
  const supabase = createAdminClient();
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();

  const [leadsToday, leadsWeek, leadsNew, leadsOverdue, productsActive, chatWeek, leadsBySource, leadsByStatus, topProducts, recentLeads] = await Promise.all([
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new").lt("created_at", new Date(now.getTime() - 3600000).toISOString()),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.rpc("leads_by_source"),
    supabase.rpc("leads_by_status"),
    supabase.rpc("top_products_by_inquiries", { lim: 3 }),
    supabase.from("inquiries").select("id, name, phone, source, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);

  return NextResponse.json({
    kpi: {
      leadsToday: leadsToday.count ?? 0,
      leadsWeek: leadsWeek.count ?? 0,
      leadsNew: leadsNew.count ?? 0,
      leadsOverdue: leadsOverdue.count ?? 0,
      productsActive: productsActive.count ?? 0,
      chatWeek: chatWeek.count ?? 0,
    },
    charts: {
      leadsBySource: leadsBySource.data ?? [],
      leadsByStatus: leadsByStatus.data ?? [],
      topProducts: topProducts.data ?? [],
    },
    recentLeads: recentLeads.data ?? [],
  });
});
