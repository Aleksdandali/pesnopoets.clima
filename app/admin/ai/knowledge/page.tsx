"use client";

import { useState, useEffect, useCallback } from "react";
import { useAdmin } from "../../layout";
import { Brain, Plus, Save, Trash2, Loader2, ToggleLeft, ToggleRight } from "lucide-react";

interface KnowledgeItem {
  id: number;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

export default function KnowledgePage() {
  const { fetchApi, password } = useAdmin();
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // New item form
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetchApi("/api/admin/knowledge");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [fetchApi]);

  useEffect(() => { load(); }, [load]);

  async function handleAdd() {
    if (!newTitle.trim() || !newContent.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent, password }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setShowForm(false);
        setMessage("Добавлено!");
        setTimeout(() => setMessage(""), 3000);
        load();
      }
    } catch { /* silent */ }
    finally { setSaving(false); }
  }

  async function handleToggle(id: number, is_active: boolean) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, is_active } : i));
    await fetch("/api/admin/knowledge", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_active, password }),
    });
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить эту запись?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    await fetch("/api/admin/knowledge", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password }),
    });
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
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
            <Brain className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--foreground)]">Обучение AI</h1>
            <p className="text-sm text-[var(--muted-foreground)]">Знания которые AI использует в консультации</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--primary-dark)] transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </div>

      {message && <p className="text-sm text-[var(--success)] font-medium mb-4">{message}</p>}

      {/* New item form */}
      {showForm && (
        <div className="bg-[var(--background)] rounded-xl border border-[var(--primary)]/30 p-5 mb-6 shadow-sm space-y-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Заголовок (например: «Условия доставки», «Акции», «Время работы»)"
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Содержание — то, что AI должен знать и говорить клиентам. Пишите как инструкцию: «Мы доставляем бесплатно по Варне. За городом — от 30 лв. Время ожидания 1-2 дня.»"
            rows={5}
            className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] resize-y"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={saving || !newTitle.trim() || !newContent.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--primary)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--primary-dark)] disabled:opacity-50 transition-colors"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Сохранить
            </button>
            <button
              onClick={() => { setShowForm(false); setNewTitle(""); setNewContent(""); }}
              className="px-4 py-2.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Existing items */}
      {items.length === 0 ? (
        <div className="text-center py-16">
          <Brain className="w-12 h-12 text-[var(--border)] mx-auto mb-4" />
          <p className="text-[var(--muted-foreground)] text-sm">Нет записей</p>
          <p className="text-[var(--muted-foreground)] text-xs mt-1">Добавьте знания чтобы AI лучше консультировал клиентов</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className={`bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 shadow-sm ${!item.is_active ? "opacity-50" : ""}`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">{item.title}</h3>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(item.id, !item.is_active)}
                    className="p-1 rounded hover:bg-[var(--muted)] transition-colors"
                    title={item.is_active ? "Выключить" : "Включить"}
                  >
                    {item.is_active ? (
                      <ToggleRight className="w-5 h-5 text-[var(--success)]" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-[var(--muted-foreground)]" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1 rounded hover:bg-[var(--danger-light)] transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4 text-[var(--danger)]" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-[var(--muted-foreground)] whitespace-pre-wrap">{item.content}</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-2">
                {new Date(item.created_at).toLocaleDateString("ru-RU")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
