"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Loader2, Send, Wrench, Sparkles } from "lucide-react";
import { useTelegram } from "../../../telegram-miniapp/hooks/useTelegram";
import { getToken } from "../../../telegram-miniapp/lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  tools?: { name: string; input: unknown; output?: unknown }[];
}

interface SseEvent {
  type: "text_delta" | "tool_use" | "tool_result" | "done" | "error";
  text?: string;
  name?: string;
  input?: unknown;
  output?: unknown;
  message?: string;
}

const SUGGESTED = [
  "KPI за 7 дней",
  "Откуда пришли заявки за месяц",
  "Топ страниц по конверсии",
  "Воронка мобильного приложения",
];

const QUESTION_MAP: Record<string, string> = {
  "KPI за 7 дней": "Покажи KPI за последние 7 дней с разбивкой по источникам.",
  "Откуда пришли заявки за месяц": "Какие источники дали больше всего заявок за последние 30 дней?",
  "Топ страниц по конверсии": "Топ-10 страниц с лучшей конверсией visitors → inquiry.",
  "Воронка мобильного приложения": "Покажи воронку мобильного приложения по неделям. Где основные потери?",
};

export default function TgInsightsPage() {
  const tg = useTelegram();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(question: string) {
    if (!question.trim() || streaming) return;
    setError(null);
    setInput("");

    const nextMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: question },
      { role: "assistant", content: "", tools: [] },
    ];
    setMessages(nextMessages);
    setStreaming(true);
    tg.haptic.select();

    const apiMessages = nextMessages
      .filter((m) => !(m.role === "assistant" && m.content === "" && (!m.tools || m.tools.length === 0)))
      .map((m) => ({ role: m.role, content: m.content }));

    const jwt = getToken();
    try {
      const res = await fetch("/api/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: JSON.stringify({ locale: "ru", messages: apiMessages, surface: "tg" }),
      });

      if (!res.ok || !res.body) {
        setError(`Ошибка ${res.status}`);
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const raw of events) {
          const line = raw.split("\n").find((l) => l.startsWith("data:"));
          if (!line) continue;
          const json = line.slice(5).trim();
          if (!json) continue;
          let event: SseEvent;
          try {
            event = JSON.parse(json);
          } catch {
            continue;
          }

          setMessages((prev) => {
            const arr = [...prev];
            const last = arr[arr.length - 1];
            if (!last || last.role !== "assistant") return prev;
            if (event.type === "text_delta" && event.text) {
              last.content = (last.content ?? "") + event.text;
            } else if (event.type === "tool_use" && event.name) {
              last.tools = [...(last.tools ?? []), { name: event.name, input: event.input }];
            } else if (event.type === "tool_result" && event.name) {
              const tools = [...(last.tools ?? [])];
              for (let i = tools.length - 1; i >= 0; i--) {
                if (tools[i].name === event.name && tools[i].output === undefined) {
                  tools[i] = { ...tools[i], output: event.output };
                  break;
                }
              }
              last.tools = tools;
            } else if (event.type === "error" && event.message) {
              setError(event.message);
            }
            return arr;
          });
        }
      }
      tg.haptic.success();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка соединения");
      tg.haptic.error();
    } finally {
      setStreaming(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="flex flex-col h-full">
      <header
        className="px-4 py-3 flex items-center gap-2 sticky top-0 z-10"
        style={{ background: tg.theme.bg, borderBottom: `1px solid ${tg.theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
      >
        <Sparkles className="w-5 h-5" style={{ color: tg.theme.link }} />
        <div>
          <p className="text-sm font-semibold" style={{ color: tg.theme.text }}>ИИ-аналитик</p>
          <p className="text-[10px]" style={{ color: tg.theme.hint }}>Спросите про KPI, заявки, выручку</p>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{ background: tg.theme.bgSecondary }}
      >
        {messages.length === 0 && (
          <div className="space-y-3 py-6">
            <p className="text-center text-xs" style={{ color: tg.theme.hint }}>
              Выберите шаблон или задайте свой вопрос
            </p>
            <div className="space-y-1.5">
              {SUGGESTED.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => void send(QUESTION_MAP[label] || label)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-sm"
                  style={{ background: tg.theme.bg, color: tg.theme.text, border: `1px solid ${tg.theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <TgMessage key={i} m={m} theme={tg.theme} />
        ))}

        {error && (
          <div
            className="text-xs px-3 py-2 rounded-lg"
            style={{ background: "rgba(220,38,38,0.1)", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)" }}
          >
            {error}
          </div>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="p-3 flex gap-2 sticky bottom-0"
        style={{ background: tg.theme.bg, borderTop: `1px solid ${tg.theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
          placeholder="Например: сколько заявок за неделю?"
          className="flex-1 px-4 py-2.5 text-sm rounded-full outline-none disabled:opacity-50"
          style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40"
          style={{ background: tg.theme.button, color: tg.theme.buttonText }}
        >
          {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}

function TgMessage({ m, theme }: {
  m: ChatMessage;
  theme: { bg: string; bgSecondary: string; text: string; hint: string; link: string; isDark: boolean };
}) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-md text-sm whitespace-pre-wrap"
          style={{ background: theme.link, color: "#fff" }}
        >
          {m.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-1.5">
        {m.tools && m.tools.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {m.tools.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono"
                style={{ background: theme.bg, color: theme.hint, border: `1px solid ${theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
              >
                <Wrench className="w-2.5 h-2.5" />
                {t.name}
              </span>
            ))}
          </div>
        )}
        {m.content && (
          <div
            className="px-3 py-2 rounded-2xl rounded-bl-md text-sm whitespace-pre-wrap"
            style={{ background: theme.bg, color: theme.text }}
          >
            {m.content}
          </div>
        )}
      </div>
    </div>
  );
}
