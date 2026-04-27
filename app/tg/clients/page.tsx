"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMiniApp } from "../TgShell";
import { useTelegram } from "../../../telegram-miniapp/hooks/useTelegram";
import { Search, Loader2, Phone } from "lucide-react";

interface Client { id: number; phone: string; name: string; email: string | null; tags: string[]; total_inquiries: number; last_inquiry_at: string | null }

function timeAgo(d: string | null) {
  if (!d) return "—";
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "сегодня"; if (days === 1) return "вчера";
  return `${days}д назад`;
}

export default function TgClientsPage() {
  const { fetch } = useMiniApp();
  const tg = useTelegram();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await fetch(`/api/tg/admin/clients?search=${encodeURIComponent(q)}&page=1`) as { clients: Client[]; total: number };
      setClients(data.clients);
      setTotal(data.total);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetch]);

  useEffect(() => { load(""); }, [load]);

  function handleSearch(v: string) {
    setSearch(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(v), 400);
  }

  return (
    <div>
      <div className="px-4 pt-5 pb-3" style={{ background: tg.theme.bg }}>
        <h1 className="text-[20px] font-bold" style={{ color: tg.theme.text }}>Клиенты</h1>
        <p className="text-[13px]" style={{ color: tg.theme.hint }}>{total} клиентов</p>
      </div>

      <div className="px-4 pb-3" style={{ background: tg.theme.bg }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: tg.theme.hint }} />
          <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Поиск..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-[14px] outline-none"
            style={{ background: tg.theme.bgSecondary, color: tg.theme.text }} />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} />
        </div>
      ) : (
        <div className="px-4 space-y-2.5">
          {clients.map((c) => (
            <div key={c.id} className="rounded-2xl p-4" style={{ background: tg.theme.bg }}>
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold" style={{ color: tg.theme.text }}>{c.name || "Без имени"}</p>
                  <a href={`tel:${c.phone}`} className="flex items-center gap-1 mt-0.5" style={{ color: tg.theme.link }} onClick={() => tg.haptic.light()}>
                    <Phone className="w-3 h-3" /><span className="text-[13px]">{c.phone}</span>
                  </a>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[17px] font-bold" style={{ color: tg.theme.text }}>{c.total_inquiries}</p>
                  <p className="text-[10px]" style={{ color: tg.theme.hint }}>заявок</p>
                </div>
              </div>
              {c.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.tags.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full text-[10px] font-medium" style={{ background: tg.theme.bgSecondary, color: tg.theme.hint }}>{t}</span>
                  ))}
                </div>
              )}
              <p className="text-[11px] mt-2" style={{ color: tg.theme.hint }}>Последняя: {timeAgo(c.last_inquiry_at)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
