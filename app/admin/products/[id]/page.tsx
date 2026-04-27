"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAdmin } from "../../layout";
import { ArrowLeft, Save, Loader2, ExternalLink, ImageOff } from "lucide-react";
import Link from "next/link";

interface Product {
  id: number;
  bittel_id: string;
  slug: string;
  title: string;
  title_override: string | null;
  manufacturer: string;
  description: string | null;
  description_override: string | null;
  price_client: number | null;
  price_override: number | null;
  price_promo: number | null;
  is_promo: boolean;
  availability: string;
  stock_size: number | null;
  btu: number | null;
  energy_class: string | null;
  area_m2: number | null;
  noise_db_indoor: number | null;
  refrigerant: string | null;
  warranty_months: number | null;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  is_hidden: boolean;
  gallery: string[] | null;
  synced_at: string | null;
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--foreground)] mb-1">{label}</label>
      {help && <p className="text-xs text-[var(--muted-foreground)] mb-2">{help}</p>}
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] ${mono ? "font-mono" : ""}`}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows || 3}
      className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-y"
    />
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5.5 rounded-full transition-colors ${checked ? "bg-[var(--success)]" : "bg-[var(--border)]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-4.5" : ""}`} />
      </button>
      <span className="text-sm text-[var(--foreground)]">{label}</span>
    </label>
  );
}

export default function ProductDetailPage() {
  const { fetchApi, password } = useAdmin();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Editable fields
  const [titleOverride, setTitleOverride] = useState("");
  const [descOverride, setDescOverride] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [priceOverride, setPriceOverride] = useState("");
  const [pricePromo, setPricePromo] = useState("");
  const [isPromo, setIsPromo] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isHidden, setIsHidden] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetchApi(`/api/admin/products?id=${id}`);
      if (!res.ok) throw new Error();
      const { product: p } = await res.json();
      setProduct(p);
      setTitleOverride(p.title_override || "");
      setDescOverride(p.description_override || "");
      setMetaTitle(p.meta_title || "");
      setMetaDesc(p.meta_description || "");
      setPriceOverride(p.price_override != null ? String(p.price_override) : "");
      setPricePromo(p.price_promo != null ? String(p.price_promo) : "");
      setIsPromo(p.is_promo);
      setIsActive(p.is_active);
      setIsHidden(p.is_hidden);
    } catch {
      setError("Товар не найден");
    } finally {
      setLoading(false);
    }
  }, [fetchApi, id]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: parseInt(id),
          password,
          title_override: titleOverride || null,
          description_override: descOverride || null,
          meta_title: metaTitle || null,
          meta_description: metaDesc || null,
          price_override: priceOverride ? parseFloat(priceOverride) : null,
          price_promo: pricePromo ? parseFloat(pricePromo) : null,
          is_promo: isPromo,
          is_active: isActive,
          is_hidden: isHidden,
        }),
      });
      if (!res.ok) throw new Error();
      setMessage("Сохранено!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--danger)]">{error || "Товар не найден"}</p>
        <Link href="/admin/products" className="text-[var(--primary)] text-sm mt-2 inline-block">← Назад к товарам</Link>
      </div>
    );
  }

  const displayTitle = product.title_override || product.title;
  const thumb = product.gallery?.[0];

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <button onClick={() => router.push("/admin/products")} className="mt-1 p-2 rounded-lg hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft className="w-5 h-5 text-[var(--muted-foreground)]" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-[var(--primary)] font-medium uppercase tracking-wide">{product.manufacturer}</p>
          <h1 className="text-xl font-bold text-[var(--foreground)] leading-tight">{displayTitle}</h1>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">Bittel ID: {product.bittel_id} · Slug: {product.slug}</p>
        </div>
        <a href={`/bg/klimatici/${product.slug}`} target="_blank" rel="noopener"
          className="shrink-0 p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors" title="Открыть на сайте">
          <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)]" />
        </a>
      </div>

      {/* Product info card */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 mb-6 shadow-sm">
        <div className="flex items-start gap-4">
          {thumb ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={thumb} alt="" className="w-24 h-24 rounded-lg bg-[var(--muted)] object-contain shrink-0" />
          ) : (
            <div className="w-24 h-24 rounded-lg bg-[var(--muted)] flex items-center justify-center shrink-0">
              <ImageOff className="w-8 h-8 text-[var(--muted-foreground)]" />
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 text-sm">
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Цена Bittel</p>
              <p className="font-semibold text-[var(--foreground)]">{product.price_client != null ? `${Number(product.price_client).toFixed(0)} €` : "—"}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">BTU</p>
              <p className="font-semibold text-[var(--foreground)]">{product.btu?.toLocaleString() || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Энергокласс</p>
              <p className="font-semibold text-[var(--foreground)]">{product.energy_class || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--muted-foreground)]">Наличие</p>
              <p className="font-semibold text-[var(--foreground)]">{product.availability}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 mb-4 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[var(--foreground)]">SEO</h2>
        <Field label="Meta Title" help="Заголовок в поисковых результатах. Оставьте пустым для автоматического.">
          <Input value={metaTitle} onChange={setMetaTitle} placeholder={displayTitle} />
        </Field>
        <Field label="Meta Description" help="Описание в поисковых результатах (до 160 символов).">
          <Textarea value={metaDesc} onChange={setMetaDesc} placeholder="Описание для поисковиков..." rows={2} />
          <p className="text-xs text-[var(--muted-foreground)] mt-1">{metaDesc.length}/160</p>
        </Field>
      </div>

      {/* Переопределения */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 mb-4 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Переопределения</h2>
        <Field label="Название (override)" help="Заменяет оригинальное название из Bittel. Пустое = используется оригинал.">
          <Input value={titleOverride} onChange={setTitleOverride} placeholder={product.title} />
        </Field>
        <Field label="Описание (override)" help="Заменяет описание из Bittel. Пустое = оригинал.">
          <Textarea value={descOverride} onChange={setDescOverride} placeholder="Своё описание товара..." rows={4} />
        </Field>
      </div>

      {/* Цены */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 mb-4 shadow-sm space-y-4">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Цены</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Надбавка к цене (€)" help="Ваша цена. Пустое = цена Bittel.">
            <Input value={priceOverride} onChange={setPriceOverride} placeholder={product.price_client != null ? String(product.price_client) : "—"} mono />
          </Field>
          <Field label="Промо-цена (€)" help="Показывается как акционная цена, если промо включено.">
            <Input value={pricePromo} onChange={setPricePromo} placeholder="—" mono />
          </Field>
        </div>
        <Toggle label="Промо-акция активна" checked={isPromo} onChange={setIsPromo} />
      </div>

      {/* Видимость */}
      <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 mb-6 shadow-sm space-y-3">
        <h2 className="text-base font-semibold text-[var(--foreground)]">Видимость</h2>
        <Toggle label="Товар активен (виден в каталоге)" checked={isActive} onChange={setIsActive} />
        <Toggle label="Скрыт из каталога (но доступен по ссылке)" checked={isHidden} onChange={setIsHidden} />
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 sticky bottom-20 lg:bottom-4 bg-[var(--muted)] py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 border-t border-[var(--border)]">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Сохранение..." : "Сохранить"}
        </button>
        {message && <p className="text-sm text-[var(--success)] font-medium">{message}</p>}
        {error && <p className="text-sm text-[var(--danger)]">{error}</p>}
      </div>
    </div>
  );
}
