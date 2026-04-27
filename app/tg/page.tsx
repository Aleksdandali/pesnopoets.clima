"use client";

import { useState, useEffect, useCallback } from "react";
import { useMiniApp } from "./layout";
import { useTelegram } from "../../telegram-miniapp/hooks/useTelegram";
import Link from "next/link";
import {
  Inbox, Package, Users, MessageCircle, ChevronRight,
  TrendingUp, AlertTriangle, Bot, Phone, Loader2,
} from "lucide-react";

interface KPI {
  leadsToday: number; leadsWeek: number; leadsNew: number;
  leadsOverdue: number; productsActive: number; chatWeek: number;
}

interface RecentLead { id: number; name: string; phone: string; source: string; status: string; created_at: string }

const STATUS_COLOR: Record<string, string> = {
  new: "#0284c7", contacted: "#b45309", completed: "#15803d", cancelled: "#b91c1c",
};

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "сейчас";
  if (mins < 60) return `${mins}м`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}ч`;
  return `${Math.floor(hrs / 24)}д`;
}

export default function TgHomePage() {
  const { user, fetch } = useMiniApp();
  const tg = useTelegram();
  const [kpi, setKpi] = useState<KPI | null>(null);
  const [recent, setRecent] = useState<RecentLead[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await fetch("/api/tg/admin/dashboard");
      const d = data as { kpi: KPI; recentLeads: RecentLead[] };
      setKpi(d.kpi);
      setRecent(d.recentLeads);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetch]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh 60s
  useEffect(() => {
    const i = setInterval(load, 60000);
    return () => clearInterval(i);
  }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} />
      </div>
    );
  }

  return (
    <div>
      {/* Greeting */}
      <div className="px-4 pt-5 pb-4" style={{ background: tg.theme.bg }}>
        <h1 className="text-[22px] font-bold" style={{ color: tg.theme.text, letterSpacing: "-0.02em" }}>
          Привет, {user?.firstName}!
        </h1>
        <p className="text-[13px] mt-0.5" style={{ color: tg.theme.hint }}>
          Панель управления
        </p>
      </div>

      {/* KPI cards row */}
      {kpi && (
        <div className="px-4 pb-4 flex gap-2.5" style={{ background: tg.theme.bg }}>
          <div className="flex-1 rounded-2xl p-3.5" style={{ background: kpi.leadsNew > 0 ? "#dcfce7" : tg.theme.bgSecondary }}>
            <p className="text-[22px] font-bold" style={{ color: kpi.leadsNew > 0 ? "#15803d" : tg.theme.text }}>{kpi.leadsNew}</p>
            <p className="text-[11px] mt-0.5" style={{ color: kpi.leadsNew > 0 ? "#15803d" : tg.theme.hint }}>новых</p>
          </div>
          <div className="flex-1 rounded-2xl p-3.5" style={{ background: tg.theme.bgSecondary }}>
            <p className="text-[22px] font-bold" style={{ color: tg.theme.text }}>{kpi.leadsToday}</p>
            <p className="text-[11px] mt-0.5" style={{ color: tg.theme.hint }}>сегодня</p>
          </div>
          {kpi.leadsOverdue > 0 && (
            <div className="flex-1 rounded-2xl p-3.5" style={{ background: "#fee2e2" }}>
              <p className="text-[22px] font-bold" style={{ color: "#b91c1c" }}>{kpi.leadsOverdue}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#b91c1c" }}>ждут &gt;1ч</p>
            </div>
          )}
        </div>
      )}

      {/* Main sections */}
      <div className="px-4 mt-2 space-y-2.5">
        <SectionCard href="/tg/leads" icon={Inbox} color="#0284c7" title="Заявки" subtitle={`${kpi?.leadsNew || 0} новых`} badge={kpi?.leadsNew} tg={tg} />
        <SectionCard href="/tg/chats" icon={MessageCircle} color="#0d9488" title="Чаты AI" subtitle="Диалоги с клиентами" tg={tg} />
        <SectionCard href="/tg/products" icon={Package} color="#7c3aed" title="Каталог" subtitle={`${kpi?.productsActive || 0} товаров`} tg={tg} />
        <SectionCard href="/tg/clients" icon={Users} color="#ea580c" title="Клиенты" subtitle="База клиентов" tg={tg} />
      </div>

      {/* Quick stats row */}
      {kpi && (
        <div className="px-4 mt-4 flex gap-2.5">
          <QuickCard icon={TrendingUp} label="За неделю" value={String(kpi.leadsWeek)} tg={tg} />
          <QuickCard icon={Bot} label="AI сессии" value={String(kpi.chatWeek)} tg={tg} />
          <QuickCard icon={Package} label="Товаров" value={String(kpi.productsActive)} tg={tg} />
        </div>
      )}

      {/* Recent leads */}
      {recent.length > 0 && (
        <div className="px-4 mt-5 mb-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider mb-2.5" style={{ color: tg.theme.hint }}>
            Последние заявки
          </p>
          <div className="rounded-2xl overflow-hidden" style={{ background: tg.theme.bg }}>
            {recent.map((lead, i) => (
              <Link
                key={lead.id}
                href="/tg/leads"
                className="flex items-center gap-3 px-4 py-3 active:opacity-70 transition-opacity"
                style={{ borderBottom: i < recent.length - 1 ? `1px solid ${tg.theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}` : "none" }}
                onClick={() => tg.haptic.light()}
              >
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: STATUS_COLOR[lead.status] || tg.theme.hint }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-medium truncate" style={{ color: tg.theme.text }}>{lead.name}</p>
                  <p className="text-[12px] truncate" style={{ color: tg.theme.hint }}>{lead.phone}</p>
                </div>
                <span className="text-[11px] shrink-0" style={{ color: tg.theme.hint }}>{timeAgo(lead.created_at)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 pt-4 pb-6 text-center">
        <p className="text-[11px]" style={{ color: tg.theme.hint }}>
          powered by <span className="font-bold">DAN<span style={{ color: "#CCFF00" }}>GROW</span></span>
        </p>
      </div>
    </div>
  );
}

/* ─── Section Card (like screenshot) ─── */
function SectionCard({ href, icon: Icon, color, title, subtitle, badge, tg }: {
  href: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string; title: string; subtitle: string; badge?: number;
  tg: ReturnType<typeof useTelegram>;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3.5 p-4 rounded-2xl active:scale-[0.98] transition-transform"
      style={{ background: tg.theme.bg }}
      onClick={() => tg.haptic.light()}
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
        {badge && badge > 0 ? (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[13px] font-bold" style={{ background: color }}>
            {badge}
          </div>
        ) : (
          <Icon className="w-5 h-5" style={{ color }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-semibold" style={{ color: tg.theme.text }}>{title}</p>
        <p className="text-[13px]" style={{ color: tg.theme.hint }}>{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: `${tg.theme.hint}60` }} />
    </Link>
  );
}

/* ─── Quick stat card ─── */
function QuickCard({ icon: Icon, label, value, tg }: {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  label: string; value: string;
  tg: ReturnType<typeof useTelegram>;
}) {
  return (
    <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: tg.theme.bg }}>
      <Icon className="w-5 h-5 mx-auto mb-1" style={{ color: tg.theme.hint }} />
      <p className="text-[17px] font-bold" style={{ color: tg.theme.text }}>{value}</p>
      <p className="text-[10px]" style={{ color: tg.theme.hint }}>{label}</p>
    </div>
  );
}
