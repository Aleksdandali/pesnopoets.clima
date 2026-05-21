/**
 * Design tokens — mirror the web project's app/globals.css 1:1
 * so that web ↔ mobile feel visually identical.
 */

export const colors = {
  background: "#ffffff",
  foreground: "#0f172a",
  muted: "#f8fafc",
  mutedForeground: "#475569",
  border: "#e2e8f0",
  ring: "#0ea5e9",

  // Brand — cool blue gradient
  primary: "#0284c7",
  primaryForeground: "#ffffff",
  primaryLight: "#e0f2fe",
  primaryDark: "#0369a1",
  surfaceDark: "#0a1628",

  // Accent — fresh mint/teal
  accent: "#0d9488",
  accentForeground: "#ffffff",
  accentLight: "#ccfbf1",

  // Status — contrast-compliant
  success: "#15803d",
  successLight: "#dcfce7",
  warning: "#b45309",
  warningLight: "#fef3c7",
  danger: "#b91c1c",
  dangerLight: "#fee2e2",
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
  "4xl": 36,
} as const;

export const fontWeight = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export const shadow = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 6,
  },
} as const;

export const theme = { colors, radius, spacing, fontSize, fontWeight, shadow };
export type Theme = typeof theme;
