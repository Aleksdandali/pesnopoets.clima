"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Locale = "bg" | "en" | "ru" | "ua";

interface ConsultantChatProps {
  locale: Locale;
  labels: {
    triggerAria: string;   // "Отвори AI консултант"
    title: string;         // "AI консултант"
    subtitle: string;      // "Онлайн • Отговаря мигновено"
    greeting: string;      // First-turn bot message
    placeholder: string;   // Input placeholder
    send: string;          // Send button aria
    close: string;         // Close button aria
    thinking: string;      // "Мисля..."
    errorGeneric: string;  // "Възникна грешка. Опитайте пак."
    disclaimer: string;    // "AI съветник — може да греши. За сигурна информация се свържете с нас."
    viewProduct: string;   // "Виж продукта"
    viewPrice: string;     // "лв"
  };
}

interface ProductCardData {
  slug: string;
  title: string;
  manufacturer: string | null;
  price_bgn: number;
  btu: number | null;
  noise_db_indoor: number | null;
  energy_class: string | null;
  image_url: string | null;
  url: string;
  in_stock: boolean;
}

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  products?: ProductCardData[]; // products rendered inline from a tool_result
  id: string;
}

const STORAGE_KEY = "pesnopoets-consultant-v1";
const STORAGE_MAX_MESSAGES = 40; // keep chat size bounded

function loadStoredMessages(): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    // Minimal shape validation to avoid crashing on bad data.
    return parsed.filter(
      (m): m is ChatMessage =>
        !!m &&
        typeof m === "object" &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.text === "string" &&
        typeof m.id === "string"
    );
  } catch {
    return null;
  }
}

function saveMessages(msgs: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = msgs.slice(-STORAGE_MAX_MESSAGES);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    /* quota / disabled — ignore */
  }
}

export default function ConsultantChat({ locale, labels }: ConsultantChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stickyCta, setStickyCta] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Watch for StickyMobileCTA so trigger button lifts above it on product pages
  useEffect(() => {
    const update = () => setStickyCta(document.body.hasAttribute("data-sticky-cta"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-sticky-cta"] });
    return () => observer.disconnect();
  }, []);

  // Load saved chat history once on mount (per device, locale-agnostic)
  useEffect(() => {
    const stored = loadStoredMessages();
    if (stored && stored.length > 0) {
      setMessages(stored);
    }
    setHydrated(true);
  }, []);

  // Persist messages whenever they change (after hydration, to avoid wiping storage with empty state)
  useEffect(() => {
    if (!hydrated) return;
    saveMessages(messages);
  }, [messages, hydrated]);

  // Seed greeting on first open (only if no saved history)
  useEffect(() => {
    if (open && hydrated && messages.length === 0) {
      setMessages([
        { id: crypto.randomUUID(), role: "assistant", text: labels.greeting },
      ]);
    }
  }, [open, hydrated, messages.length, labels.greeting]);

  // Auto-scroll on new content
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  // Lift above sticky mobile CTA when open
  useEffect(() => {
    if (open) document.body.setAttribute("data-consultant-open", "true");
    else document.body.removeAttribute("data-consultant-open");
  }, [open]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setInput("");
    setError(null);
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", text };
    const assistantMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: "",
    };
    setMessages((m) => [...m, userMsg, assistantMsg]);
    setStreaming(true);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch("/api/consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abort.signal,
        body: JSON.stringify({
          locale,
          messages: [...messages, userMsg]
            .filter((m) => m.role === "user" || m.text.length > 0)
            .map((m) => ({ role: m.role, content: m.text })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let pendingProducts: ProductCardData[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (!data) continue;
          let event: { type: string; [k: string]: unknown };
          try {
            event = JSON.parse(data);
          } catch {
            continue;
          }

          if (event.type === "text_delta" && typeof event.text === "string") {
            setMessages((m) => {
              const copy = [...m];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = { ...last, text: last.text + event.text };
              }
              return copy;
            });
          } else if (event.type === "tool_result") {
            // If search_products or get_product_details returned products, collect them
            const out = event.output as Record<string, unknown> | undefined;
            if (out && Array.isArray(out.products)) {
              pendingProducts = [...pendingProducts, ...(out.products as ProductCardData[])];
            } else if (out && typeof out === "object" && "slug" in out && "url" in out) {
              pendingProducts.push(out as unknown as ProductCardData);
            }
          } else if (event.type === "error") {
            setError(String(event.message ?? labels.errorGeneric));
          }
        }
      }

      // Attach collected products to the last assistant message
      if (pendingProducts.length > 0) {
        // Dedupe by slug, cap at 4
        const seen = new Set<string>();
        const unique = pendingProducts.filter((p) => {
          if (seen.has(p.slug)) return false;
          seen.add(p.slug);
          return true;
        }).slice(0, 4);
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          if (last?.role === "assistant") {
            copy[copy.length - 1] = { ...last, products: unique };
          }
          return copy;
        });
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(labels.errorGeneric);
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }, [input, streaming, messages, locale, labels.errorGeneric]);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Floating trigger — circle button + tiny label underneath.
          Sits ABOVE the contact FAB; lifts further when StickyMobileCTA is present. */}
      {!open && (
        <div
          className={`fixed right-3 sm:right-5 z-[55] transition-all duration-300 ${
            stickyCta ? "bottom-[168px] sm:bottom-[116px]" : "bottom-[96px] sm:bottom-[116px]"
          }`}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={labels.triggerAria}
            data-consultant-trigger
            className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgb(0_135_255/0.35)] hover:scale-105 hover:shadow-[0_12px_32px_rgb(0_135_255/0.45)] transition-all duration-200 group"
          >
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"
              style={{ animation: "ping 4s cubic-bezier(0, 0, 0.2, 1) infinite" }}
            />
            <Sparkles className="relative w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
          </button>
          <span
            className="absolute top-full right-0 mt-1.5 px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[9px] sm:text-[10px] font-semibold text-foreground shadow-sm border border-border/60 whitespace-nowrap pointer-events-none select-none"
            aria-hidden="true"
          >
            {labels.title}
          </span>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label={labels.title}
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] sm:max-h-[85vh] z-[70] flex flex-col bg-white sm:rounded-2xl shadow-2xl sm:border sm:border-border overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/20 shrink-0">
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-400 border-2 border-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-tight">{labels.title}</p>
              <p className="text-[11px] opacity-80 leading-tight">{labels.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={labels.close}
              className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/15 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-muted/30"
            aria-live="polite"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} labels={labels} />
            ))}
            {streaming && messages[messages.length - 1]?.text === "" && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground px-3">
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>{labels.thinking}</span>
              </div>
            )}
            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <p className="px-3 py-1.5 text-[10px] text-muted-foreground bg-white border-t border-border">
            {labels.disclaimer}
          </p>

          {/* Composer */}
          <div className="flex items-end gap-2 p-3 bg-white border-t border-border">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder={labels.placeholder}
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none min-h-[44px] max-h-[120px] px-3 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
            />
            <button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim() || streaming}
              aria-label={labels.send}
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {streaming ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function MessageBubble({
  message,
  labels,
}: {
  message: ChatMessage;
  labels: ConsultantChatProps["labels"];
}) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] space-y-2`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-white text-foreground rounded-bl-md shadow-sm border border-border"
          }`}
        >
          {message.text || "\u200B"}
        </div>

        {/* Inline product cards (assistant only) */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="space-y-2">
            {message.products.map((p) => (
              <Link
                key={p.slug}
                href={p.url}
                className="flex gap-3 p-2 bg-white border border-border rounded-xl shadow-sm hover:shadow-md hover:border-primary/30 transition-all group"
              >
                {p.image_url && (
                  <div className="relative w-16 h-16 shrink-0 rounded-lg bg-muted overflow-hidden">
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {p.manufacturer && (
                      <p className="text-[10px] uppercase tracking-wider text-primary font-semibold leading-none">
                        {p.manufacturer}
                      </p>
                    )}
                    <p className="text-xs font-semibold text-foreground line-clamp-2 mt-0.5">
                      {p.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-foreground tabular-nums">
                      {p.price_bgn} {labels.viewPrice}
                    </span>
                    <span className="text-[10px] text-primary font-semibold group-hover:underline">
                      {labels.viewProduct} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
