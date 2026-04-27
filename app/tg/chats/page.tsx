"use client";

import { useState, useEffect, useCallback } from "react";
import { useMiniApp } from "../TgShell";
import { useTelegram } from "../../../telegram-miniapp/hooks/useTelegram";
import { Loader2, Sparkles, ArrowLeft, User, Bot } from "lucide-react";

interface Session { id: string; locale: string; messages_count: number; tools_used: string[]; lead_collected: boolean; created_at: string }
interface Message { id: number; role: string; content: string; created_at: string }

function timeAgo(d: string) {
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 1) return "сейчас"; if (mins < 60) return `${mins}м`;
  const hrs = Math.floor(mins / 60); if (hrs < 24) return `${hrs}ч`;
  return `${Math.floor(hrs / 24)}д`;
}

export default function TgChatsPage() {
  const { fetch } = useMiniApp();
  const tg = useTelegram();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsg, setLoadingMsg] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/tg/admin/chats?page=1") as { sessions: Session[] };
      setSessions(data.sessions);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetch]);

  useEffect(() => { loadSessions(); }, [loadSessions]);

  async function openSession(s: Session) {
    setActive(s);
    setLoadingMsg(true);
    tg.haptic.light();
    try {
      const data = await fetch(`/api/tg/admin/chats?session_id=${s.id}`) as { messages: Message[] };
      setMessages(data.messages);
    } catch { /* silent */ }
    finally { setLoadingMsg(false); }
  }

  if (active) {
    return (
      <div>
        <div className="px-4 pt-5 pb-3" style={{ background: tg.theme.bg }}>
          <button onClick={() => { setActive(null); tg.haptic.light(); }} className="flex items-center gap-1 text-[13px] mb-2" style={{ color: tg.theme.link }}>
            <ArrowLeft className="w-4 h-4" /> Назад
          </button>
          <div className="flex items-center gap-2 flex-wrap text-[11px]" style={{ color: tg.theme.hint }}>
            <span>{active.locale.toUpperCase()}</span>
            <span>·</span>
            <span>{active.messages_count} сообщ.</span>
            {active.lead_collected && <span className="px-2 py-0.5 rounded-full font-medium" style={{ background: "#dcfce7", color: "#15803d" }}>Лид</span>}
          </div>
        </div>

        {loadingMsg ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} /></div>
        ) : messages.length === 0 ? (
          <p className="text-center py-16 text-[13px]" style={{ color: tg.theme.hint }}>Сообщения не сохранены</p>
        ) : (
          <div className="px-4 py-3 space-y-2.5">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "" : "flex-row-reverse"}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: m.role === "user" ? tg.theme.bgSecondary : `${tg.theme.link}15` }}>
                  {m.role === "user" ? <User className="w-3.5 h-3.5" style={{ color: tg.theme.hint }} /> : <Bot className="w-3.5 h-3.5" style={{ color: tg.theme.link }} />}
                </div>
                <div className="max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed" style={{
                  background: m.role === "user" ? tg.theme.bgSecondary : `${tg.theme.link}10`,
                  color: tg.theme.text,
                  borderBottomLeftRadius: m.role === "assistant" ? 6 : undefined,
                  borderBottomRightRadius: m.role === "user" ? 6 : undefined,
                }}>
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 pt-5 pb-3" style={{ background: tg.theme.bg }}>
        <h1 className="text-[20px] font-bold" style={{ color: tg.theme.text }}>Чаты AI</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} /></div>
      ) : sessions.length === 0 ? (
        <p className="text-center py-16 text-[13px]" style={{ color: tg.theme.hint }}>Чатов пока нет</p>
      ) : (
        <div className="px-4 space-y-2.5">
          {sessions.map((s) => (
            <button key={s.id} onClick={() => openSession(s)} className="w-full text-left flex items-center gap-3 p-3.5 rounded-2xl active:scale-[0.98] transition-transform" style={{ background: tg.theme.bg }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${tg.theme.link}10` }}>
                <Sparkles className="w-5 h-5" style={{ color: tg.theme.link }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium" style={{ color: tg.theme.text }}>{s.messages_count} сообщ. · {s.locale.toUpperCase()}</p>
                <p className="text-[12px] truncate" style={{ color: tg.theme.hint }}>{s.tools_used.length > 0 ? s.tools_used.join(", ") : "без инструментов"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {s.lead_collected && <span className="w-2 h-2 rounded-full" style={{ background: "#15803d" }} />}
                <span className="text-[11px]" style={{ color: tg.theme.hint }}>{timeAgo(s.created_at)}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
