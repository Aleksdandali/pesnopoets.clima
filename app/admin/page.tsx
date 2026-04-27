"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "./layout";
import { Inbox, Calendar, AlertCircle, Package, Loader2, Phone } from "lucide-react";

interface DashboardData {
  leadsToday: number;
  leadsWeek: number;
  leadsNew: number;
  productsActive: number;
  recentLeads: Array<{ id: number; name: string; phone: string; source: string; status: string; created_at: string }>;
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-[var(--primary-light)] text-[var(--primary)]",
  contacted: "bg-[var(--warning-light)] text-[var(--warning)]",
  completed: "bg-[var(--success-light)] text-[var(--success)]",
  cancelled: "bg-[var(--danger-light)] text-[var(--danger)]",
};

const STATUS_LABEL: Record<string, string> = {
  new: "Новая",
  contacted: "Связались",
  completed: "Выполнено",
  cancelled: "Отменено",
};

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин назад`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  return `${days} дн назад`;
}

export default function DashboardPage() {
  const { fetchApi } = useAdmin();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await fetchApi("/api/admin/dashboard");
      if (res.ok) setData(await res.json());
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetchApi]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (!data) return <p className="text-[var(--danger)] text-sm">Ошибка загрузки</p>;

  const stats = [
    { label: "Заявки сегодня", value: data.leadsToday, icon: Inbox, color: "var(--primary)" },
    { label: "За неделю", value: data.leadsWeek, icon: Calendar, color: "var(--primary)" },
    { label: "Необработанные", value: data.leadsNew, icon: AlertCircle, color: data.leadsNew > 0 ? "var(--danger)" : "var(--muted-foreground)" },
    { label: "Активных товаров", value: data.productsActive, icon: Package, color: "var(--primary)" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 shadow-sm">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `color-mix(in srgb, ${s.color} 15%, transparent)` }}>
                <Icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">{s.label}</p>
              <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Recent leads */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-sm">
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-base font-semibold text-[var(--foreground)]">Последние заявки</h2>
        </div>
        {data.recentLeads.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[var(--muted-foreground)]">Заявок пока нет</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {data.recentLeads.map((lead) => (
              <li key={lead.id} className="px-5 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--foreground)] truncate">{lead.name}</p>
                  <a href={`tel:${lead.phone}`} className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {lead.phone}
                  </a>
                </div>
                <span className="bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded text-xs hidden sm:inline">
                  {lead.source}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[lead.status] || STATUS_STYLE.new}`}>
                  {STATUS_LABEL[lead.status] || lead.status}
                </span>
                <span className="text-xs text-[var(--muted-foreground)] whitespace-nowrap hidden sm:inline">
                  {timeAgo(lead.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
