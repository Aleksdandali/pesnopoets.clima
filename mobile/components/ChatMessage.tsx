import { View, Text, StyleSheet } from "react-native";
import { Sparkles } from "lucide-react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/lib/theme";

interface Props {
  body: string;
  createdAt: string;
  isOwn: boolean;
  isAi?: boolean;
}

export function ChatMessage({ body, createdAt, isOwn, isAi = false }: Props) {
  return (
    <View style={[styles.row, isOwn ? styles.rowRight : styles.rowLeft]}>
      <View
        style={[
          styles.bubble,
          isOwn ? styles.bubbleOwn : styles.bubbleOther,
          isAi && styles.bubbleAi,
        ]}
      >
        {isAi ? (
          <View style={styles.aiTag}>
            <Sparkles color={colors.accent} size={12} />
            <Text style={styles.aiTagText}>AI асистент</Text>
          </View>
        ) : null}
        <Text style={[styles.body, isOwn ? styles.bodyOwn : styles.bodyOther]}>
          {body}
        </Text>
        <Text style={[styles.time, isOwn ? styles.timeOwn : styles.timeOther]}>
          {formatTime(createdAt)}
        </Text>
      </View>
    </View>
  );
}

function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("bg-BG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

const styles = StyleSheet.create({
  row: { width: "100%", flexDirection: "row" },
  rowRight: { justifyContent: "flex-end" },
  rowLeft: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    gap: 4,
  },
  bubbleOwn: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: colors.muted,
    borderBottomLeftRadius: 4,
  },
  bubbleAi: {
    backgroundColor: colors.accentLight,
  },
  aiTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  aiTagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.accent,
  },
  body: { fontSize: fontSize.base, lineHeight: 22 },
  bodyOwn: { color: colors.primaryForeground },
  bodyOther: { color: colors.foreground },
  time: { fontSize: 11, marginTop: 2 },
  timeOwn: { color: "rgba(255,255,255,0.7)", textAlign: "right" },
  timeOther: { color: colors.mutedForeground },
});
