import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Inbox } from "lucide-react-native";
import { EmptyState } from "@/components/EmptyState";
import { fetchInbox, type InboxRow } from "@/lib/chat";
import { subscribeToInbox } from "@/lib/realtime";
import { colors, fontSize, fontWeight, radius, spacing } from "@/lib/theme";

export default function ManagerInboxScreen() {
  const router = useRouter();
  const [items, setItems] = useState<InboxRow[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchInbox();
      setItems(data);
    } catch (e) {
      Alert.alert("Грешка", (e as Error).message);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
    const unsub = subscribeToInbox(() => {
      load();
    });
    return unsub;
  }, [load]);

  async function onRefresh() {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }

  const loading = items === null;
  const empty = items?.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Входящи</Text>
        <Text style={styles.subtitle}>
          {items && items.length > 0
            ? `${items.length} ${items.length === 1 ? "разговор" : "разговора"}`
            : "Разговори с клиенти, подредени по последно съобщение."}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : empty ? (
        <EmptyState
          icon={<Inbox color={colors.primary} size={32} />}
          title="Няма активни разговори"
          description="Когато клиент напише в чата, разговорът ще се появи тук."
        />
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={(it) => it.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <InboxRowItem
              item={item}
              onPress={() => router.push(`/chat/${item.id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

interface RowProps {
  item: InboxRow;
  onPress: () => void;
}

function InboxRowItem({ item, onPress }: RowProps) {
  const hasUnread = item.unread_count_staff > 0;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initials(item.client_name)}</Text>
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTop}>
          <Text style={styles.rowName} numberOfLines={1}>
            {item.client_name}
          </Text>
          <Text style={styles.rowTime}>{formatRelative(item.last_message_at)}</Text>
        </View>
        <View style={styles.rowBottom}>
          <Text
            style={[styles.rowSnippet, hasUnread && styles.rowSnippetUnread]}
            numberOfLines={1}
          >
            {item.last_message_body || "Започнат разговор без съобщения"}
          </Text>
          {hasUnread ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread_count_staff}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "К";
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diffMin = Math.round((now - t) / 60_000);
  if (diffMin < 1) return "сега";
  if (diffMin < 60) return `преди ${diffMin} мин`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `преди ${diffH} ч`;
  return new Date(iso).toLocaleDateString("bg-BG", {
    day: "2-digit",
    month: "short",
  });
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: 2,
  },
  title: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: fontSize.sm, color: colors.mutedForeground },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  listContent: { paddingBottom: spacing["3xl"] },
  sep: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginLeft: 72,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  rowPressed: { backgroundColor: colors.muted },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.primaryDark,
  },
  rowBody: { flex: 1, gap: 2 },
  rowTop: { flexDirection: "row", justifyContent: "space-between", gap: spacing.sm },
  rowName: {
    flex: 1,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  rowTime: { fontSize: fontSize.xs, color: colors.mutedForeground },
  rowBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  rowSnippet: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  rowSnippetUnread: {
    color: colors.foreground,
    fontWeight: fontWeight.medium,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryForeground,
  },
});
