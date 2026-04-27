"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "./layout";
import Link from "next/link";
import {
  Inbox, TrendingUp, TrendingDown, AlertTriangle, Bot, Users, Package,
  Phone, Loader2, ArrowRight, Minus,
} from "lucide-react";

/* ─── Types ─── */
interface KPI {
  leadsToday: number; leadsWeek: number; leadsPrevWeek: number;
  leadsMonth: number; leadsPrevMonth: number; leadsNew: number; leadsOverdue: number;
  conversionRate: number; clientsWeek: number; clientsPrevWeek: number;
  productsActive: number; chatWeek: number; chatPrevWeek: number;
}
interface ChartPoint { day: string; total: number; completed: number }
interface SourceItem { source: string; count: number }
interface StatusItem { status: string; count: number }
interface LocaleItem { locale: string; count: number }
interface TopProduct { product_id: number; title: string; manufacturer: string; availability: string; inquiry_count: number }
interface RecentLead { id: number; name: string; phone: string; source: string; status: string; locale: string; created_at: string }

/* ─── Helpers ─── */
function delta(cur: number, prev: number) {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return Math.round((cur - prev) / prev * 100);
}

function DeltaBadge({ cur, prev }: { cur: number; prev: number }) {
  const d = delta(cur, prev);
  if (d === 0) return <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-0.5"><Minus className="w-3 h-3" />0%</span>;
  if (d > 0) return <span className="text-xs text-[var(--success)] flex items-center gap-0.5"><TrendingUp className="w-3 h-3" />+{d}%</span>;
  return <span className="text-xs text-[var(--danger)] flex items-center gap-0.5"><TrendingDown className="w-3 h-3" />{d}%</span>;
}

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "сейчас";
  if (mins < 60) return `${mins}м`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}ч`;
  return `${Math.floor(hrs / 24)}д`;
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-[var(--primary-light)] text-[var(--primary)]",
  contacted: "bg-[var(--warning-light)] text-[var(--warning)]",
  completed: "bg-[var(--success-light)] text-[var(--success)]",
  cancelled: "bg-[var(--danger-light)] text-[var(--danger)]",
};
const STATUS_LABEL: Record<string, string> = { new: "Новая", contacted: "Связались", completed: "Выполнено", cancelled: "Отменено" };
const SOURCE_LABEL: Record<string, string> = { "one-click": "Быстрый заказ", checkout: "Корзина", "consultant-chat": "AI чат", "inquiry-page": "Форма", "product-page": "Товар", unknown: "Другое" };

/* ─── Mini Bar Chart (pure SVG) ─── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BarChart({ data, labelKey, valueKey, maxBars = 5 }: { data: any[]; labelKey: string; valueKey: string; maxBars?: number }) {
  const items = data.slice(0, maxBars);
  const max = Math.max(...items.map((d: Record<string, unknown>) => Number(d[valueKey]) || 0), 1);
  return (
    <div className="space-y-2">
      {items.map((d, i) => {
        const val = Number(d[valueKey]) || 0;
        const pct = Math.round(val / max * 100);
        const label = SOURCE_LABEL[String(d[labelKey])] || String(d[labelKey]);
        return (
          <div key={i}>
            <div className="flex justify-between text-xs mb-0.5">
              <span className="text-[var(--foreground)] truncate">{label}</span>
              <span className="text-[var(--muted-foreground)] font-mono ml-2">{val}</span>
            </div>
            <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Mini Line Chart (pure SVG) ─── */
function LineChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) return <p className="text-xs text-[var(--muted-foreground)] text-center py-8">Нет данных</p>;
  const h = 120, w = 100; // viewBox percentages
  const maxVal = Math.max(...data.map((d) => d.total), 1);
  const points = data.map((d, i) => ({
    x: data.length === 1 ? 50 : (i / (data.length - 1)) * w,
    y: h - (d.total / maxVal) * (h - 10) - 5,
    yC: h - (d.completed / maxVal) * (h - 10) - 5,
  }));
  const line = points.map((p) => `${p.x},${p.y}`).join(" ");
  const lineC = points.map((p) => `${p.x},${p.yC}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
      <polyline fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinejoin="round" points={line} />
      <polyline fill="none" stroke="var(--success)" strokeWidth="1" strokeDasharray="3,2" strokeLinejoin="round" points={lineC} />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.5" fill="var(--primary)" />
      ))}
    </svg>
  );
}

/* ─── Status Donut (pure SVG) ─── */
function StatusDonut({ data }: { data: StatusItem[] }) {
  const total = data.reduce((s, d) => s + Number(d.count), 0) || 1;
  const colors: Record<string, string> = { new: "var(--primary)", contacted: "var(--warning)", completed: "var(--success)", cancelled: "var(--danger)" };
  let offset = 0;
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 36 36" className="w-20 h-20 shrink-0">
        {data.map((d) => {
          const pct = Number(d.count) / total * 100;
          const dash = `${pct} ${100 - pct}`;
          const el = (
            <circle key={d.status} cx="18" cy="18" r="14" fill="none"
              stroke={colors[d.status] || "var(--border)"} strokeWidth="4"
              strokeDasharray={dash} strokeDashoffset={-offset}
              className="transition-all"
            />
          );
          offset += pct;
          return el;
        })}
        <text x="18" y="18" textAnchor="middle" dy="0.35em" className="text-[6px] font-bold" fill="var(--foreground)">{total}</text>
      </svg>
      <div className="space-y-1">
        {data.map((d) => (
          <div key={d.status} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: colors[d.status] || "var(--border)" }} />
            <span className="text-[var(--muted-foreground)]">{STATUS_LABEL[d.status] || d.status}</span>
            <span className="font-semibold text-[var(--foreground)]">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function DashboardPage() {
  const { fetchApi } = useAdmin();
  const [data, setData] = useState<{ kpi: KPI; charts: { leadsByDay: ChartPoint[]; leadsBySource: SourceItem[]; leadsByStatus: StatusItem[]; leadsByLocale: LocaleItem[]; topProducts: TopProduct[]; chatStats: unknown[] }; recentLeads: RecentLead[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetchApi("/api/admin/dashboard");
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetchApi]);

  useEffect(() => { load(); }, [load]);

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, [load]);

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" /></div>;
  if (!data) return <p className="text-[var(--danger)] text-sm">Ошибка загрузки</p>;

  const { kpi, charts, recentLeads } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--foreground)]">Главная</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Leads this week */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Inbox className="w-5 h-5 text-[var(--primary)]" />
            <DeltaBadge cur={kpi.leadsWeek} prev={kpi.leadsPrevWeek} />
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{kpi.leadsWeek}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Заявок за неделю</p>
          <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Сегодня: <span className="font-semibold text-[var(--foreground)]">{kpi.leadsToday}</span></p>
        </div>

        {/* Conversion rate */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-[var(--success)]" />
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{kpi.conversionRate}%</p>
          <p className="text-xs text-[var(--muted-foreground)]">Конверсия</p>
        </div>

        {/* Overdue */}
        <Link href="/admin/leads?status=new" className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm hover:border-[var(--primary)]/30 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className={`w-5 h-5 ${kpi.leadsOverdue > 0 ? "text-[var(--danger)]" : "text-[var(--muted-foreground)]"}`} />
            {kpi.leadsOverdue > 0 && <span className="w-2 h-2 rounded-full bg-[var(--danger)] animate-pulse" />}
          </div>
          <p className={`text-2xl font-bold ${kpi.leadsOverdue > 0 ? "text-[var(--danger)]" : "text-[var(--foreground)]"}`}>{kpi.leadsOverdue}</p>
          <p className="text-xs text-[var(--muted-foreground)]">Ждут &gt;1ч</p>
        </Link>

        {/* AI consultant */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Bot className="w-5 h-5 text-[var(--primary)]" />
            <DeltaBadge cur={kpi.chatWeek} prev={kpi.chatPrevWeek} />
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">{kpi.chatWeek}</p>
          <p className="text-xs text-[var(--muted-foreground)]">AI сессий за неделю</p>
        </div>
      </div>

      {/* Second row: clients + products */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[var(--foreground)]">{kpi.clientsWeek}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Новых клиентов</p>
          </div>
          <Users className="w-5 h-5 text-[var(--muted-foreground)]" />
        </div>
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-[var(--foreground)]">{kpi.productsActive}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Товаров</p>
          </div>
          <Package className="w-5 h-5 text-[var(--muted-foreground)]" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Leads by day */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">Заявки по дням</h2>
            <div className="flex gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[var(--primary)] rounded" />все</span>
              <span className="flex items-center gap-1"><span className="w-2 h-0.5 bg-[var(--success)] rounded" />завершены</span>
            </div>
          </div>
          <LineChart data={charts.leadsByDay} />
        </div>

        {/* Status donut */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">По статусу</h2>
          <StatusDonut data={charts.leadsByStatus} />
        </div>

        {/* Sources */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Источники заявок</h2>
          <BarChart data={charts.leadsBySource} labelKey="source" valueKey="count" />
        </div>

        {/* Top products */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">Топ товаров</h2>
          <BarChart data={charts.topProducts} labelKey="title" valueKey="inquiry_count" />
        </div>

        {/* Locale distribution */}
        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-3">По языку</h2>
          <BarChart data={charts.leadsByLocale} labelKey="locale" valueKey="count" maxBars={4} />
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-sm">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">Последние заявки</h2>
          <Link href="/admin/leads" className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1">
            Все <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {recentLeads.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]">Заявок пока нет</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {recentLeads.map((lead) => (
              <li key={lead.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{lead.name}</p>
                  <a href={`tel:${lead.phone}`} className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />{lead.phone}
                  </a>
                </div>
                <span className="bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded text-[10px] hidden sm:inline">
                  {SOURCE_LABEL[lead.source] || lead.source}
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_STYLE[lead.status] || ""}`}>
                  {STATUS_LABEL[lead.status] || lead.status}
                </span>
                <span className="text-[10px] text-[var(--muted-foreground)] whitespace-nowrap">{timeAgo(lead.created_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
