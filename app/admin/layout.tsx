"use client";

import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Package,
  Settings,
  ExternalLink,
  LogOut,
  Bot,
  Users,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

/* ─── Auth Context ─── */
interface AdminCtx {
  /** Legacy field — empty under cookie auth. Kept so old components still compile. */
  password: string;
  fetchApi: (path: string, opts?: RequestInit) => Promise<Response>;
}

const AdminContext = createContext<AdminCtx | null>(null);

export function useAdmin(): AdminCtx {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin outside AdminProvider");
  return ctx;
}

/* ─── Nav items ─── */
interface NavItem { href: string; label: string; icon: React.ComponentType<{ className?: string }> }

const NAV: NavItem[] = [
  { href: "/admin", label: "Главная", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Заявки", icon: Inbox },
  { href: "/admin/products", label: "Товары", icon: Package },
  { href: "/admin/clients", label: "Клиенты", icon: Users },
  { href: "/admin/banners", label: "Баннеры", icon: ImageIcon },
  { href: "/admin/insights", label: "Аналитика", icon: Sparkles },
  { href: "/admin/ai", label: "ИИ", icon: Bot },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

/* ─── Login Screen — passwordless via Telegram bot approval ─── */
function LoginScreen({ onAuthed }: { onAuthed: () => void }) {
  // states: idle | requesting | waiting | approved | denied | expired | error
  type State = "idle" | "requesting" | "waiting" | "approved" | "denied" | "expired" | "error";
  const [state, setState] = useState<State>("idle");
  const [errMsg, setErrMsg] = useState<string>("");
  const [code, setCode] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
    };
  }, []);

  function stopPoll() {
    if (pollTimer.current) {
      clearInterval(pollTimer.current);
      pollTimer.current = null;
    }
  }

  async function startLogin() {
    setState("requesting");
    setErrMsg("");
    try {
      const res = await fetch("/api/admin/login/start", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrMsg(
          res.status === 429
            ? "Слишком часто. Подождите минуту."
            : data?.error || "Не удалось отправить запрос",
        );
        setState("error");
        return;
      }
      setCode(data.code);
      setState("waiting");
      // start polling
      pollTimer.current = setInterval(() => pollOnce(data.code), 2000);
      // safety: stop polling after 5.5 min
      setTimeout(() => {
        stopPoll();
        setState((s) => (s === "waiting" ? "expired" : s));
      }, 5.5 * 60_000);
    } catch {
      setErrMsg("Ошибка соединения");
      setState("error");
    }
  }

  async function pollOnce(c: string) {
    try {
      const res = await fetch(`/api/admin/login/poll?code=${encodeURIComponent(c)}`);
      if (!res.ok) return; // keep polling
      const data = await res.json().catch(() => ({}));
      if (data.status === "approved") {
        stopPoll();
        setState("approved");
        // small delay so user sees the green state, then trigger re-check upstream
        setTimeout(onAuthed, 600);
      } else if (data.status === "denied") {
        stopPoll();
        setState("denied");
      } else if (data.status === "expired") {
        stopPoll();
        setState("expired");
      }
    } catch {
      // ignore one-off network blips
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[var(--background)] rounded-2xl border border-[var(--border)] shadow-[var(--shadow)] p-8">
        <div className="flex items-center gap-3 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Pesnopoets Clima" className="w-10 h-10 rounded-xl" />
          <div>
            <h1 className="text-lg font-bold text-[var(--foreground)]">Админ-панель</h1>
            <p className="text-xs text-[var(--muted-foreground)]">Pesnopoets Clima</p>
          </div>
        </div>

        {state === "idle" || state === "error" ? (
          <>
            <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
              Для входа подтвердите запрос в Telegram-боте владельца.
            </p>
            <button
              type="button"
              onClick={startLogin}
              className="w-full py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Войти через Telegram
            </button>
            {errMsg && <p className="mt-3 text-sm text-[var(--danger)]">{errMsg}</p>}
          </>
        ) : null}

        {state === "requesting" && (
          <p className="text-sm text-[var(--muted-foreground)] text-center py-4">Отправка запроса…</p>
        )}

        {state === "waiting" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)]">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/15 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div className="text-sm">
                <p className="font-medium text-[var(--foreground)]">Подтвердите вход в Telegram</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Откройте бота и нажмите ✅ Разрешить</p>
              </div>
            </div>
            {code && (
              <p className="text-[10px] text-center font-mono text-[var(--muted-foreground)]">
                код {code} · действует 5 мин
              </p>
            )}
            <button
              type="button"
              onClick={() => {
                stopPoll();
                setState("idle");
                setCode(null);
              }}
              className="w-full py-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              Отмена
            </button>
          </div>
        )}

        {state === "approved" && (
          <div className="text-center py-4">
            <p className="text-sm font-medium text-emerald-600">✓ Подтверждено</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Загружаем…</p>
          </div>
        )}

        {state === "denied" && (
          <div className="space-y-3 text-center py-2">
            <p className="text-sm text-[var(--danger)]">Запрос отклонён</p>
            <button
              type="button"
              onClick={() => {
                setState("idle");
                setCode(null);
              }}
              className="text-xs text-[var(--muted-foreground)] underline"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {state === "expired" && (
          <div className="space-y-3 text-center py-2">
            <p className="text-sm text-[var(--muted-foreground)]">Срок запроса истёк (5 минут)</p>
            <button
              type="button"
              onClick={() => {
                setState("idle");
                setCode(null);
              }}
              className="text-xs text-[var(--primary)] underline"
            >
              Отправить новый запрос
            </button>
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <a
            href="https://dangrow.agency"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[var(--muted)] border border-[var(--border)] rounded-full hover:bg-[var(--border)] transition-colors"
          >
            <svg viewBox="0 0 64 64" width="13" height="13" aria-hidden="true">
              <rect width="64" height="64" rx="14" fill="#CCFF00"/>
              <path d="M21 44 L32 20 L43 44" stroke="#06060A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <line x1="32" y1="20" x2="32" y2="14" stroke="#06060A" strokeWidth="5" strokeLinecap="round"/>
              <line x1="27" y1="18" x2="32" y2="14" stroke="#06060A" strokeWidth="4" strokeLinecap="round"/>
              <line x1="37" y1="18" x2="32" y2="14" stroke="#06060A" strokeWidth="4" strokeLinecap="round"/>
            </svg>
            <span className="text-[10px] text-[var(--muted-foreground)]">powered by</span>
            <span className="text-[10px] font-extrabold text-[var(--foreground)] tracking-wide">DAN<span style={{ color: "#CCFF00" }}>GROW</span></span>
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Splash screen ─── */
function SplashScreen() {
  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Bot className="w-6 h-6 text-[var(--primary)]" />
        </div>
        <p className="text-white/40 text-sm">Загрузка...</p>
      </div>
    </div>
  );
}

/* ─── Shell ─── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // null = checking; true = authed; false = needs login
  const [authed, setAuthed] = useState<boolean | null>(null);
  const pathname = usePathname();

  // Verify cookie session by pinging a cheap admin endpoint.
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/dashboard", { credentials: "include" });
      setAuthed(res.ok);
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "include" });
    } catch {
      // best effort — even without a clean POST the cookie was httpOnly so the
      // server is the source of truth; we still flip local state.
    }
    setAuthed(false);
  }, []);

  // Cookies travel automatically same-origin. No more ?pw=.
  const fetchApi = useCallback(
    async (path: string, opts?: RequestInit) =>
      fetch(path, { ...opts, credentials: "include" }),
    [],
  );

  if (authed === null) {
    return <SplashScreen />;
  }

  if (!authed) {
    return <LoginScreen onAuthed={() => void checkAuth()} />;
  }

  const ctx: AdminCtx = { password: "", fetchApi };

  return (
    <AdminContext.Provider value={ctx}>
      <div className="min-h-screen bg-[var(--muted)] flex">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:flex flex-col w-60 bg-[#0a1628] text-white shrink-0 fixed inset-y-0 left-0 z-50">
          <div className="p-4 border-b border-white/10 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="" className="w-9 h-9 rounded-lg" />
            <div>
              <p className="text-sm font-bold text-white">Pesnopoets</p>
              <p className="text-[10px] text-white/40 uppercase tracking-widest">Admin Panel</p>
            </div>
          </div>

          <nav className="flex-1 py-3 px-2 space-y-0.5">
            {NAV.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-[var(--primary)]/15 text-white border-l-2 border-[var(--primary-light)]"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-white/10 space-y-1">
            <a
              href="/bg"
              target="_blank"
              rel="noopener"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              На сайт
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-white/70 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              Выйти
            </button>
            <a
              href="https://dangrow.agency"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 mt-2 bg-white/[0.04] border border-white/[0.08] rounded-full hover:bg-white/[0.07] transition-colors"
            >
              <svg viewBox="0 0 64 64" width="13" height="13" aria-hidden="true">
                <rect width="64" height="64" rx="14" fill="#CCFF00"/>
                <path d="M21 44 L32 20 L43 44" stroke="#06060A" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <line x1="32" y1="20" x2="32" y2="14" stroke="#06060A" strokeWidth="5" strokeLinecap="round"/>
                <line x1="27" y1="18" x2="32" y2="14" stroke="#06060A" strokeWidth="4" strokeLinecap="round"/>
                <line x1="37" y1="18" x2="32" y2="14" stroke="#06060A" strokeWidth="4" strokeLinecap="round"/>
              </svg>
              <span className="text-[10px] text-white/35">powered by</span>
              <span className="text-[10px] font-extrabold text-white tracking-wide">DAN<span style={{ color: "#CCFF00" }}>GROW</span></span>
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 lg:ml-60 min-h-screen pb-20 lg:pb-0">
          {/* Top bar — mobile */}
          <div className="lg:hidden sticky top-0 z-40 bg-[var(--background)] border-b border-[var(--border)] px-4 py-3 flex items-center justify-between">
            <p className="text-sm font-bold text-[var(--foreground)]">Pesnopoets Clima</p>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              aria-label="Выйти"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>

        {/* Bottom tabs — mobile */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)] border-t border-[var(--border)] flex" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-2 ${
                  active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className={`text-[10px] mt-0.5 ${active ? "font-semibold" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </AdminContext.Provider>
  );
}
