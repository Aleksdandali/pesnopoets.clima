"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../../layout";
import { MessageCircle, Loader2, ChevronLeft, ChevronRight, ArrowLeft, User, Bot, Sparkles } from "lucide-react";

interface Session {
  id: string;
  locale: string;
  messages_count: number;
  tools_used: string[];
  lead_collected: boolean;
  created_at: string;
}

interface Message {
  id: number;
  role: string;
  content: string;
  created_at: string;
}

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "только что";
  if (mins < 60) return `${mins} мин`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч`;
  return `${Math.floor(hrs / 24)} дн`;
}

export default function ChatsPage() {
  const { fetchApi } = useAdmin();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Detail view
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const loadSessions = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const res = await fetchApi(`/api/admin/chats?page=${p}`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        setTotal(data.total);
        setPages(data.pages);
        setPage(data.page);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetchApi]);

  useEffect(() => { loadSessions(1); }, [loadSessions]);

  // Auto-refresh sessions every 15 seconds
  useEffect(() => {
    if (activeSession) return;
    const interval = setInterval(() => loadSessions(page), 15000);
    return () => clearInterval(interval);
  }, [activeSession, page, loadSessions]);

  const loadMessages = useCallback(async (sessionId: string, showSpinner = true) => {
    if (showSpinner) setLoadingMessages(true);
    try {
      const res = await fetchApi(`/api/admin/chats?session_id=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages);
      }
    } catch { /* silent */ }
    finally { setLoadingMessages(false); }
  }, [fetchApi]);

  async function openSession(session: Session) {
    setActiveSession(session);
    loadMessages(session.id, true);
  }

  // Auto-refresh active chat every 10 seconds
  useEffect(() => {
    if (!activeSession) return;
    const interval = setInterval(() => loadMessages(activeSession.id, false), 10000);
    return () => clearInterval(interval);
  }, [activeSession, loadMessages]);

  // Detail view
  if (activeSession) {
    return (
      <div>
        <button onClick={() => setActiveSession(null)} className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад к списку
        </button>

        <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 mb-4 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs bg-[var(--muted)] text-[var(--muted-foreground)] px-2 py-1 rounded">
              {activeSession.locale.toUpperCase()}
            </span>
            <span className="text-xs text-[var(--muted-foreground)]">
              {activeSession.messages_count} сообщений
            </span>
            {activeSession.lead_collected && (
              <span className="text-xs bg-[var(--success-light)] text-[var(--success)] px-2 py-1 rounded-full font-medium">
                Лид собран
              </span>
            )}
            {activeSession.tools_used.length > 0 && (
              <span className="text-xs text-[var(--muted-foreground)]">
                Инструменты: {activeSession.tools_used.join(", ")}
              </span>
            )}
            <span className="text-xs text-[var(--muted-foreground)]">
              {new Date(activeSession.created_at).toLocaleString("ru-RU")}
            </span>
          </div>
        </div>

        {loadingMessages ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--muted-foreground)]" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center py-10 text-sm text-[var(--muted-foreground)]">
            Сообщения не сохранены (сессия до обновления)
          </p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "" : "flex-row-reverse"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-[var(--muted)]" : "bg-[var(--primary-light)]"
                }`}>
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-[var(--muted-foreground)]" />
                  ) : (
                    <Bot className="w-4 h-4 text-[var(--primary)]" />
                  )}
                </div>
                <div className={`flex-1 max-w-[80%] rounded-xl p-3 text-sm ${
                  msg.role === "user"
                    ? "bg-[var(--muted)] text-[var(--foreground)]"
                    : "bg-[var(--primary-light)] text-[var(--foreground)]"
                }`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className="text-[10px] text-[var(--muted-foreground)] mt-1">
                    {new Date(msg.created_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // List view
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Чаты AI</h1>
          <p className="text-sm text-[var(--muted-foreground)]">{total} сессий</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-center py-20 text-[var(--muted-foreground)] text-sm">Чатов пока нет</p>
      ) : (
        <>
          <div className="space-y-2">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => openSession(s)}
                className="w-full text-left bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 hover:border-[var(--primary)]/30 transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[var(--primary-light)] flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--foreground)]">
                        Сессия · {s.messages_count} сообщ. · {s.locale.toUpperCase()}
                      </p>
                      <p className="text-xs text-[var(--muted-foreground)] truncate">
                        {s.tools_used.length > 0 ? s.tools_used.join(", ") : "без инструментов"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.lead_collected && (
                      <span className="text-xs bg-[var(--success-light)] text-[var(--success)] px-2 py-0.5 rounded-full font-medium">
                        Лид
                      </span>
                    )}
                    <span className="text-xs text-[var(--muted-foreground)]">{timeAgo(s.created_at)}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => loadSessions(page - 1)} disabled={page <= 1}
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[var(--muted-foreground)]">{page} / {pages}</span>
              <button onClick={() => loadSessions(page + 1)} disabled={page >= pages}
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
