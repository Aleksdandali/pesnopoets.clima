"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
  price_eur: number;
  price_bgn?: number;
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

const STORAGE_PREFIX = "pesnopoets-consultant-v2";
const LEGACY_STORAGE_KEY = "pesnopoets-consultant-v1"; // removed in v2 (mixed locales)
const STORAGE_MAX_MESSAGES = 40; // keep chat size bounded

function storageKeyFor(locale: Locale): string {
  return `${STORAGE_PREFIX}-${locale}`;
}

function loadStoredMessages(locale: Locale): ChatMessage[] | null {
  if (typeof window === "undefined") return null;
  try {
    // One-time cleanup of the legacy cross-locale key so old mixed-language
    // history doesn't contaminate the new locale-scoped conversation.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = window.localStorage.getItem(storageKeyFor(locale));
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

function saveMessages(locale: Locale, msgs: ChatMessage[]) {
  if (typeof window === "undefined") return;
  try {
    const trimmed = msgs.slice(-STORAGE_MAX_MESSAGES);
    window.localStorage.setItem(storageKeyFor(locale), JSON.stringify(trimmed));
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

  // Load saved chat history whenever locale changes (per device, per locale).
  // When user switches /bg → /ru, we reset and load the RU-specific history,
  // so the AI never sees mixed-language context that could hijack its locale.
  useEffect(() => {
    setHydrated(false);
    const stored = loadStoredMessages(locale);
    setMessages(stored && stored.length > 0 ? stored : []);
    setHydrated(true);
  }, [locale]);

  // Persist messages whenever they change (after hydration, to avoid wiping storage with empty state)
  useEffect(() => {
    if (!hydrated) return;
    saveMessages(locale, messages);
  }, [messages, hydrated, locale]);

  // Belt-and-suspenders: save when the page is hidden or being unloaded.
  // pagehide fires reliably on iOS Safari when closing/switching tabs;
  // visibilitychange covers backgrounding. Without this, a fast tab-close
  // mid-stream could leave the effect-based save un-flushed.
  useEffect(() => {
    if (!hydrated) return;
    const flush = () => {
      saveMessages(locale, messages);
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [hydrated, locale, messages]);

  // Seed greeting on first open (only if no saved history)
  useEffect(() => {
    if (open && hydrated && messages.length === 0) {
      setMessages([
        { id: crypto.randomUUID(), role: "assistant", text: labels.greeting },
      ]);
    }
  }, [open, hydrated, messages.length, labels.greeting]);

  // Auto-scroll on new content and when chat opens.
  // Instant jump when opening (we just want to land at the bottom),
  // smooth when new messages/deltas arrive during an active session.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // rAF ensures the panel is painted before we measure scrollHeight,
    // otherwise the first scroll on open can miss the latest message.
    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: open && messages.length <= 1 ? "auto" : "smooth",
      });
    });
  }, [messages, streaming, open]);

  // Lift above sticky mobile CTA when open + lock background scroll
  useEffect(() => {
    if (!open) {
      document.body.removeAttribute("data-consultant-open");
      return;
    }
    document.body.setAttribute("data-consultant-open", "true");

    const scrollY = window.scrollY;
    const prev = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      document.body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
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
            // If search_products or get_product_details returned products, collect them.
            // IMPORTANT: when the AI calls search_products multiple times in the same turn
            // (e.g. broad search → refined search), we REPLACE rather than append so the
            // cards match what the AI actually describes in the final prose. Accumulating
            // caused mismatches where the card showed model A but the AI described model B.
            const out = event.output as Record<string, unknown> | undefined;
            if (out && Array.isArray(out.products)) {
              pendingProducts = [...(out.products as ProductCardData[])];
            } else if (out && typeof out === "object" && "slug" in out && "url" in out) {
              // get_product_details returns a single product — append to existing set so
              // a follow-up drilldown can add to the last search result.
              pendingProducts.push(out as unknown as ProductCardData);
            }
          } else if (event.type === "error") {
            setError(String(event.message ?? labels.errorGeneric));
          }
        }
      }

      // Attach collected products to the last assistant message
      if (pendingProducts.length > 0) {
        // Dedupe by slug, cap at 3 (AI is instructed to present 3 options)
        const seen = new Set<string>();
        const unique = pendingProducts.filter((p) => {
          if (seen.has(p.slug)) return false;
          seen.add(p.slug);
          return true;
        }).slice(0, 3);
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
            className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500 text-white shadow-[0_8px_24px_rgb(16_185_129/0.4)] hover:scale-105 hover:shadow-[0_12px_32px_rgb(16_185_129/0.5)] transition-all duration-200 group"
          >
            <span
              className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-25"
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
          className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[380px] sm:h-[600px] sm:max-h-[85vh] z-[70] flex flex-col bg-white sm:rounded-2xl shadow-2xl sm:border sm:border-border overflow-hidden animate-consultant-in"
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
              <MessageBubble
                key={m.id}
                message={m}
                labels={labels}
                onProductClick={() => setOpen(false)}
              />
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
  onProductClick,
}: {
  message: ChatMessage;
  labels: ConsultantChatProps["labels"];
  onProductClick?: () => void;
}) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] space-y-2`}>
        <div
          className={`px-3.5 py-2.5 rounded-2xl text-[13.5px] leading-relaxed ${
            isUser
              ? "bg-primary text-primary-foreground rounded-br-md"
              : "bg-white text-foreground rounded-bl-md shadow-sm border border-border"
          }`}
        >
          {message.text ? renderRich(message.text) : "\u200B"}
        </div>

        {/* Inline product cards (assistant only) */}
        {!isUser && message.products && message.products.length > 0 && (
          <div className="space-y-2">
            {message.products.map((p) => (
              <Link
                key={p.slug}
                href={p.url}
                onClick={onProductClick}
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
                      {p.price_eur ?? p.price_bgn} {labels.viewPrice}
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

/**
 * Minimal inline renderer for chat messages.
 * Supports: **bold**, `- ` / `• ` bullets, and paragraph breaks.
 * Keeps streaming-safe (handles partial markdown gracefully).
 */
function renderRich(text: string): React.ReactNode {
  // Normalize bullet markers and split into blocks by blank lines.
  const blocks = text.trim().split(/\n{2,}/);

  return blocks.map((block, bi) => {
    const lines = block.split("\n").map((l) => l.replace(/\s+$/, ""));
    const isBulletBlock =
      lines.length > 1 && lines.every((l) => /^\s*[-•]\s+/.test(l));

    if (isBulletBlock) {
      return (
        <ul key={bi} className="my-1 space-y-1 pl-0 list-none">
          {lines.map((l, li) => (
            <li key={li} className="flex gap-2">
              <span className="text-emerald-500 shrink-0 leading-relaxed">•</span>
              <span className="flex-1">{renderInline(l.replace(/^\s*[-•]\s+/, ""))}</span>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p
        key={bi}
        className={bi > 0 ? "mt-2" : undefined}
      >
        {lines.map((l, li) => (
          <React.Fragment key={li}>
            {li > 0 && <br />}
            {renderInline(l)}
          </React.Fragment>
        ))}
      </p>
    );
  });
}

/** Inline markdown: **bold**. Everything else passes through as text. */
function renderInline(s: string): React.ReactNode {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) {
      return (
        <strong key={i} className="font-semibold">
          {m[1]}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
