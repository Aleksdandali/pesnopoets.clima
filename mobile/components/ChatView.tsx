import { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { MessageCircle } from "lucide-react-native";
import { ChatMessage } from "./ChatMessage";
import { ChatComposer } from "./ChatComposer";
import { EmptyState } from "./EmptyState";
import {
  fetchMessages,
  sendMessage,
  markConversationRead,
  requestAiSuggest,
} from "@/lib/chat";
import { subscribeToMessages } from "@/lib/realtime";
import { colors, fontSize, spacing } from "@/lib/theme";
import type { Message } from "@/lib/types";

interface Props {
  conversationId: string;
  currentUserId: string;
  /** When true, shows the AI-suggest button + marks conv read as staff. */
  asStaff: boolean;
}

export function ChatView({ conversationId, currentUserId, asStaff }: Props) {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const listRef = useRef<FlatList<Message>>(null);

  const load = useCallback(async () => {
    try {
      const data = await fetchMessages(conversationId);
      setMessages(data);
    } catch (e) {
      Alert.alert("Грешка", (e as Error).message);
      setMessages([]);
    }
  }, [conversationId]);

  // Initial load + mark read
  useEffect(() => {
    load();
    markConversationRead(conversationId, asStaff).catch(() => {});
  }, [conversationId, asStaff, load]);

  // Realtime: append new messages as they arrive
  useEffect(() => {
    const unsub = subscribeToMessages(conversationId, (msg) => {
      setMessages((prev) => {
        if (!prev) return [msg];
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
      // If a new message arrives from the OTHER side while screen is open, ack it.
      if (msg.sender_user_id !== currentUserId) {
        markConversationRead(conversationId, asStaff).catch(() => {});
      }
    });
    return unsub;
  }, [conversationId, asStaff, currentUserId]);

  // Auto-scroll to bottom on message change
  useEffect(() => {
    if (!messages || messages.length === 0) return;
    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [messages]);

  async function handleSend(text: string) {
    try {
      // Optimistic append
      const optimistic: Message = {
        id: `tmp-${Date.now()}`,
        conversation_id: conversationId,
        sender_user_id: currentUserId,
        body: text,
        attachments: [],
        is_ai: false,
        read_at: null,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => (prev ? [...prev, optimistic] : [optimistic]));

      const saved = await sendMessage(conversationId, text);

      // Replace optimistic with real (or de-dupe if realtime already added it)
      setMessages((prev) => {
        if (!prev) return [saved];
        const withoutTmp = prev.filter((m) => m.id !== optimistic.id);
        if (withoutTmp.some((m) => m.id === saved.id)) return withoutTmp;
        return [...withoutTmp, saved];
      });
    } catch (e) {
      Alert.alert("Грешка", (e as Error).message);
      // Roll back optimistic
      setMessages((prev) => (prev ? prev.filter((m) => !m.id.startsWith("tmp-")) : prev));
    }
  }

  async function handleSuggest(): Promise<string> {
    try {
      return await requestAiSuggest(conversationId);
    } catch (e) {
      Alert.alert("AI грешка", (e as Error).message);
      return "";
    }
  }

  if (messages === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      {messages.length === 0 ? (
        <View style={styles.flex}>
          <EmptyState
            icon={<MessageCircle color={colors.primary} size={32} />}
            title={asStaff ? "Няма съобщения" : "Започнете разговор"}
            description={
              asStaff
                ? "Изчакайте първото съобщение от клиента."
                : "Задайте въпрос за климатика, заявете профилактика или поискайте оферта."
            }
          />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          renderItem={({ item }) => (
            <ChatMessage
              body={item.body}
              createdAt={item.created_at}
              isOwn={item.sender_user_id === currentUserId}
              isAi={item.is_ai}
            />
          )}
          ListFooterComponent={<DayMarkerFooter messages={messages} />}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
        />
      )}

      <ChatComposer
        onSend={handleSend}
        onSuggest={asStaff ? handleSuggest : undefined}
        placeholder={asStaff ? "Отговор към клиента..." : "Съобщение..."}
      />
    </KeyboardAvoidingView>
  );
}

function DayMarkerFooter({ messages }: { messages: Message[] }) {
  const last = messages[messages.length - 1];
  if (!last) return null;
  return (
    <Text style={styles.marker}>
      {new Date(last.created_at).toLocaleDateString("bg-BG", {
        day: "2-digit",
        month: "long",
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  marker: {
    textAlign: "center",
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
    marginTop: spacing.md,
  },
});
