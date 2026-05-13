"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { createPortal } from "react-dom";
import { Search, X, Loader2, AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  slug: string;
  title: string;
  manufacturer: string | null;
  bittel_id: string | null;
  btu: number | null;
  availability: string | null;
  is_promo: boolean;
  price_eur: number;
  image_url: string | null;
  url: string;
}

interface SearchDialogProps {
  locale: string;
}

const BRAND_CHIPS = ["Daikin", "Mitsubishi", "Gree", "Midea", "Bittel", "Hisense"];
const BTU_CHIPS = ["9000", "12000", "18000", "24000"];

function t(locale: string, dict: Record<string, string>): string {
  return dict[locale] ?? dict.bg ?? dict.en ?? "";
}

// Highlight tokens in text. Case-insensitive, all tokens marked.
function Highlighted({ text, tokens }: { text: string; tokens: string[] }) {
  if (tokens.length === 0) return <>{text}</>;
  const sorted = [...tokens].sort((a, b) => b.length - a.length);
  const escaped = sorted.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark
            key={i}
            className="bg-amber-200/80 text-foreground rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        )
      )}
    </>
  );
}

function AvailabilityDot({
  availability,
  locale,
}: {
  availability: string | null;
  locale: string;
}) {
  if (!availability) return null;
  let color = "";
  let label = "";
  if (availability === "Наличен") {
    color = "bg-emerald-500";
    label = t(locale, {
      bg: "Наличен",
      en: "In stock",
      ru: "В наличии",
      ua: "В наявності",
    });
  } else if (availability === "Ограничена наличност") {
    color = "bg-amber-500";
    label = t(locale, {
      bg: "Ограничен",
      en: "Limited",
      ru: "Ограничен",
      ua: "Обмежено",
    });
  } else {
    color = "bg-rose-500";
    label = t(locale, {
      bg: "Неналичен",
      en: "Out of stock",
      ru: "Нет в наличии",
      ua: "Немає в наявності",
    });
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full ${color}`}
        aria-hidden="true"
      />
      {label}
    </span>
  );
}

// Synchronous body scroll-lock helper. Stable across navigation.
const SCROLL_LOCK_KEY = "__pesnopoets_search_lock__";
type LockState = { y: number; htmlOverflow: string; bodyOverflow: string };

function lockScroll(): void {
  const w = window as unknown as Record<string, unknown>;
  if (w[SCROLL_LOCK_KEY]) return;
  const y = window.scrollY;
  const state: LockState = {
    y,
    htmlOverflow: document.documentElement.style.overflow,
    bodyOverflow: document.body.style.overflow,
  };
  document.documentElement.style.overflow = "hidden";
  document.body.style.overflow = "hidden";
  w[SCROLL_LOCK_KEY] = state;
}

function unlockScroll(): void {
  const w = window as unknown as Record<string, unknown>;
  const state = w[SCROLL_LOCK_KEY] as LockState | undefined;
  if (!state) return;
  document.documentElement.style.overflow = state.htmlOverflow;
  document.body.style.overflow = state.bodyOverflow;
  delete w[SCROLL_LOCK_KEY];
}

export default function SearchDialog({ locale }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Synchronous close — runs body unlock immediately so Link nav can't leak the lock.
  const close = useCallback(() => {
    unlockScroll();
    setOpen(false);
    setQuery("");
    setResults([]);
    setTotal(0);
    setSearched(false);
    setError(false);
    setActiveIndex(-1);
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  // Cmd+K / Ctrl+K to toggle
  useEffect(() => {
    function handleGlobalKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleGlobalKey);
    return () => document.removeEventListener("keydown", handleGlobalKey);
  }, []);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  // Lock scroll while open. Cleanup also unlocks (defense in depth).
  useEffect(() => {
    if (!open) return;
    lockScroll();
    // Defer focus to next frame so iOS associates it with the gesture.
    const id = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => {
      cancelAnimationFrame(id);
      unlockScroll();
    };
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setTotal(0);
      setSearched(false);
      setLoading(false);
      setError(false);
      return;
    }
    setLoading(true);
    setError(false);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
          setTotal(
            typeof data.total === "number"
              ? data.total
              : (data.results || []).length
          );
          setActiveIndex(-1);
          setError(false);
        } else {
          setResults([]);
          setTotal(0);
          setError(true);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setTotal(0);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setSearched(true);
        }
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, locale]);

  function handleBackdropClick(e: React.MouseEvent) {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node))
      close();
  }

  // Tokens for highlighting
  const tokens = query
    .trim()
    .split(/\s+/)
    .filter((token) => token.length >= 2);

  const inputPlaceholder = t(locale, {
    bg: "Бранд, модел, артикул, BTU…",
    en: "Brand, model, SKU, BTU…",
    ru: "Бренд, модель, артикул, BTU…",
    ua: "Бренд, модель, артикул, BTU…",
  });

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] px-2 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors duration-200"
        aria-label={t(locale, {
          bg: "Търсене на продукти",
          en: "Search products",
          ru: "Поиск продуктов",
          ua: "Пошук продуктів",
        })}
      >
        <Search className="w-5 h-5" aria-hidden="true" />
      </button>

      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-start justify-center bg-slate-900/60 backdrop-blur-md animate-search-backdrop-in"
          onClick={handleBackdropClick}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t(locale, {
              bg: "Търсене на продукти",
              en: "Search products",
              ru: "Поиск продуктов",
              ua: "Пошук продуктів",
            })}
            className="
              w-full bg-white shadow-2xl flex flex-col overflow-hidden
              h-[92dvh] rounded-t-3xl animate-search-sheet-in
              sm:h-auto sm:max-w-2xl sm:mt-[8vh] sm:rounded-2xl sm:border sm:border-border/60
              sm:animate-search-panel-in
            "
          >
            {/* Mobile drag handle */}
            <div className="sm:hidden flex justify-center pt-2 pb-1">
              <span className="w-10 h-1 rounded-full bg-slate-200" aria-hidden="true" />
            </div>

            {/* Input header */}
            <div className="relative flex items-center gap-2.5 px-4 py-3 sm:py-3.5 border-b border-border/60 bg-gradient-to-b from-white to-muted/20">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary-light/60 shrink-0">
                <Search className="w-4.5 h-4.5 text-primary" style={{ width: 18, height: 18 }} aria-hidden="true" />
              </div>
              <input
                ref={inputRef}
                type="text"
                role="searchbox"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveIndex((i) => Math.min(i + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveIndex((i) => Math.max(i - 1, 0));
                  } else if (
                    e.key === "Enter" &&
                    activeIndex >= 0 &&
                    results[activeIndex]
                  ) {
                    e.preventDefault();
                    const url = results[activeIndex].url;
                    close();
                    window.location.href = url;
                  }
                }}
                aria-label={t(locale, {
                  bg: "Търсене на климатици",
                  en: "Search air conditioners",
                  ru: "Поиск кондиционеров",
                  ua: "Пошук кондиціонерів",
                })}
                placeholder={inputPlaceholder}
                className="flex-1 text-base sm:text-[17px] text-foreground placeholder:text-muted-foreground/70 bg-transparent outline-none font-medium"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
              />
              {loading && (
                <Loader2
                  className="w-5 h-5 text-primary animate-spin shrink-0"
                  aria-hidden="true"
                />
              )}
              {!loading && query && (
                <button
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="flex items-center justify-center w-8 h-8 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors duration-200 shrink-0"
                  aria-label={t(locale, {
                    bg: "Изчистете",
                    en: "Clear",
                    ru: "Очистить",
                    ua: "Очистити",
                  })}
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
              <button
                onClick={close}
                className="flex items-center justify-center w-11 h-11 -mr-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors duration-200 shrink-0"
                aria-label={t(locale, {
                  bg: "Затворете търсенето",
                  en: "Close search",
                  ru: "Закрыть поиск",
                  ua: "Закрити пошук",
                })}
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Results count strip — only when we have results */}
            {results.length > 0 && (
              <div className="px-4 sm:px-5 py-2 bg-muted/30 border-b border-border/40">
                <p className="text-xs text-muted-foreground">
                  {t(locale, {
                    bg: `Показани ${results.length} от ${total}`,
                    en: `Showing ${results.length} of ${total}`,
                    ru: `Показано ${results.length} из ${total}`,
                    ua: `Показано ${results.length} з ${total}`,
                  })}
                </p>
              </div>
            )}

            {/* SR live region */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {loading
                ? t(locale, {
                    bg: "Зареждане...",
                    en: "Loading...",
                    ru: "Загрузка...",
                    ua: "Завантаження...",
                  })
                : error
                  ? t(locale, {
                      bg: "Грешка при търсенето",
                      en: "Search error",
                      ru: "Ошибка поиска",
                      ua: "Помилка пошуку",
                    })
                  : searched && results.length === 0 && query.trim().length >= 2
                    ? t(locale, {
                        bg: "Няма намерени резултати",
                        en: "No results found",
                        ru: "Ничего не найдено",
                        ua: "Нічого не знайдено",
                      })
                    : results.length > 0
                      ? t(locale, {
                          bg: `${total} резултата`,
                          en: `${total} results found`,
                          ru: `${total} результатов`,
                          ua: `${total} результатів`,
                        })
                      : ""}
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 sm:px-3 py-2">
              {results.length > 0 && (
                <ul
                  className="space-y-1"
                  role="listbox"
                  aria-label={t(locale, {
                    bg: "Резултати от търсенето",
                    en: "Search results",
                    ru: "Результаты поиска",
                    ua: "Результати пошуку",
                  })}
                >
                  {results.map((item, index) => (
                    <li key={item.slug} role="option" aria-selected={index === activeIndex}>
                      <Link
                        href={item.url}
                        onClick={close}
                        className={`
                          flex items-center gap-3 px-2 sm:px-3 py-2.5 rounded-xl
                          hover:bg-primary-light/30 active:bg-primary-light/50
                          transition-colors duration-150 group
                          ${index === activeIndex ? "bg-primary-light/40 ring-1 ring-primary/20" : ""}
                        `}
                      >
                        <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden shrink-0 flex items-center justify-center border border-border/40">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              width={56}
                              height={56}
                              className="w-full h-full object-contain p-1"
                              unoptimized
                            />
                          ) : (
                            <Search
                              className="w-5 h-5 text-muted-foreground/40"
                              aria-hidden="true"
                            />
                          )}
                          {item.is_promo && (
                            <span className="absolute top-0.5 left-0.5 text-[8px] font-bold uppercase tracking-wide text-white bg-rose-500 rounded px-1 py-0.5 leading-none shadow">
                              {t(locale, { bg: "Промо", en: "Sale", ru: "Промо", ua: "Промо" })}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            {item.manufacturer && (
                              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                                {item.manufacturer}
                              </span>
                            )}
                            {item.btu && (
                              <span className="text-[10px] font-semibold text-muted-foreground bg-muted rounded px-1.5 py-0.5 tabular-nums">
                                {item.btu.toLocaleString("ru")} BTU
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-150 leading-snug">
                            <Highlighted text={item.title} tokens={tokens} />
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {item.bittel_id && (
                              <span className="text-[11px] text-muted-foreground/80 font-mono">
                                <Highlighted text={item.bittel_id} tokens={tokens} />
                              </span>
                            )}
                            <AvailabilityDot
                              availability={item.availability}
                              locale={locale}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0 pl-1">
                          <span className="text-base font-extrabold text-foreground tabular-nums leading-tight">
                            {item.price_eur}
                            <span className="text-primary">&nbsp;€</span>
                          </span>
                          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                            {t(locale, {
                              bg: "виж",
                              en: "view",
                              ru: "смотр.",
                              ua: "перегл.",
                            })}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* Error */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle
                    className="w-10 h-10 text-danger/40 mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    {t(locale, {
                      bg: "Грешка при търсенето. Опитайте отново.",
                      en: "Search error. Please try again.",
                      ru: "Ошибка поиска. Попробуйте снова.",
                      ua: "Помилка пошуку. Спробуйте ще раз.",
                    })}
                  </p>
                </div>
              )}

              {/* No results */}
              {searched &&
                !loading &&
                !error &&
                results.length === 0 &&
                query.trim().length >= 2 && (
                  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                      <Search className="w-7 h-7 text-muted-foreground/40" aria-hidden="true" />
                    </div>
                    <p className="text-base font-semibold text-foreground mb-1">
                      {t(locale, {
                        bg: "Нищо не намерихме",
                        en: "Nothing found",
                        ru: "Ничего не найдено",
                        ua: "Нічого не знайдено",
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground mb-5">
                      {t(locale, {
                        bg: "Опитайте друг бранд или модел",
                        en: "Try another brand or model",
                        ru: "Попробуйте другой бренд или модель",
                        ua: "Спробуйте інший бренд або модель",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {BRAND_CHIPS.slice(0, 4).map((b) => (
                        <button
                          key={b}
                          onClick={() => {
                            setQuery(b);
                            inputRef.current?.focus();
                          }}
                          className="text-sm px-3.5 py-1.5 rounded-full bg-primary-light/40 hover:bg-primary hover:text-white text-primary border border-primary/20 transition-colors font-medium"
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* Initial state — beautiful empty */}
              {!searched && !loading && results.length === 0 && (
                <div className="px-3 sm:px-4 py-5 sm:py-6">
                  {/* Hero hint */}
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-light/60 via-primary-light/30 to-white border border-primary/10 p-4 sm:p-5 mb-5">
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-primary/10 blur-2xl" />
                    <div className="absolute top-2 right-3 opacity-30">
                      <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
                    </div>
                    <p className="relative text-sm font-semibold text-foreground mb-0.5">
                      {t(locale, {
                        bg: "Намери своя климатик",
                        en: "Find your AC",
                        ru: "Найди свой кондиционер",
                        ua: "Знайди свій кондиціонер",
                      })}
                    </p>
                    <p className="relative text-xs text-muted-foreground leading-relaxed">
                      {t(locale, {
                        bg: "Търси по бранд, модел, артикулен номер или BTU мощност",
                        en: "Search by brand, model, SKU or BTU power",
                        ru: "Ищите по бренду, модели, артикулу или мощности BTU",
                        ua: "Шукайте за брендом, моделлю, артикулом або потужністю BTU",
                      })}
                    </p>
                  </div>

                  {/* Brand chips */}
                  <div className="mb-5">
                    <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-2.5">
                      {t(locale, {
                        bg: "Популярни марки",
                        en: "Popular brands",
                        ru: "Популярные бренды",
                        ua: "Популярні бренди",
                      })}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {BRAND_CHIPS.map((b) => (
                        <button
                          key={b}
                          onClick={() => {
                            setQuery(b);
                            inputRef.current?.focus();
                          }}
                          className="
                            inline-flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-full
                            bg-white border border-border/80
                            hover:border-primary hover:bg-primary hover:text-white hover:shadow-md hover:shadow-primary/20
                            text-foreground transition-all duration-150 font-medium
                          "
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* BTU chips */}
                  <div className="mb-5">
                    <p className="text-[11px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-2.5">
                      {t(locale, {
                        bg: "По мощност (BTU)",
                        en: "By BTU",
                        ru: "По мощности (BTU)",
                        ua: "За потужністю (BTU)",
                      })}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BTU_CHIPS.map((b) => {
                        const m = parseInt(b, 10) / 1000;
                        return (
                          <button
                            key={b}
                            onClick={() => {
                              setQuery(b);
                              inputRef.current?.focus();
                            }}
                            className="
                              flex flex-col items-start gap-0.5 px-3 py-2.5 rounded-xl
                              bg-white border border-border/80
                              hover:border-primary hover:bg-primary-light/30 hover:shadow-sm
                              text-foreground transition-all duration-150 text-left
                            "
                          >
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                              {m}k BTU
                            </span>
                            <span className="text-xs font-semibold text-foreground">
                              {t(locale, {
                                bg: `до ${m * 3} кв.м`,
                                en: `up to ${m * 3} m²`,
                                ru: `до ${m * 3} кв.м`,
                                ua: `до ${m * 3} кв.м`,
                              })}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Catalog CTA */}
                  <Link
                    href={`/${locale}/klimatici`}
                    onClick={close}
                    className="
                      flex items-center justify-between gap-2 px-4 py-3 rounded-xl
                      bg-foreground text-white hover:bg-foreground/90 transition-colors
                      group
                    "
                  >
                    <span className="text-sm font-semibold">
                      {t(locale, {
                        bg: "Вижте целия каталог",
                        en: "Browse full catalog",
                        ru: "Смотреть весь каталог",
                        ua: "Дивитись весь каталог",
                      })}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>

            {/* Footer hint — desktop only */}
            <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-border/40 bg-muted/20">
              <span className="text-[10px] text-muted-foreground flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-border/60 font-mono font-medium shadow-sm">↑↓</kbd>
                  {t(locale, {
                    bg: "навигация",
                    en: "navigate",
                    ru: "навигация",
                    ua: "навігація",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white border border-border/60 font-mono font-medium shadow-sm">↵</kbd>
                  {t(locale, {
                    bg: "избор",
                    en: "select",
                    ru: "выбор",
                    ua: "вибрати",
                  })}
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white border border-border/60 font-mono font-medium shadow-sm">Esc</kbd>
                {t(locale, {
                  bg: "затвори",
                  en: "close",
                  ru: "закрыть",
                  ua: "закрити",
                })}
              </span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
