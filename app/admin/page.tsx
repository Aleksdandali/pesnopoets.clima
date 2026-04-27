"use client";

import { useState, useEffect, useCallback } from "react";

interface SettingRow {
  key: string;
  value: string;
  updated_at: string;
}

const FIELD_LABELS: Record<string, { label: string; placeholder: string; help: string }> = {
  meta_pixel_id: {
    label: "Meta (Facebook) Pixel ID",
    placeholder: "123456789012345",
    help: "Только ID (число). Скрипт fbq() добавится автоматически.",
  },
  tiktok_pixel_id: {
    label: "TikTok Pixel ID",
    placeholder: "CXXXXXXXXXXXXXXXXX",
    help: "Только ID. Скрипт ttq добавится автоматически.",
  },
  google_ads_id: {
    label: "Google Ads ID",
    placeholder: "AW-18063225430",
    help: "Формат AW-XXXXXXXXXXX. Уже настроен — менять только если нужен другой аккаунт.",
  },
  custom_head_scripts: {
    label: "Custom Scripts (вставить в <head>)",
    placeholder: "<script>...</script>",
    help: "Любой HTML/скрипт. Вставляется как есть в <head> всех страниц сайта.",
  },
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchSettings = useCallback(async (pw: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${pw}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          setAuthed(false);
          setError("Неверный пароль");
          return;
        }
        throw new Error("Fetch failed");
      }
      const data = await res.json();
      const map: Record<string, string> = {};
      for (const row of data.settings as SettingRow[]) {
        map[row.key] = row.value;
      }
      setSettings(map);
      setAuthed(true);
    } catch {
      setError("Ошибка загрузки настроек");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    fetchSettings(password);
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage("Сохранено! Изменения появятся на сайте в течение 1-2 минут.");
    } catch {
      setError("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  }

  // Auto-login if password stored in session
  useEffect(() => {
    const saved = sessionStorage.getItem("admin_pw");
    if (saved) {
      setPassword(saved);
      fetchSettings(saved);
    }
  }, [fetchSettings]);

  useEffect(() => {
    if (authed && password) {
      sessionStorage.setItem("admin_pw", password);
    }
  }, [authed, password]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Админ-панель</h1>
            <p className="text-sm text-gray-500 mb-6">Pesnopoets Clima</p>

            <form onSubmit={handleLogin}>
              <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите пароль"
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !password}
                className="mt-4 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Проверка..." : "Войти"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Настройки трекинга</h1>
            <p className="text-sm text-gray-500 mt-1">Пиксели и скрипты аналитики</p>
          </div>
          <button
            onClick={() => {
              setAuthed(false);
              setPassword("");
              sessionStorage.removeItem("admin_pw");
            }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Выйти
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(FIELD_LABELS).map(([key, field]) => (
            <div key={key} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6">
              <label htmlFor={`field-${key}`} className="block text-sm font-semibold text-gray-900 mb-1">
                {field.label}
              </label>
              <p className="text-xs text-gray-500 mb-3">{field.help}</p>

              {key === "custom_head_scripts" ? (
                <textarea
                  id={`field-${key}`}
                  value={settings[key] || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                  placeholder={field.placeholder}
                  spellCheck={false}
                />
              ) : (
                <input
                  id={`field-${key}`}
                  type="text"
                  value={settings[key] || ""}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
          {message && <p className="text-sm text-green-600 font-medium">{message}</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
