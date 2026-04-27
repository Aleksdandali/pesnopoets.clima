"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useMiniApp } from "../layout";
import { useTelegram } from "../../../telegram-miniapp/hooks/useTelegram";
import { Search, Loader2, ImageOff } from "lucide-react";

interface Product { id: number; title: string; title_override: string | null; manufacturer: string; price_client: number | null; availability: string; btu: number | null; energy_class: string | null; is_active: boolean; gallery: string[] | null }

const AVAIL_COLOR: Record<string, string> = { "Наличен": "#15803d", "Ограничена наличност": "#b45309", "Неналичен": "#b91c1c" };

export default function TgProductsPage() {
  const { fetch } = useMiniApp();
  const tg = useTelegram();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await fetch(`/api/tg/admin/products?search=${encodeURIComponent(q)}&page=1`) as { products: Product[]; total: number };
      setProducts(data.products);
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
        <h1 className="text-[20px] font-bold" style={{ color: tg.theme.text }}>Каталог</h1>
        <p className="text-[13px]" style={{ color: tg.theme.hint }}>{total} товаров</p>
      </div>

      <div className="px-4 pb-3" style={{ background: tg.theme.bg }}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: tg.theme.hint }} />
          <input
            type="text" value={search} onChange={(e) => handleSearch(e.target.value)}
            placeholder="Поиск..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-[14px] outline-none"
            style={{ background: tg.theme.bgSecondary, color: tg.theme.text }}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: tg.theme.hint }} />
        </div>
      ) : (
        <div className="px-4 space-y-2.5">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: tg.theme.bg }}>
              {p.gallery?.[0] ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.gallery[0]} alt="" className="w-12 h-12 rounded-lg object-contain shrink-0" style={{ background: tg.theme.bgSecondary }} />
              ) : (
                <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0" style={{ background: tg.theme.bgSecondary }}>
                  <ImageOff className="w-5 h-5" style={{ color: tg.theme.hint }} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium truncate" style={{ color: tg.theme.text }}>{p.title_override || p.title}</p>
                <p className="text-[11px]" style={{ color: tg.theme.hint }}>{p.manufacturer} · {p.btu ? `${p.btu.toLocaleString()} BTU` : ""}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-bold" style={{ color: tg.theme.text }}>{p.price_client ? `${Number(p.price_client).toFixed(0)}€` : "—"}</p>
                <p className="text-[10px] font-medium" style={{ color: AVAIL_COLOR[p.availability] || tg.theme.hint }}>{p.availability === "Наличен" ? "✓" : p.availability === "Неналичен" ? "✗" : "⚠"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
