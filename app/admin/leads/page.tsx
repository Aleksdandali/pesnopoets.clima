"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../layout";
import { Loader2, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";

interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  status: string;
  admin_notes: string | null;
  locale: string;
  created_at: string;
}

const STATUSES = [
  { value: "all", label: "Все" },
  { value: "new", label: "Новые" },
  { value: "contacted", label: "Связались" },
  { value: "completed", label: "Выполнено" },
  { value: "cancelled", label: "Отменено" },
];

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

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function LeadsPage() {
  const { fetchApi, password } = useAdmin();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (status: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetchApi(`/api/admin/inquiries?status=${status}&page=${p}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries);
        setTotal(data.total);
        setPages(data.pages);
        setPage(data.page);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetchApi]);

  useEffect(() => { load(filter, 1); }, [filter, load]);

  async function updateInquiry(id: number, patch: Record<string, unknown>) {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch, password }),
    });
  }

  function handleStatusChange(id: number, status: string) {
    setInquiries((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    updateInquiry(id, { status });
  }

  function handleNotesBlur(id: number, admin_notes: string) {
    updateInquiry(id, { admin_notes });
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--foreground)]">Заявки</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{total} заявок</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => { setFilter(s.value); setPage(1); }}
            className={`shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === s.value
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
        </div>
      ) : inquiries.length === 0 ? (
        <p className="text-center py-20 text-[var(--muted-foreground)] text-sm">Заявок не найдено</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Имя</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Контакт</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Источник</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Статус</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Дата</th>
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Заметки</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--foreground)]">{inq.name}</p>
                      {inq.message && (
                        <p className="text-xs text-[var(--muted-foreground)] mt-0.5 truncate max-w-[200px]">{inq.message}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`tel:${inq.phone}`} className="text-[var(--primary)] hover:underline flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3" />{inq.phone}
                      </a>
                      {inq.email && (
                        <a href={`mailto:${inq.email}`} className="text-[var(--muted-foreground)] hover:underline flex items-center gap-1 text-xs mt-0.5">
                          <Mail className="w-3 h-3" />{inq.email}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded text-xs">{inq.source}</span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${STATUS_STYLE[inq.status] || STATUS_STYLE.new}`}
                      >
                        {STATUSES.filter((s) => s.value !== "all").map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-[var(--muted-foreground)] whitespace-nowrap">
                      {formatDate(inq.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        defaultValue={inq.admin_notes || ""}
                        onBlur={(e) => handleNotesBlur(inq.id, e.target.value)}
                        placeholder="Заметка..."
                        className="w-full px-2 py-1 border border-[var(--border)] rounded text-xs bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {inquiries.map((inq) => (
              <div key={inq.id} className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--foreground)] text-sm">{inq.name}</p>
                    <a href={`tel:${inq.phone}`} className="text-[var(--primary)] hover:underline flex items-center gap-1 text-sm mt-0.5">
                      <Phone className="w-3 h-3" />{inq.phone}
                    </a>
                  </div>
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 shrink-0 ${STATUS_STYLE[inq.status] || STATUS_STYLE.new}`}
                  >
                    {STATUSES.filter((s) => s.value !== "all").map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                {inq.message && (
                  <p className="text-xs text-[var(--muted-foreground)] mb-2 line-clamp-2">{inq.message}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-0.5 rounded text-xs">{inq.source}</span>
                  <span className="text-xs text-[var(--muted-foreground)]">{formatDate(inq.created_at)}</span>
                </div>
                <input
                  type="text"
                  defaultValue={inq.admin_notes || ""}
                  onBlur={(e) => handleNotesBlur(inq.id, e.target.value)}
                  placeholder="Заметка..."
                  className="mt-2 w-full px-2 py-1.5 border border-[var(--border)] rounded text-xs bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => load(filter, page - 1)} disabled={page <= 1}
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[var(--muted-foreground)]">{page} / {pages}</span>
              <button onClick={() => load(filter, page + 1)} disabled={page >= pages}
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
