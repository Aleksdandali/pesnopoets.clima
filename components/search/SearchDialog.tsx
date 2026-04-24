"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Loader2 } from "lucide-react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setSearched(false);
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

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Focus input after dialog opens
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
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
      return;
    }

    setLoading(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
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
        onClick={() => setOpen(true)}
        className="flex items-center justify-center min-w-[44px] min-h-[44px] px-2 py-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
        aria-label="Search products"
      >
        <Search className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Dialog overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-label="Search products"
        >
          <div
            ref={dialogRef}
            className="w-full h-full sm:h-auto sm:max-w-lg sm:mt-[10vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Search input header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
              <Search
                className="w-5 h-5 text-muted-foreground shrink-0"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
                className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors shrink-0"
                aria-label="Close search"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Results area */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-2 py-2 max-h-[60vh] sm:max-h-[50vh]">
              {results.length > 0 && (
                <ul className="space-y-1" role="list">
                  {results.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={item.url}
                        onClick={close}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-muted/70 transition-colors group"
                      >
                        {/* Product image */}
                        <div className="w-12 h-12 rounded-lg bg-muted/50 overflow-hidden shrink-0 flex items-center justify-center">
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
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {item.title}
                          </p>
                          {item.manufacturer && (
                            <p className="text-xs text-muted-foreground truncate">
                              {item.manufacturer}
                            </p>
                          )}
                        </div>

                        {/* Price */}
                        <span className="text-sm font-semibold text-primary shrink-0">
                          {item.price_eur}&nbsp;&euro;
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* No results */}
              {searched && !loading && results.length === 0 && query.trim().length >= 2 && (
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
          </div>
        </div>
      )}
    </>
  );
}
