import { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Send, Sparkles } from "lucide-react-native";
import { colors, fontSize, radius, spacing } from "@/lib/theme";

interface Props {
  onSend: (text: string) => Promise<void> | void;
  /** Manager-only: ask the server for a suggested draft to drop into the input. */
  onSuggest?: () => Promise<string>;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatComposer({ onSend, onSuggest, placeholder, disabled }: Props) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [suggesting, setSuggesting] = useState(false);

  async function handleSend() {
    const value = text.trim();
    if (!value || sending) return;
    setSending(true);
    try {
      await onSend(value);
      setText("");
    } finally {
      setSending(false);
    }
  }

  async function handleSuggest() {
    if (!onSuggest || suggesting) return;
    setSuggesting(true);
    try {
      const draft = await onSuggest();
      if (draft) setText(draft);
    } finally {
      setSuggesting(false);
    }
  }

  const canSend = text.trim().length > 0 && !sending && !disabled;

  return (
    <View style={styles.bar}>
      {onSuggest ? (
        <Pressable
          onPress={handleSuggest}
          disabled={suggesting}
          style={({ pressed }) => [
            styles.suggestBtn,
            pressed && styles.pressed,
            suggesting && styles.suggestBtnActive,
          ]}
        >
          {suggesting ? (
            <ActivityIndicator color={colors.accent} size="small" />
          ) : (
            <Sparkles color={colors.accent} size={20} />
          )}
        </Pressable>
      ) : null}

      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder={placeholder ?? "Съобщение..."}
        placeholderTextColor={colors.mutedForeground}
        multiline
        editable={!disabled}
        maxLength={2000}
      />

      <Pressable
        onPress={handleSend}
        disabled={!canSend}
        style={({ pressed }) => [
          styles.sendBtn,
          !canSend && styles.sendBtnDisabled,
          pressed && canSend && styles.pressed,
        ]}
      >
        {sending ? (
          <ActivityIndicator color={colors.primaryForeground} size="small" />
        ) : (
          <Send color={colors.primaryForeground} size={20} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.muted,
    color: colors.foreground,
    fontSize: fontSize.base,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnDisabled: { backgroundColor: colors.border },
  suggestBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  suggestBtnActive: { backgroundColor: colors.accentLight },
  pressed: { opacity: 0.8 },
});
