import { getSupabase } from "./supabase";

const OWNER_ID = process.env.TELEGRAM_OWNER_ID ? parseInt(process.env.TELEGRAM_OWNER_ID.trim()) : 0;

/** Check if Telegram user is authorized team member */
export async function isTeamMember(telegramUserId: number): Promise<boolean> {
  // Owner always authorized
  if (telegramUserId === OWNER_ID) return true;

  const { data } = await getSupabase()
    .from("telegram_team_members")
    .select("id")
    .eq("telegram_user_id", telegramUserId)
    .eq("is_active", true)
    .maybeSingle();

  return !!data;
}
