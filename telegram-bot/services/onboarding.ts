/**
 * Onboarding service — helpers for the /start → Фамилия → Имя → Должность
 * conversation and the resulting owner-approval flow.
 */

import { getSupabase } from "./supabase";

export type Step = "last_name" | "first_name" | "position";

interface OnboardingState {
  telegram_user_id: number;
  telegram_username: string | null;
  step: Step;
  data: { last_name?: string; first_name?: string; position?: string };
}

interface MemberRow {
  id: number;
  status: "pending" | "approved" | "rejected";
  first_name: string | null;
  last_name: string | null;
  position: string | null;
}

/** Trim, strip control chars, clip to a sane length. */
export function sanitizeAnswer(raw: string, maxLen = 80): string {
  return raw
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

export async function getMember(telegramUserId: number): Promise<MemberRow | null> {
  const { data } = await getSupabase()
    .from("telegram_team_members")
    .select("id, status, first_name, last_name, position")
    .eq("telegram_user_id", telegramUserId)
    .maybeSingle<MemberRow>();
  return data;
}

export async function getOnboardingState(
  telegramUserId: number,
): Promise<OnboardingState | null> {
  const { data } = await getSupabase()
    .from("telegram_onboarding_state")
    .select("telegram_user_id, telegram_username, step, data")
    .eq("telegram_user_id", telegramUserId)
    .maybeSingle<OnboardingState>();
  return data;
}

export async function startOnboarding(
  telegramUserId: number,
  telegramUsername: string | null,
): Promise<void> {
  await getSupabase()
    .from("telegram_onboarding_state")
    .upsert(
      {
        telegram_user_id: telegramUserId,
        telegram_username: telegramUsername,
        step: "last_name",
        data: {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "telegram_user_id" },
    );
}

export async function advanceOnboarding(
  state: OnboardingState,
  answer: string,
): Promise<OnboardingState | "done"> {
  const next = { ...state.data };

  if (state.step === "last_name") {
    next.last_name = answer;
    return updateState(state.telegram_user_id, "first_name", next);
  }
  if (state.step === "first_name") {
    next.first_name = answer;
    return updateState(state.telegram_user_id, "position", next);
  }
  // position — final step
  next.position = answer;
  await getSupabase()
    .from("telegram_onboarding_state")
    .delete()
    .eq("telegram_user_id", state.telegram_user_id);

  await getSupabase().from("telegram_team_members").upsert(
    {
      telegram_user_id: state.telegram_user_id,
      telegram_username: state.telegram_username,
      first_name: next.first_name ?? null,
      last_name: next.last_name ?? null,
      position: next.position ?? null,
      name: [next.first_name, next.last_name].filter(Boolean).join(" ") || "—",
      role: "operator",
      status: "pending",
      is_active: false,
      requested_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "telegram_user_id" },
  );

  return "done";
}

async function updateState(
  telegramUserId: number,
  step: Step,
  data: OnboardingState["data"],
): Promise<OnboardingState> {
  const { data: row } = await getSupabase()
    .from("telegram_onboarding_state")
    .update({ step, data, updated_at: new Date().toISOString() })
    .eq("telegram_user_id", telegramUserId)
    .select("telegram_user_id, telegram_username, step, data")
    .single<OnboardingState>();
  return row!;
}

export function promptForStep(step: Step): string {
  switch (step) {
    case "last_name":
      return "Шаг 1 из 3.\n\nВведите вашу <b>Фамилию</b>.";
    case "first_name":
      return "Шаг 2 из 3.\n\nВведите ваше <b>Имя</b>.";
    case "position":
      return "Шаг 3 из 3.\n\nВведите вашу <b>Должность</b> (например: монтажник, продажи, склад).";
  }
}

/** Has a pending in-flight onboarding (used by middleware to allow text replies). */
export async function hasOnboardingState(telegramUserId: number): Promise<boolean> {
  return (await getOnboardingState(telegramUserId)) !== null;
}
