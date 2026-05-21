/**
 * Chat data layer — backs both the manager inbox and the client/manager chat screen.
 *
 * Tables: conversations, messages (migration 018).
 * Helper RPCs: get_or_create_my_conversation, mark_conversation_read (migration 020).
 */

import { supabase } from "./supabase";
import type { Message } from "./types";

export interface InboxRow {
  id: string;
  client_user_id: string;
  assigned_to: string | null;
  status: "open" | "closed";
  last_message_at: string;
  unread_count_staff: number;
  created_at: string;
  client_name: string;
  client_phone: string | null;
  crm_client_id: number | null;
  last_message_body: string | null;
  last_message_sender: string | null;
}

export async function fetchInbox(): Promise<InboxRow[]> {
  const { data, error } = await supabase
    .from("conversation_inbox")
    .select("*")
    .order("last_message_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as InboxRow[];
}

/**
 * Client-side: returns the conversation id for the signed-in client,
 * creating it on first call. Atomic via SECURITY DEFINER RPC.
 */
export async function getOrCreateMyConversation(): Promise<string> {
  const { data, error } = await supabase.rpc("get_or_create_my_conversation");
  if (error) throw error;
  if (typeof data !== "string") throw new Error("Unexpected RPC response");
  return data;
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Message[];
}

export async function sendMessage(conversationId: string, body: string): Promise<Message> {
  const trimmed = body.trim();
  if (!trimmed) throw new Error("Empty message");

  const { data: auth } = await supabase.auth.getUser();
  const senderId = auth.user?.id;
  if (!senderId) throw new Error("Not signed in");

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_user_id: senderId,
      body: trimmed,
    })
    .select("*")
    .single();
  if (error) throw error;

  const saved = data as Message;

  // Fire-and-forget push to the recipient. Never let this fail the send.
  notifyMessageDelivered(saved.id).catch((e) => {
    console.warn("[chat] notify-message failed:", e);
  });

  return saved;
}

async function notifyMessageDelivered(messageId: string): Promise<void> {
  const origin = process.env.EXPO_PUBLIC_WEB_ORIGIN;
  if (!origin) return;

  const { data: sessionRes } = await supabase.auth.getSession();
  const token = sessionRes.session?.access_token;
  if (!token) return;

  await fetch(`${origin}/api/mobile/notify-message`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message_id: messageId }),
  });
}

export async function markConversationRead(
  conversationId: string,
  asStaff: boolean,
): Promise<void> {
  const { error } = await supabase.rpc("mark_conversation_read", {
    p_conversation_id: conversationId,
    p_as_staff: asStaff,
  });
  if (error) throw error;
}

/**
 * Manager-only: ask the web `/api/mobile/ai-suggest` endpoint to draft a reply.
 * Returns plain text; the manager edits + sends manually.
 */
export async function requestAiSuggest(conversationId: string): Promise<string> {
  const origin = process.env.EXPO_PUBLIC_WEB_ORIGIN;
  if (!origin) throw new Error("EXPO_PUBLIC_WEB_ORIGIN not configured");

  const { data: sessionRes } = await supabase.auth.getSession();
  const token = sessionRes.session?.access_token;
  if (!token) throw new Error("Not signed in");

  const res = await fetch(`${origin}/api/mobile/ai-suggest`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversation_id: conversationId }),
  });

  const payload = (await res.json().catch(() => ({}))) as {
    text?: string;
    error?: string;
  };
  if (!res.ok) {
    throw new Error(payload.error || `AI suggest failed (${res.status})`);
  }
  return payload.text || "";
}
