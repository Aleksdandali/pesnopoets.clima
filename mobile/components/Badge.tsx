import { View, Text, StyleSheet } from "react-native";
import { colors, fontSize, fontWeight, spacing } from "@/lib/theme";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "primary";

interface BadgeProps {
  tone?: BadgeTone;
  label: string;
}

export function Badge({ tone = "neutral", label }: BadgeProps) {
  const { bg, fg } = tones[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: colors.muted, fg: colors.mutedForeground },
  primary: { bg: colors.primaryLight, fg: colors.primaryDark },
  success: { bg: colors.successLight, fg: colors.success },
  warning: { bg: colors.warningLight, fg: colors.warning },
  danger: { bg: colors.dangerLight, fg: colors.danger },
};

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
