"use client";

import Link from "next/link";
import { MessageCircle, Brain, Bot, ChevronRight } from "lucide-react";

const SECTIONS = [
  {
    href: "/admin/ai/chats",
    label: "Чаты",
    desc: "История диалогов AI с клиентами. Обновляется в реальном времени.",
    icon: MessageCircle,
  },
  {
    href: "/admin/ai/knowledge",
    label: "Обучение",
    desc: "Добавляй знания — AI будет использовать их в консультациях.",
    icon: Brain,
  },
  {
    href: "/admin/ai/config",
    label: "Мозг",
    desc: "Все правила, сценарии, инструменты и FAQ — полная конфигурация AI.",
    icon: Bot,
  },
];

export default function AIHubPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
          <Bot className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">ИИ Консультант</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Чаты, обучение и настройки AI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="bg-[var(--background)] rounded-xl border border-[var(--border)] p-5 hover:border-[var(--primary)]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
              </div>
              <h2 className="text-sm font-semibold text-[var(--foreground)] mb-1">{s.label}</h2>
              <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">{s.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
