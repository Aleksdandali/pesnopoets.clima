import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyAdmin, verifyAdminWithBody } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  const auth = verifyAdmin(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim();
  const tag = url.searchParams.get("tag")?.trim();
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
  const limit = 20;
  const offset = (page - 1) * limit;

  const supabase = createAdminClient();

  let query = supabase
    .from("clients")
    .select("*", { count: "exact" })
    .order("last_inquiry_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  }
  if (tag) {
    query = query.contains("tags", [tag]);
  }

  const { data, count, error } = await query;

  if (error) {
    console.error("Clients fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({
    clients: data ?? [],
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, password, ...fields } = body as Record<string, unknown>;

  const auth = verifyAdminWithBody(req, password as string);
  if (!auth.ok) return auth.response;

  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

  const allowed = new Set(["name", "email", "notes", "tags", "telegram_id"]);
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const [key, value] of Object.entries(fields)) {
    if (!allowed.has(key)) continue;
    if (key === "tags" && Array.isArray(value)) {
      update.tags = value.map((t) => String(t).slice(0, 50)).slice(0, 10);
    } else if (typeof value === "string") {
      update[key] = value.slice(0, 500) || null;
    }
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("clients").update(update).eq("id", id);

  if (error) {
    console.error("Client update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
