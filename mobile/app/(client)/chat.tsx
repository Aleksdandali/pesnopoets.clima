import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChatView } from "@/components/ChatView";
import { useAuth } from "@/lib/auth-context";
import { getOrCreateMyConversation } from "@/lib/chat";
import { colors, fontSize, fontWeight, spacing } from "@/lib/theme";

export default function ClientChatScreen() {
  const { session } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getOrCreateMyConversation()
      .then((id) => {
        if (mounted) setConversationId(id);
      })
      .catch((e) => {
        Alert.alert("Грешка", (e as Error).message);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!session || !conversationId) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Чат с техник</Text>
        <Text style={styles.subtitle}>
          Работно време 9:00–18:00. Извън него отговаря AI асистент.
        </Text>
      </View>
      <ChatView
        conversationId={conversationId}
        currentUserId={session.user.id}
        asStaff={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: fontSize.sm, color: colors.mutedForeground },
});
