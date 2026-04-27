"use client";

import { useState } from "react";
import { Bot, ChevronDown, ChevronRight, Wrench, BookOpen, MessageSquare, Cpu, Globe, ShieldCheck } from "lucide-react";

/* ─── All AI consultant configuration displayed read-only ─── */

function Section({ title, icon: Icon, children, defaultOpen = false }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[var(--background)] rounded-xl border border-[var(--border)] shadow-sm overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-5 text-left hover:bg-[var(--muted)]/50 transition-colors">
        <div className="w-8 h-8 rounded-lg bg-[var(--primary-light)] flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[var(--primary)]" />
        </div>
        <span className="flex-1 text-sm font-semibold text-[var(--foreground)]">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-[var(--muted-foreground)]" /> : <ChevronRight className="w-4 h-4 text-[var(--muted-foreground)]" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-[var(--border)]">{children}</div>}
    </div>
  );
}

function Code({ children }: { children: string }) {
  return <pre className="mt-3 p-4 bg-[var(--muted)] rounded-lg text-xs text-[var(--foreground)] overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">{children}</pre>;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs font-medium text-[var(--muted-foreground)] sm:w-40 shrink-0">{label}</span>
      <span className="text-sm text-[var(--foreground)]">{value}</span>
    </div>
  );
}

export default function AIConfigPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[var(--primary-light)] flex items-center justify-center">
          <Bot className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--foreground)]">AI Консультант — Полная конфигурация</h1>
          <p className="text-sm text-[var(--muted-foreground)]">Всё что знает и умеет AI</p>
        </div>
      </div>

      <div className="space-y-4">

        {/* General */}
        <Section title="Общие параметры" icon={Cpu} defaultOpen>
          <div className="mt-3 space-y-0">
            <InfoRow label="Модель" value="Claude Sonnet 4.6 (claude-sonnet-4-6)" />
            <InfoRow label="Max tokens" value="1024" />
            <InfoRow label="Max tool turns" value="6 (цикл: запрос → инструмент → ответ)" />
            <InfoRow label="Языки" value="BG, EN, RU, UA — автоматически по локали сайта" />
            <InfoRow label="Стиль" value="Тёплый, прямой, прагматичный. 1-4 предложения. Не навязчивый." />
            <InfoRow label="Формат цен" value="Товары в EUR (€), монтаж в BGN (лв.)" />
          </div>
        </Section>

        {/* Hard Rules */}
        <Section title="Жёсткие правила (11 штук)" icon={ShieldCheck}>
          <div className="mt-3 space-y-2 text-sm text-[var(--foreground)]">
            <p><strong>R1.</strong> Отвечает ТОЛЬКО на языке текущей локали сайта</p>
            <p><strong>R2.</strong> Не упоминает товар без вызова инструмента (search_products)</p>
            <p><strong>R3.</strong> Показывает ровно 3 варианта (не больше, не меньше)</p>
            <p><strong>R4.</strong> Текст совпадает с карточками товаров в UI</p>
            <p><strong>R5.</strong> Не выдумывает факты — гарантия, цены, сроки только через инструменты</p>
            <p><strong>R6.</strong> Задаёт максимум 1 уточняющий вопрос</p>
            <p><strong>R7.</strong> Честность по брендам — проверяет каталог, не угадывает</p>
            <p><strong>R8.</strong> Не обещает скидки, онлайн-оплату, рассрочку</p>
            <p><strong>R9.</strong> Передаёт менеджеру через collect_lead при интенте на покупку</p>
            <p><strong>R10.</strong> Использует selling_points/best_for/warnings из карточки товара</p>
            <p><strong>R11.</strong> Проактивно просит номер телефона — после рекомендации или 2+ вопросов предлагает связь с менеджером. Не навязчиво в первом сообщении, но настойчиво после.</p>
          </div>
        </Section>

        {/* Decision Trees */}
        <Section title="Сценарии поведения (A-J)" icon={MessageSquare}>
          <div className="mt-3 space-y-3 text-sm text-[var(--foreground)]">
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">A: «Нужен кондиционер для комнаты»</p>
              <p className="text-[var(--muted-foreground)] mt-1">Спрашивает площадь → calculate_btu → search_products → 3 варианта с ценами</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">B: «Сколько стоит монтаж?»</p>
              <p className="text-[var(--muted-foreground)] mt-1">get_faq → цитирует тарифы из FAQ</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">C: Гарантия / доставка / оплата / покрытие</p>
              <p className="text-[var(--muted-foreground)] mt-1">get_faq → цитирует ответ</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">D: «Хочу конкретный бренд/модель»</p>
              <p className="text-[var(--muted-foreground)] mt-1">search_products с фильтром → если нет — предлагает альтернативу</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">E: Коммерция (офис, ресторан, склад)</p>
              <p className="text-[var(--muted-foreground)] mt-1">Не рекомендует товар → собирает лид для менеджера</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">F: Сервис / профилактика / ремонт / фреон</p>
              <p className="text-[var(--muted-foreground)] mt-1">get_faq → цены → collect_lead для записи</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">G: Просит скидку</p>
              <p className="text-[var(--muted-foreground)] mt-1">→ «Скидки обсуждает менеджер» → collect_lead</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">H: Неясный запрос</p>
              <p className="text-[var(--muted-foreground)] mt-1">→ Один вопрос: «Для какой комнаты и площадь?»</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">I: Не знает ответа</p>
              <p className="text-[var(--muted-foreground)] mt-1">→ Честно: «Лучше спросить менеджера» → collect_lead</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold">J: «Что у вас есть? Какие бренды?»</p>
              <p className="text-[var(--muted-foreground)] mt-1">get_catalog_summary → список брендов и цен из каталога</p>
            </div>
          </div>
        </Section>

        {/* Tools */}
        <Section title="Инструменты (7 штук)" icon={Wrench}>
          <div className="mt-3 space-y-2 text-sm">
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold text-[var(--foreground)]">search_products</p>
              <p className="text-[var(--muted-foreground)]">Поиск товаров в каталоге: по BTU, цене, бренду, шуму. До 8 результатов.</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold text-[var(--foreground)]">get_product_details</p>
              <p className="text-[var(--muted-foreground)]">Полные характеристики товара по slug.</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold text-[var(--foreground)]">get_catalog_summary</p>
              <p className="text-[var(--muted-foreground)]">Агрегация каталога: бренды, кол-во, диапазон цен.</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold text-[var(--foreground)]">calculate_btu</p>
              <p className="text-[var(--muted-foreground)]">Расчёт BTU по площади + ориентация, этаж, изоляция, люди.</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold text-[var(--foreground)]">get_installation_price</p>
              <p className="text-[var(--muted-foreground)]">Цена монтажа по BTU из lib/pricing.ts.</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold text-[var(--foreground)]">get_faq</p>
              <p className="text-[var(--muted-foreground)]">FAQ по ключевым словам: гарантия, монтаж, доставка, оплата и т.д.</p>
            </div>
            <div className="p-3 bg-[var(--muted)] rounded-lg">
              <p className="font-semibold text-[var(--foreground)]">collect_lead</p>
              <p className="text-[var(--muted-foreground)]">Сбор лида: имя + телефон → Supabase inquiries + Telegram уведомление.</p>
            </div>
          </div>
        </Section>

        {/* FAQ Knowledge Base */}
        <Section title="FAQ база знаний (10 тем)" icon={BookOpen}>
          <div className="mt-3 space-y-2 text-sm">
            {[
              { id: "warranty", q: "Гарантия", a: "До 5 лет от производителя + 12 мес. на монтаж" },
              { id: "install-price", q: "Цена монтажа", a: "372 лв (до 14K BTU), 450 лв (до 24K BTU), 3м трассы включено" },
              { id: "delivery-time", q: "Скорость", a: "В тот же день при заявке до обеда. Заказ — 2-5 дней" },
              { id: "coverage-area", q: "Покрытие", a: "Варна + область (~30 км)" },
              { id: "payment", q: "Оплата", a: "Наличные, перевод, карта на месте. Без онлайн" },
              { id: "commercial", q: "Коммерция", a: "Офисы, магазины, рестораны — бесплатный осмотр + оферта" },
              { id: "service", q: "Сервис/профилактика", a: "Профилактика от 82 лв, диагностика 40 лв, все марки" },
              { id: "inverter", q: "Что такое инвертор", a: "30-50% экономии, тихий, стабильная температура" },
              { id: "multi-split", q: "Мульти-сплит", a: "1 внешний + 2-5 внутренних блоков" },
              { id: "noise", q: "Уровень шума", a: "<22дБ спальня, 22-28 гостиная, 28-35 обычная" },
            ].map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-[var(--muted)] rounded-lg">
                <span className="text-xs font-semibold text-[var(--primary)] shrink-0 w-32">{item.q}</span>
                <span className="text-[var(--muted-foreground)]">{item.a}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Company Context */}
        <Section title="Контекст компании (вшит в промпт)" icon={Globe}>
          <div className="mt-3 space-y-0">
            <InfoRow label="Название" value="Песнопоец Клима" />
            <InfoRow label="Локация" value="Варна, Болгария" />
            <InfoRow label="Телефон" value="+359 87 799 8795" />
            <InfoRow label="Email" value="pesnopoetsklima@gmail.com" />
            <InfoRow label="Бригада" value="Собственная (не субподряд)" />
            <InfoRow label="Покрытие" value="Варна + область до ~30 км" />
            <InfoRow label="Оплата" value="Наличные, перевод, карта на месте. Без онлайн, без рассрочки" />
            <InfoRow label="Языки" value="BG, EN, RU, UA" />
            <InfoRow label="Каналы" value="Сайт, Viber, WhatsApp, телефон" />
          </div>
        </Section>

        {/* BTU Cheatsheet */}
        <Section title="BTU калькулятор (формула)" icon={Cpu}>
          <div className="mt-3 text-sm text-[var(--foreground)] space-y-2">
            <p>Базовый расчёт: <strong>340 BTU × площадь м²</strong></p>
            <p>Модификаторы:</p>
            <ul className="list-disc pl-5 text-[var(--muted-foreground)] space-y-1">
              <li>Южная/западная сторона: +15%</li>
              <li>Последний этаж: +10%</li>
              <li>Плохая изоляция: +20%</li>
              <li>Хорошая изоляция: -10%</li>
              <li>Каждый человек сверх 2: +5%</li>
              <li>Кухня/электроника рядом: +10%</li>
              <li>Потолок выше 2.8м: +5% за каждые 30см</li>
            </ul>
            <p className="mt-2">Стандартные размеры: 9K, 12K, 18K, 24K, 36K, 48K BTU</p>
          </div>
        </Section>

      </div>
    </div>
  );
}
