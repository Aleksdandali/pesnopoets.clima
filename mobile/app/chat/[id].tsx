import { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Phone } from "lucide-react-native";
import { ChatView } from "@/components/ChatView";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { colors, fontSize, fontWeight, spacing } from "@/lib/theme";

interface PartnerInfo {
  name: string;
  phone: string | null;
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session, profile } = useAuth();
  const [partner, setPartner] = useState<PartnerInfo | null>(null);

  const conversationId = typeof id === "string" ? id : "";
  const isStaff =
    profile?.role === "manager" ||
    profile?.role === "admin" ||
    profile?.role === "installer";

  useEffect(() => {
    if (!conversationId) return;
    let mounted = true;

    (async () => {
      try {
        if (isStaff) {
          // Staff: fetch client info from the inbox view
          const { data, error } = await supabase
            .from("conversation_inbox")
            .select("client_name, client_phone")
            .eq("id", conversationId)
            .single();
          if (error) throw error;
          if (mounted) {
            setPartner({
              name: (data?.client_name as string) || "Клиент",
              phone: (data?.client_phone as string | null) ?? null,
            });
          }
        } else {
          // Client: partner is the shop
          if (mounted) setPartner({ name: "Песнопоец Клима", phone: null });
        }
      } catch (e) {
        Alert.alert("Грешка", (e as Error).message);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [conversationId, isStaff]);

  if (!session || !profile || !conversationId) {
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
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
          hitSlop={12}
        >
          <ArrowLeft color={colors.foreground} size={22} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={styles.headerName} numberOfLines={1}>
            {partner?.name ?? "..."}
          </Text>
          {partner?.phone ? (
            <Text style={styles.headerSub} numberOfLines={1}>
              {partner.phone}
            </Text>
          ) : null}
        </View>
        {partner?.phone ? (
          <Pressable
            onPress={() => {
              const tel = `tel:${partner.phone!.replace(/\s+/g, "")}`;
              Linking.openURL(tel).catch(() => {
                Alert.alert("Грешка", "Не може да се отвори телефонното приложение.");
              });
            }}
            style={({ pressed }) => [styles.iconBtn, pressed && styles.pressed]}
            hitSlop={12}
          >
            <Phone color={colors.primary} size={20} />
          </Pressable>
        ) : (
          <View style={styles.iconBtn} />
        )}
      </View>

      <ChatView
        conversationId={conversationId}
        currentUserId={session.user.id}
        asStaff={isStaff}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.6 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.foreground,
  },
  headerSub: {
    fontSize: fontSize.xs,
    color: colors.mutedForeground,
  },
});
