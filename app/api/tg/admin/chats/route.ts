import { NextRequest, NextResponse } from "next/server";
import { withTgAuth } from "../../../../../lib/tg-miniapp/middleware";
import { createAdminClient } from "../../../../../lib/supabase/admin";

export const GET = withTgAuth(async (req) => {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;

  const supabase = createAdminClient();

  if (sessionId) {
    const [sessionRes, messagesRes] = await Promise.all([
      supabase.from("chat_sessions").select("*").eq("id", sessionId).single(),
      supabase.from("chat_messages").select("*").eq("session_id", sessionId).order("created_at"),
    ]);
    return NextResponse.json({ session: sessionRes.data, messages: messagesRes.data ?? [] });
  }

  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) return NextResponse.json({ error: "Internal error" }, { status: 500 });
  return NextResponse.json({ sessions: data ?? [], total: count ?? 0, page, pages: Math.ceil((count ?? 0) / limit) });
});
