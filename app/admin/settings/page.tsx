"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../layout";
import { Settings, Save, Loader2 } from "lucide-react";

const FIELDS = [
  { key: "meta_pixel_id", label: "Meta (Facebook) Pixel ID", placeholder: "123456789012345", help: "Только ID (число). Скрипт fbq() добавится автоматически.", type: "input" },
  { key: "tiktok_pixel_id", label: "TikTok Pixel ID", placeholder: "CXXXXXXXXXXXXXXXXX", help: "Только ID. Скрипт ttq добавится автоматически.", type: "input" },
  { key: "google_ads_id", label: "Google Ads ID", placeholder: "AW-XXXXXXXXXXX", help: "Формат AW-XXXXXXXXXXX.", type: "input" },
  { key: "custom_head_scripts", label: "Custom Scripts (в <head>)", placeholder: "<script>...</script>", help: "HTML/JS код. Вставляется в <head> всех страниц сайта.", type: "textarea" },
] as const;

export default function SettingsPage() {
  const { fetchApi, password } = useAdmin();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetchApi("/api/admin/settings");
      if (!res.ok) throw new Error();
      const data = await res.json();
      const map: Record<string, string> = {};
      for (const row of data.settings) {
        map[row.key] = typeof row.value === "string" ? row.value : "";
      }
      setSettings(map);
    } catch {
      setError("Ошибка загрузки");
    } finally {
      setLoading(false);
    }
  }, [fetchApi]);

  useEffect(() => { load(); }, [load]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings, password }),
      });
      if (!res.ok) throw new Error();
      setMessage("Сохранено! Изменения появятся на сайте в течение 1-2 минут.");
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

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
          <Settings className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">Настройки трекинга</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Пиксели и скрипты аналитики</p>
        </div>
      </div>

      <div className="space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5">
            <label htmlFor={`f-${field.key}`} className="block text-sm font-semibold text-[var(--foreground)] mb-1">
              {field.label}
            </label>
            <p className="text-xs text-[var(--muted-foreground)] mb-3">{field.help}</p>
            {field.type === "textarea" ? (
              <textarea
                id={`f-${field.key}`}
                value={settings[field.key] || ""}
                onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                rows={5}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm font-mono bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-y"
                placeholder={field.placeholder}
                spellCheck={false}
              />
            ) : (
              <input
                id={`f-${field.key}`}
                type="text"
                value={settings[field.key] || ""}
                onChange={(e) => setSettings((s) => ({ ...s, [field.key]: e.target.value }))}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg text-sm font-mono bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
                placeholder={field.placeholder}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-colors"
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
