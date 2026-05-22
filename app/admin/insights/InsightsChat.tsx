"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { Loader2, Send, Wrench } from "lucide-react";
import { useAdmin } from "../layout";

/* Lifted from layout so we don't re-export the hook. We can't import from
 * ../layout because layout is a "use client" module that already exports
 * useAdmin. Re-use via the existing pattern.  */
// Note: useAdmin is imported above via the export from layout.tsx.

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  /** Tool calls fired in this assistant turn (for visualisation). */
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

const SUGGESTED: { label: string; q: string }[] = [
  { label: "KPI за 7 дней", q: "Покажи KPI за последние 7 дней. Сравни web и tg." },
  { label: "Топ страниц", q: "Какие 10 страниц приносят больше всего заявок?" },
  { label: "Выручка по каналам", q: "Сколько выручки за 90 дней и по каким каналам она пришла?" },
  { label: "Воронка инквайри", q: "Покажи воронку от заявки до выигрыша. Где основные потери?" },
];

export default function InsightsChat() {
  const { password } = useAdmin();
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

    const apiMessages = nextMessages
      .filter((m) => !(m.role === "assistant" && m.content === "" && (!m.tools || m.tools.length === 0)))
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const res = await fetch(`/api/insights?pw=${encodeURIComponent(password || "")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: "ru", messages: apiMessages }),
      });

      if (!res.ok || !res.body) {
        setError(`Ошибка ${res.status}: ${res.statusText}`);
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

        // SSE: split on double newlines
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка соединения");
    } finally {
      setStreaming(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-4rem)]">
      <div className="mb-3">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">ИИ-аналитик</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Спросите о KPI, воронке, источниках трафика, поведении пользователей.
        </p>
      </div>

      {messages.length === 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {SUGGESTED.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => void send(s.q)}
              className="px-3 py-2 text-xs rounded-full border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--background)] p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="text-center text-sm text-[var(--muted-foreground)] py-12">
            Задайте вопрос об аналитике или выберите шаблон выше.
          </div>
        ) : (
          messages.map((m, i) => <MessageBlock key={i} m={m} />)
        )}
      </div>

      {error && (
        <div className="mt-3 text-sm text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
          placeholder="Например: какие источники дали больше всего заявок за последние 14 дней?"
          className="flex-1 px-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="px-4 py-3 bg-[var(--primary)] text-white rounded-lg font-medium hover:bg-[var(--primary-dark)] disabled:opacity-40 transition-colors inline-flex items-center gap-2"
        >
          {streaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          <span className="hidden sm:inline">{streaming ? "Думаю..." : "Спросить"}</span>
        </button>
      </form>
    </div>
  );
}

function MessageBlock({ m }: { m: ChatMessage }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-br-md bg-[var(--primary)] text-white text-sm whitespace-pre-wrap">
          {m.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <div className="max-w-[90%] space-y-2">
        {m.tools && m.tools.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {m.tools.map((t, i) => (
              <ToolChip key={i} tool={t} />
            ))}
          </div>
        )}
        {m.content && (
          <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-[var(--muted)] text-[var(--foreground)] text-sm whitespace-pre-wrap">
            {m.content}
          </div>
        )}
      </div>
    </div>
  );
}

function ToolChip({ tool }: { tool: { name: string; input: unknown; output?: unknown } }) {
  const [open, setOpen] = useState(false);
  const rows = extractRowCount(tool.output);
  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <Wrench className="w-3 h-3" />
        <span className="font-mono">{tool.name}</span>
        {rows !== null && <span className="text-[10px] opacity-60">{rows} строк</span>}
      </button>
      {open && (
        <pre className="mt-1 max-h-60 overflow-auto p-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[10px] leading-tight font-mono text-[var(--muted-foreground)]">
{JSON.stringify({ input: tool.input, output: tool.output }, null, 2)}
        </pre>
      )}
    </div>
  );
}

function extractRowCount(output: unknown): number | null {
  if (output && typeof output === "object" && "rows" in (output as Record<string, unknown>)) {
    const rows = (output as { rows?: unknown[] }).rows;
    if (Array.isArray(rows)) return rows.length;
  }
  return null;
}
