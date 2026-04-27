import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Upsert a client by phone number. Returns client_id.
 * Creates new client if phone doesn't exist, updates name/email/locale if it does.
 * Non-blocking — errors are silently ignored (inquiry still goes through).
 */
export async function upsertClient(
  supabase: SupabaseClient,
  data: { phone: string; name: string; email?: string; locale?: string }
): Promise<number | null> {
  try {
    const phone = data.phone.replace(/\s/g, "");
    if (!phone || phone.length < 6) return null;

    // Try to find existing client
    const { data: existing } = await supabase
      .from("clients")
      .select("id, total_inquiries")
      .eq("phone", phone)
      .single();

    if (existing) {
      // Update last activity
      const updates: Record<string, unknown> = {
        last_inquiry_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      if (data.name) updates.name = data.name;
      if (data.email) updates.email = data.email;
      if (data.locale) updates.locale = data.locale;

      await supabase.from("clients").update(updates).eq("id", existing.id);

      // Increment total_inquiries via raw SQL-safe update
      await supabase.from("clients")
        .update({ total_inquiries: (existing.total_inquiries || 0) + 1 })
        .eq("id", existing.id);

      return existing.id;
    }

    // Create new client
    const { data: newClient } = await supabase
      .from("clients")
      .insert({
        phone,
        name: data.name,
        email: data.email || null,
        locale: data.locale || "bg",
        total_inquiries: 1,
        last_inquiry_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    return newClient?.id ?? null;
  } catch {
    return null;
  }
}
