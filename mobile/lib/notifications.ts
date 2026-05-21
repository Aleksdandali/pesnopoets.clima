/**
 * Push notification setup.
 *
 * - registerForPushNotificationsAsync: requests permission, fetches the Expo
 *   push token, and stores it on the user's profile so the web cron + chat
 *   notify routes can reach this device.
 * - configureNotificationHandler: foreground display behavior.
 * - setupNotificationTapHandler: deep-link routing when the user taps a push.
 *
 * Hooked into AuthProvider — registration runs after the user signs in and
 * the profile is loaded (we need profile.id to write expo_push_token).
 *
 * Push delivery requires a custom dev/preview build — Expo Go does NOT support
 * remote pushes for projects using the new architecture. EAS Build → preview
 * profile is the supported path.
 */

import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { supabase } from "./supabase";
import { colors } from "./theme";

export function configureNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function registerForPushNotificationsAsync(
  userId: string,
): Promise<string | null> {
  if (!Device.isDevice) {
    // Simulator can't receive pushes. Silent no-op.
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colors.primary,
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;
  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return null;
  }

  // EAS project id is required for remote pushes in SDK 49+.
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants as { easConfig?: { projectId?: string } }).easConfig?.projectId;
  if (!projectId) {
    console.warn(
      "[notifications] missing EAS projectId — push token cannot be issued.",
    );
    return null;
  }

  let token: string;
  try {
    const res = await Notifications.getExpoPushTokenAsync({ projectId });
    token = res.data;
  } catch (e) {
    console.warn("[notifications] getExpoPushTokenAsync failed:", e);
    return null;
  }

  // Persist to profile (idempotent — only write if changed)
  const { data: profile } = await supabase
    .from("profiles")
    .select("expo_push_token")
    .eq("id", userId)
    .single();

  if (profile?.expo_push_token !== token) {
    const { error } = await supabase
      .from("profiles")
      .update({ expo_push_token: token })
      .eq("id", userId);
    if (error) {
      console.warn("[notifications] failed to save token:", error.message);
    }
  }

  return token;
}

export interface NotificationData {
  kind?: "message" | "service_reminder";
  conversation_id?: string;
  installation_id?: string;
  message_id?: string;
  bucket?: string;
}

/**
 * Wire taps: returns an unsubscribe function. Caller (root layout) provides
 * the router so we can navigate without coupling this file to expo-router types.
 */
export function setupNotificationTapHandler(
  navigate: (path: string) => void,
): () => void {
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = (response.notification.request.content.data ??
      {}) as NotificationData;
    if (data.kind === "message" && data.conversation_id) {
      navigate(`/chat/${data.conversation_id}`);
    } else if (data.kind === "service_reminder" && data.installation_id) {
      navigate(`/installation/${data.installation_id}`);
    }
  });

  return () => sub.remove();
}
