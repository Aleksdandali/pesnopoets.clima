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
  const prevWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 14).toISOString();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const thirtyDaysAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString();

  const [
    leadsToday, leadsWeek, leadsPrevWeek, leadsMonth, leadsPrevMonth,
    leadsCompleted, leadsTotal,
    leadsNew, leadsOverdue,
    clientsWeek, clientsPrevWeek,
    productsActive,
    chatWeek, chatPrevWeek,
    leadsByDay, leadsBySource, leadsByStatus, leadsByLocale,
    topProducts, chatStats,
    recentLeads,
  ] = await Promise.all([
    // KPI counts
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", todayStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", prevWeekStart).lt("created_at", weekStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", monthStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", prevMonthStart).lt("created_at", monthStart),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("inquiries").select("id, created_at", { count: "exact" }).eq("status", "new").lt("created_at", new Date(now.getTime() - 3600000).toISOString()),
    supabase.from("clients").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("clients").select("id", { count: "exact", head: true }).gte("created_at", prevWeekStart).lt("created_at", weekStart),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true }).gte("created_at", weekStart),
    supabase.from("chat_sessions").select("id", { count: "exact", head: true }).gte("created_at", prevWeekStart).lt("created_at", weekStart),
    // RPC aggregations
    supabase.rpc("leads_by_day", { since: thirtyDaysAgo }),
    supabase.rpc("leads_by_source"),
    supabase.rpc("leads_by_status"),
    supabase.rpc("leads_by_locale"),
    supabase.rpc("top_products_by_inquiries", { lim: 5 }),
    supabase.rpc("chat_stats", { since: thirtyDaysAgo }),
    // Recent activity
    supabase.from("inquiries").select("id, name, phone, source, status, locale, created_at").order("created_at", { ascending: false }).limit(10),
  ]);

  const totalCount = leadsTotal.count ?? 0;
  const completedCount = leadsCompleted.count ?? 0;

  return NextResponse.json({
    kpi: {
      leadsToday: leadsToday.count ?? 0,
      leadsWeek: leadsWeek.count ?? 0,
      leadsPrevWeek: leadsPrevWeek.count ?? 0,
      leadsMonth: leadsMonth.count ?? 0,
      leadsPrevMonth: leadsPrevMonth.count ?? 0,
      leadsNew: leadsNew.count ?? 0,
      leadsOverdue: leadsOverdue.count ?? 0,
      conversionRate: totalCount > 0 ? Math.round(completedCount / totalCount * 100) : 0,
      clientsWeek: clientsWeek.count ?? 0,
      clientsPrevWeek: clientsPrevWeek.count ?? 0,
      productsActive: productsActive.count ?? 0,
      chatWeek: chatWeek.count ?? 0,
      chatPrevWeek: chatPrevWeek.count ?? 0,
    },
    charts: {
      leadsByDay: leadsByDay.data ?? [],
      leadsBySource: leadsBySource.data ?? [],
      leadsByStatus: leadsByStatus.data ?? [],
      leadsByLocale: leadsByLocale.data ?? [],
      topProducts: topProducts.data ?? [],
      chatStats: chatStats.data ?? [],
    },
    recentLeads: recentLeads.data ?? [],
  });
}
