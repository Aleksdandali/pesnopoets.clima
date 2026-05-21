import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { colors, fontSize, fontWeight, radius, spacing } from "@/lib/theme";
import { t, type Locale } from "@/lib/i18n";

type Step = "phone" | "code";

const COPY = {
  bg: {
    title: "Влез в Песнопоец Клима",
    subtitle: "С вашия телефонен номер.",
    phoneLabel: "Телефон",
    sendCode: "Изпрати код",
    codeLabel: "Код от SMS",
    verify: "Потвърди",
    resend: "Изпрати отново",
    invalidPhone: "Невалиден номер. Формат: +359...",
    sendError: "Грешка при изпращане. Опитайте отново.",
    verifyError: "Неверен код.",
  },
  ru: {
    title: "Вход в Песнопоец Клима",
    subtitle: "По вашему номеру телефона.",
    phoneLabel: "Телефон",
    sendCode: "Отправить код",
    codeLabel: "Код из SMS",
    verify: "Подтвердить",
    resend: "Отправить снова",
    invalidPhone: "Неверный номер. Формат: +359...",
    sendError: "Ошибка отправки. Попробуйте ещё раз.",
    verifyError: "Неверный код.",
  },
} as const;

// TODO: pull from device locale; default to BG.
const locale: Locale = "bg";

export default function LoginScreen() {
  const copy = t(COPY, locale);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("+359");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSendCode() {
    const trimmed = phone.trim();
    if (!/^\+\d{10,15}$/.test(trimmed)) {
      Alert.alert(copy.invalidPhone);
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: trimmed });
    setBusy(false);
    if (error) {
      Alert.alert(copy.sendError, error.message);
      return;
    }
    setStep("code");
  }

  async function handleVerify() {
    if (code.length < 4) return;
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phone.trim(),
      token: code.trim(),
      type: "sms",
    });
    setBusy(false);
    if (error) {
      Alert.alert(copy.verifyError, error.message);
    }
    // Successful sign-in triggers onAuthStateChange in AuthProvider,
    // which navigates via RootNavigator.
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.kb}
      >
        <View style={styles.container}>
          <Text style={styles.title}>{copy.title}</Text>
          <Text style={styles.subtitle}>{copy.subtitle}</Text>

          {step === "phone" ? (
            <View style={styles.formBlock}>
              <Text style={styles.label}>{copy.phoneLabel}</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoComplete="tel"
                style={styles.input}
                placeholder="+359..."
                placeholderTextColor={colors.mutedForeground}
              />
              <Pressable
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
                onPress={handleSendCode}
                disabled={busy}
              >
                {busy ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text style={styles.ctaText}>{copy.sendCode}</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <View style={styles.formBlock}>
              <Text style={styles.label}>{copy.codeLabel}</Text>
              <TextInput
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoComplete="sms-otp"
                maxLength={6}
                style={[styles.input, styles.codeInput]}
                placeholder="123456"
                placeholderTextColor={colors.mutedForeground}
              />
              <Pressable
                style={({ pressed }) => [styles.cta, pressed && styles.ctaPressed]}
                onPress={handleVerify}
                disabled={busy}
              >
                {busy ? (
                  <ActivityIndicator color={colors.primaryForeground} />
                ) : (
                  <Text style={styles.ctaText}>{copy.verify}</Text>
                )}
              </Pressable>
              <Pressable onPress={handleSendCode} disabled={busy}>
                <Text style={styles.resend}>{copy.resend}</Text>
              </Pressable>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  kb: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing["3xl"],
  },
  title: {
    fontSize: fontSize["3xl"],
    fontWeight: fontWeight.bold,
    color: colors.foreground,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: fontSize.base,
    color: colors.mutedForeground,
    marginTop: spacing.sm,
  },
  formBlock: { marginTop: spacing["2xl"], gap: spacing.md },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.foreground,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.base,
    color: colors.foreground,
    backgroundColor: colors.background,
  },
  codeInput: {
    letterSpacing: 8,
    textAlign: "center",
    fontSize: fontSize["2xl"],
    fontWeight: fontWeight.semibold,
  },
  cta: {
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.sm,
  },
  ctaPressed: { backgroundColor: colors.primaryDark },
  ctaText: {
    color: colors.primaryForeground,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  resend: {
    color: colors.primary,
    textAlign: "center",
    marginTop: spacing.lg,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});
