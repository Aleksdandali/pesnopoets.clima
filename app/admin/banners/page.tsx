"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../layout";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  GripVertical,
  Save,
  Loader2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

interface Banner {
  id: string;
  title: Record<string, string>;
  subtitle: Record<string, string>;
  image_desktop: string | null;
  image_mobile: string | null;
  link: string;
  sort_order: number;
  is_active: boolean;
}

const LOCALES = ["bg", "en", "ru", "ua"] as const;
const LOCALE_LABELS: Record<string, string> = { bg: "BG", en: "EN", ru: "RU", ua: "UA" };

export default function BannersPage() {
  const { fetchApi, password } = useAdmin();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetchApi("/api/admin/banners");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBanners(data.banners);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [fetchApi]);

  useEffect(() => { load(); }, [load]);

  function showMsg(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function addBanner() {
    setSaving("new");
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          title: { bg: "Нов банер", en: "New Banner", ru: "Новый баннер", ua: "Новий банер" },
          subtitle: { bg: "", en: "", ru: "", ua: "" },
          link: "/",
          sort_order: banners.length,
        }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBanners((prev) => [...prev, data.banner]);
      setEditId(data.banner.id);
      showMsg("Баннер создан");
    } catch {
      setError("Ошибка создания");
    } finally {
      setSaving(null);
    }
  }

  async function saveBanner(banner: Banner) {
    setSaving(banner.id);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, ...banner }),
      });
      if (!res.ok) throw new Error();
      showMsg("Сохранено");
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(null);
    }
  }

  async function deleteBanner(id: string) {
    if (!confirm("Удалить баннер?")) return;
    setSaving(id);
    try {
      const res = await fetchApi(`/api/admin/banners?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBanners((prev) => prev.filter((b) => b.id !== id));
      if (editId === id) setEditId(null);
      showMsg("Удалено");
    } catch {
      setError("Ошибка удаления");
    } finally {
      setSaving(null);
    }
  }

  async function moveOrder(id: string, direction: "up" | "down") {
    const idx = banners.findIndex((b) => b.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= banners.length) return;

    const updated = [...banners];
    [updated[idx], updated[swapIdx]] = [updated[swapIdx], updated[idx]];
    updated.forEach((b, i) => (b.sort_order = i));
    setBanners(updated);

    // Save both sort_orders
    await Promise.all([saveBanner(updated[idx]), saveBanner(updated[swapIdx])]);
  }

  function updateBanner(id: string, patch: Partial<Banner>) {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  function updateTitle(id: string, locale: string, value: string) {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, title: { ...b.title, [locale]: value } } : b))
    );
  }

  function updateSubtitle(id: string, locale: string, value: string) {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, subtitle: { ...b.subtitle, [locale]: value } } : b))
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--muted-foreground)]" />
      </div>
    );
  }

  const editBanner = editId ? banners.find((b) => b.id === editId) : null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Баннеры</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Сетка баннеров на главной странице</p>
          </div>
        </div>
        <button
          onClick={addBanner}
          disabled={saving === "new"}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-colors"
        >
          {saving === "new" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Добавить
        </button>
      </div>

      {/* Page layout schema */}
      <div className="mb-6 bg-[var(--background)] rounded-xl border border-[var(--border)] p-4 sm:p-5">
        <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-3">Расположение на главной странице</p>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="px-3 py-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-center">Hero-баннер</div>
          <div className="px-3 py-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-center">Полоска доверия</div>
          <div className="px-3 py-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-center">Категории</div>
          <div className="px-3 py-2.5 rounded-lg bg-[var(--primary)] text-white text-center font-bold ring-2 ring-[var(--primary)]/30">
            ★ Баннерная сетка (2×3 на десктопе, 1 колонка на мобиле)
          </div>
          <div className="px-3 py-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-center">Популярные товары</div>
          <div className="px-3 py-2 rounded-lg bg-[var(--muted)] text-[var(--muted-foreground)] text-center">Почему мы / Бренды / Футер</div>
        </div>
        <p className="text-[11px] text-[var(--muted-foreground)] mt-3">Размеры картинок: Desktop <span className="font-mono font-semibold">580×300 px</span> · Mobile <span className="font-mono font-semibold">375×200 px</span> (необяз.) · WebP до 80 KB</p>
      </div>

      {message && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--success-light)] text-[var(--success)] text-sm font-medium">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 px-4 py-2 rounded-lg bg-[var(--danger-light)] text-[var(--danger)] text-sm font-medium">
          {error}
          <button onClick={() => setError("")} className="ml-2 underline">ок</button>
        </div>
      )}

      {/* Banner list */}
      <div className="space-y-2">
        {banners.length === 0 && (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            Нет баннеров. Нажмите «Добавить» чтобы создать первый.
          </div>
        )}

        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`bg-[var(--background)] rounded-xl border transition-colors ${
              editId === banner.id ? "border-[var(--primary)] ring-1 ring-[var(--primary)]/20" : "border-[var(--border)]"
            }`}
          >
            {/* Row summary */}
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col gap-0.5 text-[var(--muted-foreground)]">
                <button
                  onClick={() => moveOrder(banner.id, "up")}
                  disabled={idx === 0}
                  className="p-0.5 hover:text-[var(--foreground)] disabled:opacity-20 transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => moveOrder(banner.id, "down")}
                  disabled={idx === banners.length - 1}
                  className="p-0.5 hover:text-[var(--foreground)] disabled:opacity-20 transition-colors"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Thumbnail */}
              <div className="w-16 h-10 rounded-lg bg-[var(--muted)] overflow-hidden shrink-0">
                {banner.image_desktop ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={banner.image_desktop} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-[var(--muted-foreground)]" />
                  </div>
                )}
              </div>

              {/* Title + link */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--foreground)] truncate">
                  {banner.title.ru || banner.title.bg || "Без названия"}
                </p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">{banner.link}</p>
              </div>

              {/* Actions */}
              <button
                onClick={() => {
                  const updated = { ...banner, is_active: !banner.is_active };
                  updateBanner(banner.id, { is_active: !banner.is_active });
                  saveBanner(updated);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  banner.is_active
                    ? "text-[var(--success)] hover:bg-[var(--success-light)]"
                    : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                }`}
                title={banner.is_active ? "Активен" : "Скрыт"}
              >
                {banner.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setEditId(editId === banner.id ? null : banner.id)}
                className="px-3 py-1.5 text-xs font-medium text-[var(--primary)] bg-[var(--primary-light)] rounded-lg hover:bg-[var(--primary)]/20 transition-colors"
              >
                {editId === banner.id ? "Свернуть" : "Редактировать"}
              </button>

              <button
                onClick={() => deleteBanner(banner.id)}
                className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--danger)] hover:bg-[var(--danger-light)] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Expanded editor */}
            {editId === banner.id && editBanner && (
              <div className="border-t border-[var(--border)] p-4 space-y-4">
                {/* Titles per locale */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-2">Заголовок</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCALES.map((loc) => (
                      <div key={loc} className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--muted-foreground)]">
                          {LOCALE_LABELS[loc]}
                        </span>
                        <input
                          value={editBanner.title[loc] || ""}
                          onChange={(e) => updateTitle(banner.id, loc, e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                          placeholder={`Заголовок (${loc})`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtitles per locale */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-2">Подзаголовок</label>
                  <div className="grid grid-cols-2 gap-2">
                    {LOCALES.map((loc) => (
                      <div key={loc} className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[var(--muted-foreground)]">
                          {LOCALE_LABELS[loc]}
                        </span>
                        <input
                          value={editBanner.subtitle[loc] || ""}
                          onChange={(e) => updateSubtitle(banner.id, loc, e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                          placeholder={`Подзаголовок (${loc})`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images + Link */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Картинка (desktop)</label>
                    <input
                      value={editBanner.image_desktop || ""}
                      onChange={(e) => updateBanner(banner.id, { image_desktop: e.target.value || null })}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      placeholder="URL картинки 580x300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Картинка (mobile)</label>
                    <input
                      value={editBanner.image_mobile || ""}
                      onChange={(e) => updateBanner(banner.id, { image_mobile: e.target.value || null })}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      placeholder="URL картинки 375x200 (необяз.)"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Ссылка</label>
                    <input
                      value={editBanner.link}
                      onChange={(e) => updateBanner(banner.id, { link: e.target.value })}
                      className="w-full px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                      placeholder="/klimatici?btu=9000"
                    />
                  </div>
                </div>

                {/* Preview */}
                {editBanner.image_desktop && (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">Превью</label>
                    <div className="relative w-full max-w-md aspect-[580/300] rounded-xl overflow-hidden bg-[var(--muted)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={editBanner.image_desktop} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <p className="text-white font-bold text-lg leading-tight">{editBanner.title.ru || editBanner.title.bg}</p>
                        <p className="text-white/80 text-sm mt-0.5">{editBanner.subtitle.ru || editBanner.subtitle.bg}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save button */}
                <button
                  onClick={() => saveBanner(editBanner)}
                  disabled={saving === banner.id}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-colors"
                >
                  {saving === banner.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Сохранить
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
