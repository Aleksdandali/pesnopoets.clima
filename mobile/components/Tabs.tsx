import { Tabs } from "expo-router";
import { colors, fontSize, fontWeight } from "@/lib/theme";

/**
 * Shared screen options for bottom tab bars across all role groups.
 * Keeps visual consistency with web (primary blue active, muted inactive).
 */
export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.mutedForeground,
  tabBarStyle: {
    borderTopColor: colors.border,
    backgroundColor: colors.background,
    height: 84,
    paddingTop: 8,
    paddingBottom: 28,
  },
  tabBarLabelStyle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as "500",
  },
} as const;

export { Tabs };
