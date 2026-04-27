"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
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
} from "lucide-react";

/* ─── Auth Context ─── */
interface AdminCtx {
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
  { href: "/admin/ai", label: "ИИ", icon: Bot },
  { href: "/admin/settings", label: "Настройки", icon: Settings },
];

/* ─── Login Screen ─── */
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/dashboard?pw=${encodeURIComponent(pw)}`);
      if (res.ok) {
        onLogin(pw);
      } else {
        setError(res.status === 429 ? "Слишком много попыток" : "Неверный пароль");
      }
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
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
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-pw" className="block text-sm font-medium text-[var(--foreground)] mb-2">
            Пароль
          </label>
          <input
            id="admin-pw"
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            placeholder="Введите пароль"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-[var(--danger)]">{error}</p>}
          <button
            type="submit"
            disabled={loading || !pw}
            className="mt-4 w-full py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-colors"
          >
            {loading ? "Проверка..." : "Войти"}
          </button>
        </form>
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
  const [password, setPassword] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) setPassword(saved);
    setHydrated(true);
  }, []);

  const handleLogin = useCallback((pw: string) => {
    setPassword(pw);
    sessionStorage.setItem("admin_pw", pw);
  }, []);

  const handleLogout = useCallback(() => {
    setPassword(null);
    sessionStorage.removeItem("admin_pw");
  }, []);

  const fetchApi = useCallback(
    async (path: string, opts?: RequestInit) => {
      const sep = path.includes("?") ? "&" : "?";
      return fetch(`${path}${sep}pw=${encodeURIComponent(password || "")}`, opts);
    },
    [password]
  );

  // Show splash while checking sessionStorage
  if (!hydrated) {
    return <SplashScreen />;
  }

  if (!password) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const ctx: AdminCtx = { password, fetchApi };

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
