import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Snowflake } from "lucide-react-native";
import { EmptyState } from "@/components/EmptyState";
import { InstallationCard } from "@/components/InstallationCard";
import {
  fetchMyInstallations,
  type InstallationSummary,
} from "@/lib/client";
import { colors, fontSize, fontWeight, spacing } from "@/lib/theme";

export default function ClientHomeScreen() {
  const router = useRouter();
  const [items, setItems] = useState<InstallationSummary[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchMyInstallations();
      setItems(data);
    } catch (e) {
      Alert.alert("Грешка", (e as Error).message);
      setItems([]);
    }
  }, []);

  useEffect(() => {
    load();
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
        <Text style={styles.title}>Моите климатици</Text>
        <Text style={styles.subtitle}>
          {items && items.length > 0
            ? `${items.length} ${items.length === 1 ? "уред" : "уреда"}`
            : "Гаранция, профилактика и история на работите."}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : empty ? (
        <EmptyState
          icon={<Snowflake color={colors.primary} size={32} />}
          title="Все още нямате регистрирани климатици"
          description="След като нашият техник завърши монтажа, вашият климатик ще се появи тук с пълна информация и график за профилактика."
        />
      ) : (
        <FlatList
          data={items ?? []}
          keyExtractor={(it) => it.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          renderItem={({ item }) => (
            <InstallationCard
              item={item}
              onPress={() => router.push(`/installation/${item.id}`)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
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
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing["3xl"] },
  loadingWrap: { flex: 1, alignItems: "center", justifyContent: "center" },
});
