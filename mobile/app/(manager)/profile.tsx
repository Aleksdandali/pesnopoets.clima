import { View, Text, Pressable, StyleSheet } from "react-native";
import { Screen } from "@/components/Screen";
import { useAuth } from "@/lib/auth-context";
import { colors, fontSize, fontWeight, radius, spacing } from "@/lib/theme";

export default function ManagerProfileScreen() {
  const { profile, signOut } = useAuth();

  return (
    <Screen title="Профил">
      <View style={styles.card}>
        <Row label="Име" value={profile?.full_name || "—"} />
        <Row label="Телефон" value={profile?.phone || "—"} />
        <Row label="Роля" value={profile?.role === "admin" ? "Админ" : "Мениджър"} />
      </View>
      <Pressable
        style={({ pressed }) => [styles.signOut, pressed && styles.signOutPressed]}
        onPress={signOut}
      >
        <Text style={styles.signOutText}>Излез</Text>
      </Pressable>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.muted,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowLabel: { color: colors.mutedForeground, fontSize: fontSize.sm },
  rowValue: {
    color: colors.foreground,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  signOut: {
    marginTop: spacing.lg,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutPressed: { backgroundColor: colors.muted },
  signOutText: {
    color: colors.danger,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
});
