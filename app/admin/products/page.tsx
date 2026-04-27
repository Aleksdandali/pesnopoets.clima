"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useAdmin } from "../layout";
import { Search, Loader2, ChevronLeft, ChevronRight, ImageOff, Pencil } from "lucide-react";

interface Product {
  id: number;
  bittel_id: string;
  title: string;
  title_override: string | null;
  manufacturer: string;
  price_client: number | null;
  price_override: number | null;
  availability: string;
  stock_size: number | null;
  btu: number | null;
  energy_class: string | null;
  is_active: boolean;
  gallery: string[] | null;
}

function availStyle(av: string) {
  if (av === "Наличен") return "bg-[var(--success-light)] text-[var(--success)]";
  if (av === "Ограничена наличност") return "bg-[var(--warning-light)] text-[var(--warning)]";
  return "bg-[var(--danger-light)] text-[var(--danger)]";
}

function availLabel(av: string) {
  if (av === "Наличен") return "Наличен";
  if (av === "Ограничена наличност") return "Огранич.";
  return "Неналичен";
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors ${checked ? "bg-[var(--success)]" : "bg-[var(--border)]"}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

function Thumb({ src }: { src?: string | null }) {
  const [err, setErr] = useState(false);
  if (!src || err) {
    return (
      <div className="w-12 h-12 rounded-lg bg-[var(--muted)] flex items-center justify-center">
        <ImageOff className="w-5 h-5 text-[var(--muted-foreground)]" />
      </div>
    );
  }
  /* eslint-disable-next-line @next/next/no-img-element */
  return <img src={src} alt="" className="w-12 h-12 rounded-lg bg-[var(--muted)] object-contain" onError={() => setErr(true)} />;
}

function PriceInput({ value, onSave }: { value: number | null; onSave: (v: number | null) => void }) {
  const [text, setText] = useState(value != null ? String(value) : "");
  const prev = useRef(value);

  useEffect(() => { setText(value != null ? String(value) : ""); prev.current = value; }, [value]);

  function commit() {
    const t = text.trim();
    const n = t === "" ? null : parseFloat(t);
    if (n === prev.current) return;
    if (t !== "" && (isNaN(n!) || n! < 0)) { setText(prev.current != null ? String(prev.current) : ""); return; }
    onSave(n);
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && commit()}
      placeholder="—"
      className="w-24 px-2 py-1 border border-[var(--border)] rounded text-sm text-right font-mono bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
    />
  );
}

export default function ProductsPage() {
  const { fetchApi, password } = useAdmin();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = useCallback(async (q: string, p: number) => {
    setLoading(true);
    try {
      const res = await fetchApi(`/api/admin/products?search=${encodeURIComponent(q)}&page=${p}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products);
        setTotal(data.total);
        setPages(data.pages);
        setPage(data.page);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetchApi]);

  useEffect(() => { load("", 1); }, [load]);

  function handleSearch(v: string) {
    setSearch(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(() => load(v, 1), 400);
  }

  async function patch(id: number, data: Record<string, unknown>) {
    await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data, password }),
    });
  }

  function handlePrice(id: number, price_override: number | null) {
    setProducts((p) => p.map((x) => x.id === id ? { ...x, price_override } : x));
    patch(id, { price_override });
  }

  function handleActive(id: number, is_active: boolean) {
    setProducts((p) => p.map((x) => x.id === id ? { ...x, is_active } : x));
    patch(id, { is_active });
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--foreground)]">Товары</h1>
        <p className="text-sm text-[var(--muted-foreground)]">{total} товаров</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)]" />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Поиск по названию, бренду или Bittel ID..."
          className="w-full pl-10 pr-4 py-3 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
        </div>
      ) : products.length === 0 ? (
        <p className="text-center py-20 text-[var(--muted-foreground)] text-sm">Товары не найдены</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block bg-[var(--background)] rounded-xl border border-[var(--border)] overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--muted)] border-b border-[var(--border)]">
                  <th className="text-left px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Товар</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Цена Bittel</th>
                  <th className="text-right px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Надбавка €</th>
                  <th className="text-center px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Наличие</th>
                  <th className="text-center px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase">Активен</th>
                  <th className="text-center px-4 py-3 font-medium text-[var(--muted-foreground)] text-xs uppercase w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--muted)]/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb src={p.gallery?.[0]} />
                        <div className="min-w-0">
                          <Link href={`/admin/products/${p.id}`} className="font-medium text-[var(--foreground)] hover:text-[var(--primary)] truncate max-w-[280px] block transition-colors">{p.title_override || p.title}</Link>
                          <p className="text-xs text-[var(--muted-foreground)]">{p.manufacturer} · {p.bittel_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-[var(--foreground)]">
                      {p.price_client != null ? `${Number(p.price_client).toFixed(0)} €` : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end"><PriceInput value={p.price_override} onSave={(v) => handlePrice(p.id, v)} /></div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${availStyle(p.availability)}`}>{availLabel(p.availability)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Toggle checked={p.is_active} onChange={(v) => handleActive(p.id, v)} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Link href={`/admin/products/${p.id}`} className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors inline-flex" title="Редактировать">
                        <Pencil className="w-4 h-4 text-[var(--muted-foreground)]" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <div key={p.id} className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <Thumb src={p.gallery?.[0]} />
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/products/${p.id}`} className="font-medium text-[var(--foreground)] hover:text-[var(--primary)] text-sm leading-snug block transition-colors">{p.title_override || p.title}</Link>
                    <p className="text-xs text-[var(--muted-foreground)]">{p.manufacturer}</p>
                  </div>
                  <Toggle checked={p.is_active} onChange={(v) => handleActive(p.id, v)} />
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-3">
                    <div>
                      <p className="text-[10px] text-[var(--muted-foreground)] uppercase">Bittel</p>
                      <p className="text-sm font-mono">{p.price_client != null ? `${Number(p.price_client).toFixed(0)} €` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[var(--muted-foreground)] uppercase">Надбавка</p>
                      <PriceInput value={p.price_override} onSave={(v) => handlePrice(p.id, v)} />
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${availStyle(p.availability)}`}>{availLabel(p.availability)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button onClick={() => load(search, page - 1)} disabled={page <= 1}
                className="p-2 rounded-lg border border-[var(--border)] bg-[var(--background)] disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-[var(--muted-foreground)]">{page} / {pages}</span>
              <button onClick={() => load(search, page + 1)} disabled={page >= pages}
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
