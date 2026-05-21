/**
 * Thin wrappers around Supabase Realtime channels so screens stay declarative.
 *
 * Requires migration 020 (adds messages + conversations to the
 * supabase_realtime publication).
 */

import { supabase } from "./supabase";
import type { Message } from "./types";

export function subscribeToMessages(
  conversationId: string,
  onInsert: (msg: Message) => void,
): () => void {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        onInsert(payload.new as Message);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Manager inbox refresh: trigger a reload whenever ANY conversation row changes
 * (last_message_at bumps from the bump_conversation_on_message trigger).
 */
export function subscribeToInbox(onChange: () => void): () => void {
  const channel = supabase
    .channel("inbox:conversations")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "conversations" },
      onChange,
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
