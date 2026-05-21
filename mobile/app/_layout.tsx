import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import {
  configureNotificationHandler,
  registerForPushNotificationsAsync,
  setupNotificationTapHandler,
} from "@/lib/notifications";
import { colors } from "@/lib/theme";

// Foreground display behavior — set once at module load.
configureNotificationHandler();

function RootNavigator() {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Register push token once we have a signed-in profile.
  useEffect(() => {
    if (!session?.user || !profile) return;
    registerForPushNotificationsAsync(session.user.id).catch((e) => {
      console.warn("[notifications] register failed:", e);
    });
  }, [session?.user, profile]);

  // Wire deep-link routing on push tap.
  useEffect(() => {
    return setupNotificationTapHandler((path) => {
      router.push(path as never);
    });
  }, [router]);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";

    // Not signed in → force login
    if (!session && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    // Signed in but on auth screen → route by role
    if (session && profile && inAuthGroup) {
      switch (profile.role) {
        case "installer":
          router.replace("/(installer)");
          break;
        case "manager":
        case "admin":
          router.replace("/(manager)");
          break;
        case "client":
        default:
          router.replace("/(client)");
      }
    }
  }, [session, profile, loading, segments]);

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(installer)" />
      <Stack.Screen name="(manager)" />
      <Stack.Screen
        name="installation/[id]"
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
      <Stack.Screen
        name="chat/[id]"
        options={{ presentation: "card", animation: "slide_from_right" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
