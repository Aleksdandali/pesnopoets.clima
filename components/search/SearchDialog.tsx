"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SearchResult {
  slug: string;
  title: string;
  manufacturer: string | null;
  price_eur: number;
  image_url: string | null;
  url: string;
}

interface SearchDialogProps {
  locale: string;
}

export default function SearchDialog({ locale }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSearched(false);
    setError(false);
    // Restore focus to the trigger button (WCAG 2.4.3)
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  // Cmd+K / Ctrl+K to toggle search
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

  // Keyboard: Escape to close
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  // Focus trap: cycle Tab within dialog (WCAG 2.4.3)
  useEffect(() => {
    if (!open || !dialogRef.current) return;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [open]);

  // Lock body scroll when open (iOS-safe, matching ConsultantChat)
  useEffect(() => {
    if (!open) return;

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

    // Focus input after dialog opens
    setTimeout(() => inputRef.current?.focus(), 50);

    return () => {
      document.body.style.position = prev.position;
      document.body.style.top = prev.top;
      document.body.style.width = prev.width;
      document.body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
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
          setActiveIndex(-1);
          setError(false);
        } else {
          setResults([]);
          setError(true);
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setResults([]);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setSearched(true);
        }
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, locale]);

  // Click outside dialog content to close
  function handleBackdropClick(e: React.MouseEvent) {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      close();
    }
  }

  return (
    <>
      {/* Search trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] px-2 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors duration-200"
        aria-label={
          locale === "bg"
            ? "Търсене на продукти"
            : locale === "ru"
              ? "Поиск продуктов"
              : locale === "ua"
                ? "Пошук продуктів"
                : "Search products"
        }
      >
        <Search className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Dialog overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm animate-search-backdrop-in"
          onClick={handleBackdropClick}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={
              locale === "bg"
                ? "Търсене на продукти"
                : locale === "ru"
                  ? "Поиск продуктов"
                  : locale === "ua"
                    ? "Пошук продуктів"
                    : "Search products"
            }
            className="w-full h-full sm:h-auto sm:max-w-lg sm:mt-[10vh] bg-white sm:rounded-2xl sm:border sm:border-border shadow-2xl flex flex-col overflow-hidden animate-search-panel-in"
          >
            {/* Search input header */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/60">
              <Search
                className="w-5 h-5 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
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
                  } else if (e.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
                    e.preventDefault();
                    const url = results[activeIndex].url;
                    close();
                    window.location.href = url;
                  }
                }}
                aria-label={
                  locale === "bg"
                    ? "Търсене на климатици"
                    : locale === "ru"
                      ? "Поиск кондиционеров"
                      : locale === "ua"
                        ? "Пошук кондиціонерів"
                        : "Search air conditioners"
                }
                placeholder={
                  locale === "bg"
                    ? "Търсене на климатици..."
                    : locale === "ru"
                      ? "Поиск кондиционеров..."
                      : locale === "ua"
                        ? "Пошук кондиціонерів..."
                        : "Search air conditioners..."
                }
                className="flex-1 text-base text-foreground placeholder:text-muted-foreground bg-transparent outline-none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {loading && (
                <Loader2
                  className="w-5 h-5 text-muted-foreground animate-spin shrink-0"
                  aria-hidden="true"
                />
              )}
              <button
                onClick={close}
                className="flex items-center justify-center w-11 h-11 -mr-1.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors duration-200 shrink-0"
                aria-label={
                  locale === "bg"
                    ? "Затвори търсенето"
                    : locale === "ru"
                      ? "Закрыть поиск"
                      : locale === "ua"
                        ? "Закрити пошук"
                        : "Close search"
                }
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Screen reader status announcements (WCAG 4.1.3) */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="sr-only"
            >
              {loading
                ? (locale === "bg" ? "Зареждане..." : locale === "ru" ? "Загрузка..." : locale === "ua" ? "Завантаження..." : "Loading...")
                : error
                  ? (locale === "bg" ? "Грешка при търсенето" : locale === "ru" ? "Ошибка поиска" : locale === "ua" ? "Помилка пошуку" : "Search error")
                  : searched && results.length === 0 && query.trim().length >= 2
                    ? (locale === "bg" ? "Няма намерени резултати" : locale === "ru" ? "Ничего не найдено" : locale === "ua" ? "Нічого не знайдено" : "No results found")
                    : results.length > 0
                      ? (locale === "bg" ? `${results.length} резултата` : locale === "ru" ? `${results.length} результатов` : locale === "ua" ? `${results.length} результатів` : `${results.length} results found`)
                      : ""
              }
            </div>

            {/* Results area */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2 max-h-[60vh] sm:max-h-[50vh]">
              {results.length > 0 && (
                <ul
                  className="space-y-1"
                  role="list"
                  aria-label={
                    locale === "bg"
                      ? "Резултати от търсенето"
                      : locale === "ru"
                        ? "Результаты поиска"
                        : locale === "ua"
                          ? "Результати пошуку"
                          : "Search results"
                  }
                >
                  {results.map((item, index) => (
                    <li key={item.slug}>
                      <Link
                        href={item.url}
                        onClick={close}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/70 active:bg-muted transition-colors duration-200 group ${index === activeIndex ? "bg-muted/70" : ""}`}
                      >
                        {/* Product image */}
                        <div className="w-12 h-12 rounded-lg bg-muted/50 overflow-hidden shrink-0 flex items-center justify-center border border-border/40">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-contain"
                              unoptimized
                            />
                          ) : (
                            <Search
                              className="w-5 h-5 text-muted-foreground/40"
                              aria-hidden="true"
                            />
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                            {item.title}
                          </p>
                          {item.manufacturer && (
                            <p className="text-xs text-muted-foreground truncate mt-0.5">
                              {item.manufacturer}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <span className="text-sm font-bold text-primary tabular-nums shrink-0">
                          {item.price_eur}&nbsp;&euro;
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* Error state */}
              {error && !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle
                    className="w-10 h-10 text-danger/40 mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    {locale === "bg"
                      ? "Грешка при търсенето. Опитайте отново."
                      : locale === "ru"
                        ? "Ошибка поиска. Попробуйте снова."
                        : locale === "ua"
                          ? "Помилка пошуку. Спробуйте ще раз."
                          : "Search error. Please try again."}
                  </p>
                </div>
              )}

              {/* No results */}
              {searched && !loading && !error && results.length === 0 && query.trim().length >= 2 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search
                    className="w-10 h-10 text-muted-foreground/30 mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    {locale === "bg"
                      ? "Няма намерени резултати"
                      : locale === "ru"
                        ? "Ничего не найдено"
                        : locale === "ua"
                          ? "Нічого не знайдено"
                          : "No results found"}
                  </p>
                </div>
              )}

              {/* Initial state hint */}
              {!searched && !loading && results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search
                    className="w-10 h-10 text-muted-foreground/20 mb-3"
                    aria-hidden="true"
                  />
                  <p className="text-sm text-muted-foreground">
                    {locale === "bg"
                      ? "Въведете поне 2 символа за търсене"
                      : locale === "ru"
                        ? "Введите минимум 2 символа для поиска"
                        : locale === "ua"
                          ? "Введіть мінімум 2 символи для пошуку"
                          : "Type at least 2 characters to search"}
                  </p>
                </div>
              )}
            </div>

            {/* Keyboard hint -- desktop only */}
            <div className="hidden sm:flex items-center justify-between px-4 py-2 border-t border-border/40">
              <span className="text-[10px] text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-mono font-medium">↑↓</kbd>
                <span className="ml-1.5">
                  {locale === "bg" ? "навигация" : locale === "ru" ? "навигация" : locale === "ua" ? "навігація" : "navigate"}
                </span>
              </span>
              <span className="text-[10px] text-muted-foreground">
                <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border/60 text-[10px] font-mono font-medium">Esc</kbd>
                <span className="ml-1.5">
                  {locale === "bg" ? "затвори" : locale === "ru" ? "закрыть" : locale === "ua" ? "закрити" : "close"}
                </span>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
