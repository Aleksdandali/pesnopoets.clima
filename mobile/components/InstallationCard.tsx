import { useEffect, useState } from "react";
import { View, Text, Pressable, Image, StyleSheet } from "react-native";
import { Snowflake, ChevronRight } from "lucide-react-native";
import { Badge, type BadgeTone } from "./Badge";
import { colors, fontSize, fontWeight, radius, spacing, shadow } from "@/lib/theme";
import { getSignedPhotoUrl, daysUntilService, type InstallationSummary } from "@/lib/client";

interface Props {
  item: InstallationSummary;
  onPress: () => void;
}

export function InstallationCard({ item, onPress }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const primaryPath = item.indoor_photo_path ?? item.outdoor_photo_path;

  useEffect(() => {
    let mounted = true;
    getSignedPhotoUrl(primaryPath).then((url) => mounted && setPhotoUrl(url));
    return () => {
      mounted = false;
    };
  }, [primaryPath]);

  const days = daysUntilService(item.next_service_at);
  const badge = serviceBadge(days);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.thumb}>
        {photoUrl ? (
          <Image source={{ uri: photoUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.thumbEmpty}>
            <Snowflake color={colors.primary} size={28} />
          </View>
        )}
      </View>
      <View style={styles.body}>
        <View style={{ gap: 2 }}>
          <Text style={styles.brand} numberOfLines={1}>
            {item.brand || "Климатик"}
          </Text>
          <Text style={styles.model} numberOfLines={1}>
            {item.model}
            {item.btu ? ` • ${item.btu.toLocaleString("bg-BG")} BTU` : ""}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Badge tone={badge.tone} label={badge.label} />
          <ChevronRight color={colors.mutedForeground} size={18} />
        </View>
      </View>
    </Pressable>
  );
}

function serviceBadge(days: number): { tone: BadgeTone; label: string } {
  if (days < 0) return { tone: "danger", label: `Профилактика просрочена с ${-days} дни` };
  if (days === 0) return { tone: "warning", label: "Профилактика днес" };
  if (days <= 7) return { tone: "warning", label: `Профилактика след ${days} дни` };
  if (days <= 30) return { tone: "primary", label: `Профилактика след ${days} дни` };
  return { tone: "success", label: `Профилактика след ${days} дни` };
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadow.sm,
  },
  pressed: { opacity: 0.92, transform: [{ scale: 0.997 }] },
  thumb: {
    width: 96,
    height: 96,
    backgroundColor: colors.primaryLight,
  },
  thumbEmpty: { flex: 1, alignItems: "center", justifyContent: "center" },
  image: { width: "100%", height: "100%" },
  body: {
    flex: 1,
    padding: spacing.md,
    justifyContent: "space-between",
  },
  brand: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  model: {
    fontSize: fontSize.sm,
    color: colors.mutedForeground,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
