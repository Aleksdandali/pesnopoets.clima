"use client";

import { useEffect, useState, useCallback } from "react";

interface TgUser {
  id: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}

interface TgTheme {
  bg: string;
  bgSecondary: string;
  text: string;
  hint: string;
  link: string;
  button: string;
  buttonText: string;
  isDark: boolean;
}

interface TgContext {
  ready: boolean;
  user: TgUser | null;
  theme: TgTheme;
  initData: string;
  haptic: {
    light: () => void;
    medium: () => void;
    success: () => void;
    error: () => void;
    select: () => void;
  };
  showBackButton: (onClick: () => void) => void;
  hideBackButton: () => void;
  setMainButton: (text: string, onClick: () => void) => void;
  hideMainButton: () => void;
  close: () => void;
}

const DEFAULT_THEME: TgTheme = {
  bg: "#ffffff", bgSecondary: "#f8fafc", text: "#0f172a",
  hint: "#475569", link: "#0284c7", button: "#0284c7",
  buttonText: "#ffffff", isDark: false,
};

function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export function useTelegram(): TgContext {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<TgUser | null>(null);
  const [theme, setTheme] = useState<TgTheme>(DEFAULT_THEME);
  const [initData, setInitData] = useState("");

  useEffect(() => {
    const tg = (window as unknown as { Telegram?: { WebApp?: Record<string, unknown> } }).Telegram?.WebApp;
    if (!tg) {
      // Dev mode — no Telegram context
      setReady(true);
      setUser({ id: 0, firstName: "Dev" });
      return;
    }

    // Signal ready to Telegram
    (tg as { ready?: () => void }).ready?.();

    // Expand to full height
    (tg as { expand?: () => void }).expand?.();

    // Parse user
    const tgUser = tg.initDataUnsafe as { user?: { id: number; first_name: string; last_name?: string; username?: string; language_code?: string } } | undefined;
    if (tgUser?.user) {
      setUser({
        id: tgUser.user.id,
        firstName: tgUser.user.first_name,
        lastName: tgUser.user.last_name,
        username: tgUser.user.username,
        languageCode: tgUser.user.language_code,
      });
    }

    setInitData(tg.initData as string || "");

    // Parse theme
    const tp = tg.themeParams as Record<string, string> | undefined;
    if (tp) {
      const bg = tp.bg_color || "#ffffff";
      setTheme({
        bg,
        bgSecondary: tp.secondary_bg_color || "#f8fafc",
        text: tp.text_color || "#0f172a",
        hint: tp.hint_color || "#475569",
        link: tp.link_color || "#0284c7",
        button: tp.button_color || "#0284c7",
        buttonText: tp.button_text_color || "#ffffff",
        isDark: isColorDark(bg),
      });
    }

    setReady(true);

    // Listen for theme changes
    const onThemeChange = () => {
      const newTp = (window as unknown as { Telegram?: { WebApp?: { themeParams?: Record<string, string> } } }).Telegram?.WebApp?.themeParams;
      if (newTp) {
        const newBg = newTp.bg_color || "#ffffff";
        setTheme({
          bg: newBg,
          bgSecondary: newTp.secondary_bg_color || "#f8fafc",
          text: newTp.text_color || "#0f172a",
          hint: newTp.hint_color || "#475569",
          link: newTp.link_color || "#0284c7",
          button: newTp.button_color || "#0284c7",
          buttonText: newTp.button_text_color || "#ffffff",
          isDark: isColorDark(newBg),
        });
      }
    };
    (tg as { onEvent?: (event: string, cb: () => void) => void }).onEvent?.("themeChanged", onThemeChange);
  }, []);

  const getTg = useCallback(() => {
    return (window as unknown as { Telegram?: { WebApp?: Record<string, unknown> } }).Telegram?.WebApp;
  }, []);

  const haptic = {
    light: () => { (getTg()?.HapticFeedback as { impactOccurred?: (s: string) => void })?.impactOccurred?.("light"); },
    medium: () => { (getTg()?.HapticFeedback as { impactOccurred?: (s: string) => void })?.impactOccurred?.("medium"); },
    success: () => { (getTg()?.HapticFeedback as { notificationOccurred?: (s: string) => void })?.notificationOccurred?.("success"); },
    error: () => { (getTg()?.HapticFeedback as { notificationOccurred?: (s: string) => void })?.notificationOccurred?.("error"); },
    select: () => { (getTg()?.HapticFeedback as { selectionChanged?: () => void })?.selectionChanged?.(); },
  };

  const showBackButton = useCallback((onClick: () => void) => {
    const bb = getTg()?.BackButton as { show?: () => void; onClick?: (cb: () => void) => void } | undefined;
    bb?.show?.();
    bb?.onClick?.(onClick);
  }, [getTg]);

  const hideBackButton = useCallback(() => {
    (getTg()?.BackButton as { hide?: () => void })?.hide?.();
  }, [getTg]);

  const setMainButton = useCallback((text: string, onClick: () => void) => {
    const mb = getTg()?.MainButton as { setText?: (t: string) => void; show?: () => void; onClick?: (cb: () => void) => void } | undefined;
    mb?.setText?.(text);
    mb?.show?.();
    mb?.onClick?.(onClick);
  }, [getTg]);

  const hideMainButton = useCallback(() => {
    (getTg()?.MainButton as { hide?: () => void })?.hide?.();
  }, [getTg]);

  const close = useCallback(() => {
    (getTg() as { close?: () => void })?.close?.();
  }, [getTg]);

  return { ready, user, theme, initData, haptic, showBackButton, hideBackButton, setMainButton, hideMainButton, close };
}
