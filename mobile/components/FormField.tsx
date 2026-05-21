import { ReactNode } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps } from "react-native";
import { colors, fontSize, fontWeight, radius, spacing } from "@/lib/theme";

interface FormFieldProps extends TextInputProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  trailing?: ReactNode;
}

export function FormField({
  label,
  hint,
  error,
  required,
  trailing,
  style,
  ...input
}: FormFieldProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>
          {label}
          {required ? <Text style={styles.required}> *</Text> : null}
        </Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <View
        style={[
          styles.inputWrap,
          error ? styles.inputWrapError : null,
        ]}
      >
        <TextInput
          {...input}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.input, style]}
        />
        {trailing}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.xs },
  labelRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  required: { color: colors.danger },
  hint: { fontSize: fontSize.xs, color: colors.mutedForeground },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    paddingRight: spacing.sm,
  },
  inputWrapError: { borderColor: colors.danger },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.base,
    color: colors.foreground,
  },
  error: {
    fontSize: fontSize.xs,
    color: colors.danger,
    marginTop: 2,
  },
});
