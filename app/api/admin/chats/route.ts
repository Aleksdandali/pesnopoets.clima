import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session_id");
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;

  const supabase = createAdminClient();

  // Single session with messages
  if (sessionId) {
    const [sessionRes, messagesRes] = await Promise.all([
      supabase.from("chat_sessions").select("*").eq("id", sessionId).single(),
      supabase.from("chat_messages").select("*").eq("session_id", sessionId).order("created_at"),
    ]);
    return NextResponse.json({
      session: sessionRes.data,
      messages: messagesRes.data ?? [],
    });
  }

  // List sessions
  const offset = (page - 1) * limit;
  const { data, count, error } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("Chats fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({
    sessions: data ?? [],
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
}
