"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAdmin } from "../layout";
import { Users, Search, Loader2, Phone, Mail, Tag, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface Client {
  id: number;
  phone: string;
  name: string;
  email: string | null;
  locale: string;
  telegram_id: string | null;
  notes: string | null;
  tags: string[];
  total_inquiries: number;
  last_inquiry_at: string | null;
  created_at: string;
}

function timeAgo(d: string | null) {
  if (!d) return "—";
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "сегодня";
  if (days === 1) return "вчера";
  if (days < 30) return `${days} дн назад`;
  return new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

const TAG_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-orange-100 text-orange-700",
  "bg-pink-100 text-pink-700",
];

export default function ClientsPage() {
  const { fetchApi, password } = useAdmin();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Editing
  const [editId, setEditId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editTags, setEditTags] = useState("");

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetchApi(`/api/admin/clients?search=${encodeURIComponent(q)}&page=${p}`);
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients);
        setTotal(data.total);
        setPages(data.pages);
        setPage(data.page);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetchApi]);

  useEffect(() => { load("", 1); }, [load]);

  function handleSearch(v: string) {
    setSearch(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(v, 1), 400);
  }

  async function saveClient(id: number) {
    await fetch("/api/admin/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        password,
        notes: editNotes,
        tags: editTags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    });
    setEditId(null);
    load(search, page);
  }

  function startEdit(c: Client) {
    setEditId(c.id);
    setEditNotes(c.notes || "");
    setEditTags(c.tags.join(", "));
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
          <Users className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Клиенты</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{total} клиентов в базе</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Поиск по имени, телефону или email..."
          className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-20">
          <Users className="w-12 h-12 text-[var(--border)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)] text-sm">Клиентов пока нет</p>
          <p className="text-[var(--muted-foreground)] text-xs mt-1">Они появятся автоматически после первой заявки</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {clients.map((c) => (
              <div key={c.id} className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{c.name || "Без имени"}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1">
                      <a href={`tel:${c.phone}`} className="text-sm text-[var(--primary)] hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" />{c.phone}
                      </a>
                      {c.email && (
                        <a href={`mailto:${c.email}`} className="text-xs text-[var(--muted-foreground)] hover:underline flex items-center gap-1">
                          <Mail className="w-3 h-3" />{c.email}
                        </a>
                      )}
                      {c.telegram_id && (
                        <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />TG: {c.telegram_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold text-[var(--foreground)]">{c.total_inquiries}</p>
                    <p className="text-[10px] text-[var(--muted-foreground)] uppercase">заявок</p>
                  </div>
                </div>

                {/* Tags */}
                {c.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {c.tags.map((tag, i) => (
                      <span key={tag} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                        <Tag className="w-2.5 h-2.5" />{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Notes + meta */}
                <div className="flex items-end justify-between mt-2 gap-2">
                  <div className="min-w-0">
                    {c.notes && editId !== c.id && (
                      <p className="text-xs text-[var(--muted-foreground)] italic truncate">📝 {c.notes}</p>
                    )}
                    <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                      Последняя заявка: {timeAgo(c.last_inquiry_at)} · {c.locale.toUpperCase()} · #{c.id}
                    </p>
                  </div>
                  {editId !== c.id && (
                    <button
                      onClick={() => startEdit(c)}
                      className="shrink-0 text-xs text-[var(--primary)] hover:underline"
                    >
                      Редактировать
                    </button>
                  )}
                </div>

                {/* Edit form */}
                {editId === c.id && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)] space-y-2">
                    <div>
                      <label className="text-xs font-medium text-[var(--muted-foreground)]">Заметки</label>
                      <input
                        type="text"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Заметка о клиенте..."
                        className="w-full mt-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[var(--muted-foreground)]">Теги (через запятую)</label>
                      <input
                        type="text"
                        value={editTags}
                        onChange={(e) => setEditTags(e.target.value)}
                        placeholder="VIP, монтаж, профилактика..."
                        className="w-full mt-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveClient(c.id)}
                        className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
                      >
                        Сохранить
                      </button>
                      <button onClick={() => setEditId(null)} className="px-4 py-2 text-sm text-[var(--muted-foreground)]">
                        Отмена
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => load(search, page - 1)} disabled={page <= 1}
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[var(--muted-foreground)]">{page} / {pages}</span>
              <button onClick={() => load(search, page + 1)} disabled={page >= pages}
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
