"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Inbox, Package, Users, MessageCircle, Loader2,
} from "lucide-react";
import { useTelegram } from "../../telegram-miniapp/hooks/useTelegram";
import { setToken, tgFetch } from "../../telegram-miniapp/lib/api";

/* ─── Context ─── */
interface MiniAppCtx {
  user: { id: number; firstName: string; lastName?: string } | null;
  fetch: typeof tgFetch;
}

const MiniAppContext = createContext<MiniAppCtx | null>(null);
export function useMiniApp() {
  const ctx = useContext(MiniAppContext);
  if (!ctx) throw new Error("useMiniApp outside provider");
  return ctx;
}

/* ─── Nav ─── */
const NAV = [
  { href: "/tg", icon: LayoutDashboard, label: "Главная" },
  { href: "/tg/leads", icon: Inbox, label: "Заявки" },
  { href: "/tg/products", icon: Package, label: "Товары" },
  { href: "/tg/clients", icon: Users, label: "Клиенты" },
  { href: "/tg/chats", icon: MessageCircle, label: "Чаты" },
];

/* ─── Layout ─── */
export default function TgShell({ children }: { children: React.ReactNode }) {
  const tg = useTelegram();
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Auth on mount
  useEffect(() => {
    if (!tg.ready) return;

    async function auth() {
      try {
        const res = await fetch("/api/tg/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Ошибка авторизации");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setToken(data.token);
        setAuthed(true);
      } catch {
        setError("Ошибка соединения");
      }
      setLoading(false);
    }

    auth();
  }, [tg.ready, tg.initData]);

  // Back button
  useEffect(() => {
    if (pathname !== "/tg") {
      tg.showBackButton(() => router.back());
    } else {
      tg.hideBackButton();
    }
  }, [pathname, tg, router]);

  // Apply theme CSS vars
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--tg-bg", tg.theme.bg);
    root.style.setProperty("--tg-bg2", tg.theme.bgSecondary);
    root.style.setProperty("--tg-text", tg.theme.text);
    root.style.setProperty("--tg-hint", tg.theme.hint);
    root.style.setProperty("--tg-link", tg.theme.link);
    root.style.setProperty("--tg-btn", tg.theme.button);
    root.style.setProperty("--tg-btn-text", tg.theme.buttonText);
    root.setAttribute("data-tg-theme", tg.theme.isDark ? "dark" : "light");
  }, [tg.theme]);

  // Loading
  if (loading) {
    return (
      <div style={{ background: tg.theme.bg, color: tg.theme.text }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: tg.theme.link }} />
          <p className="text-sm" style={{ color: tg.theme.hint }}>Загрузка...</p>
        </div>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={{ background: tg.theme.bg, color: tg.theme.text }} className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-base font-semibold mb-2">⛔ {error}</p>
          <p className="text-sm" style={{ color: tg.theme.hint }}>Этот Mini App доступен только для команды</p>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  const ctx: MiniAppCtx = { user: tg.user, fetch: tgFetch };

  return (
    <MiniAppContext.Provider value={ctx}>
      <div className="min-h-screen flex flex-col" style={{ background: tg.theme.bgSecondary, color: tg.theme.text, fontFamily: "'Inter', -apple-system, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif" }}>
        {/* Content */}
        <main className="flex-1 pb-16 overflow-y-auto">
          {children}
        </main>

        {/* Bottom nav — compact, closer together */}
        <nav className="fixed bottom-0 left-0 right-0 flex" style={{ background: tg.theme.bg, boxShadow: "0 -1px 0 " + (tg.theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"), paddingBottom: "env(safe-area-inset-bottom)" }}>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/tg" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-1.5"
                onClick={() => tg.haptic.select()}
              >
                <Icon className="w-[22px] h-[22px]" style={{ color: active ? tg.theme.link : tg.theme.hint }} />
                <span className="text-[10px] leading-tight mt-0.5" style={{ color: active ? tg.theme.link : tg.theme.hint, fontWeight: active ? 700 : 500 }}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </MiniAppContext.Provider>
  );
}
