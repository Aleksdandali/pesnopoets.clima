"use client";

import { useState, useEffect, useCallback } from "react";
import { useMiniApp } from "../layout";
import { useTelegram } from "../../../telegram-miniapp/hooks/useTelegram";
import { Loader2, Phone } from "lucide-react";

interface Lead { id: number; name: string; phone: string; email: string | null; message: string | null; source: string; status: string; admin_notes: string | null; created_at: string }

const STATUSES = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "contacted", label: "Связались" },
  { value: "completed", label: "Выполнено" },
];

const STATUS_COLOR: Record<string, string> = { new: "#0284c7", contacted: "#b45309", completed: "#15803d", cancelled: "#b91c1c" };
const STATUS_LABEL: Record<string, string> = { new: "Новая", contacted: "Связались", completed: "Выполнено", cancelled: "Отменено" };
const SOURCE_LABEL: Record<string, string> = { "one-click": "Быстрый", checkout: "Корзина", "consultant-chat": "AI чат", "inquiry-page": "Форма", "product-page": "Товар" };

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "сейчас"; if (mins < 60) return `${mins}м`;
  const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}ч`;
  return `${Math.floor(hrs / 24)}д`;
}

export default function TgLeadsPage() {
  const { fetch } = useMiniApp();
  const tg = useTelegram();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const data = await fetch(`/api/tg/admin/inquiries?status=${status}&page=1`) as { inquiries: Lead[] };
      setLeads(data.inquiries);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetch]);

  useEffect(() => { load(filter); }, [filter, load]);

  async function changeStatus(id: number, status: string) {
    tg.haptic.medium();
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    await fetch("/api/tg/admin/inquiries", {
      method: "PATCH",
      body: JSON.stringify({ id, status }),
    }).catch(() => {});
  }

  return (
    <div>
      <div className="px-4 pt-5 pb-3" style={{ background: tg.theme.bg }}>
        <h1 className="text-[20px] font-bold" style={{ color: tg.theme.text }}>Заявки</h1>
      </div>

      {/* Filters */}
      <div className="px-4 pb-3 flex gap-2 overflow-x-auto" style={{ background: tg.theme.bg }}>
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setFilter(s.value); tg.haptic.select(); }}
            className="shrink-0 px-3.5 py-2 rounded-full text-[13px] font-medium transition-colors"
            style={{
              background: filter === s.value ? tg.theme.link : tg.theme.bgSecondary,
              color: filter === s.value ? "#fff" : tg.theme.text,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} />
        </div>
      ) : leads.length === 0 ? (
        <p className="text-center py-16 text-[14px]" style={{ color: tg.theme.hint }}>Заявок не найдено</p>
      ) : (
        <div className="px-4 mt-2 space-y-2.5">
          {leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl p-4" style={{ background: tg.theme.bg }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold" style={{ color: tg.theme.text }}>{lead.name}</p>
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1 mt-0.5" style={{ color: tg.theme.link }} onClick={() => tg.haptic.light()}>
                    <Phone className="w-3 h-3" />
                    <span className="text-[13px]">{lead.phone}</span>
                  </a>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[lead.status] || tg.theme.hint }} />
                  <span className="text-[11px] font-medium" style={{ color: STATUS_COLOR[lead.status] || tg.theme.hint }}>{STATUS_LABEL[lead.status] || lead.status}</span>
                </div>
              </div>

              {lead.message && (
                <p className="text-[13px] mt-2 line-clamp-2" style={{ color: tg.theme.hint }}>{lead.message}</p>
              )}

              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: `1px solid ${tg.theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}` }}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: tg.theme.bgSecondary, color: tg.theme.hint }}>
                    {SOURCE_LABEL[lead.source] || lead.source}
                  </span>
                  <span className="text-[11px]" style={{ color: tg.theme.hint }}>{timeAgo(lead.created_at)}</span>
                </div>
                <div className="flex gap-1.5">
                  {lead.status === "new" && (
                    <button
                      onClick={() => changeStatus(lead.id, "contacted")}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                      style={{ background: `${tg.theme.link}15`, color: tg.theme.link }}
                    >
                      Взял
                    </button>
                  )}
                  {(lead.status === "new" || lead.status === "contacted") && (
                    <button
                      onClick={() => changeStatus(lead.id, "completed")}
                      className="px-3 py-1.5 rounded-lg text-[12px] font-semibold"
                      style={{ background: "#dcfce715", color: "#15803d" }}
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
