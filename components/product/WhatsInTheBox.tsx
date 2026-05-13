import { Package, Wind, Sun, Tv2, FileText, Wrench } from "lucide-react";

type Locale = "bg" | "en" | "ru" | "ua";

interface WhatsInTheBoxProps {
  locale: string;
}

const STRINGS: Record<Locale, {
  title: string;
  subtitle: string;
  items: { label: string; note?: string }[];
}> = {
  bg: {
    title: "Какво ще получите",
    subtitle: "Стандартен пакет с монтаж включва всичко необходимо за работа",
    items: [
      { label: "Вътрешно тяло", note: "с монтажна планка" },
      { label: "Външно тяло", note: "с конзоли за стена" },
      { label: "Дистанционно управление", note: "с батерии" },
      { label: "Документация и гаранционна карта" },
      { label: "Монтажен комплект", note: "до 3 м медни тръби, кабел, конзоли" },
      { label: "Професионален монтаж", note: "от лицензиран екип" },
    ],
  },
  en: {
    title: "What you get",
    subtitle: "Standard installation package includes everything needed for operation",
    items: [
      { label: "Indoor unit", note: "with mounting plate" },
      { label: "Outdoor unit", note: "with wall brackets" },
      { label: "Remote control", note: "with batteries" },
      { label: "Documentation & warranty card" },
      { label: "Installation kit", note: "up to 3 m copper pipes, cable, brackets" },
      { label: "Professional installation", note: "by a licensed team" },
    ],
  },
  ru: {
    title: "Что вы получите",
    subtitle: "Стандартный пакет с монтажом включает всё необходимое для работы",
    items: [
      { label: "Внутренний блок", note: "с монтажной пластиной" },
      { label: "Внешний блок", note: "с настенными кронштейнами" },
      { label: "Пульт управления", note: "с батарейками" },
      { label: "Документация и гарантийный талон" },
      { label: "Монтажный комплект", note: "до 3 м медных труб, кабель, кронштейны" },
      { label: "Профессиональный монтаж", note: "лицензированной бригадой" },
    ],
  },
  ua: {
    title: "Що ви отримаєте",
    subtitle: "Стандартний пакет з монтажем містить усе потрібне для роботи",
    items: [
      { label: "Внутрішній блок", note: "з монтажною пластиною" },
      { label: "Зовнішній блок", note: "з настінними кронштейнами" },
      { label: "Пульт керування", note: "з батарейками" },
      { label: "Документація і гарантійний талон" },
      { label: "Монтажний комплект", note: "до 3 м мідних труб, кабель, кронштейни" },
      { label: "Професійний монтаж", note: "ліцензованою бригадою" },
    ],
  },
};

const ICONS = [Wind, Sun, Tv2, FileText, Wrench, Package];

export default function WhatsInTheBox({ locale }: WhatsInTheBoxProps) {
  const t = STRINGS[(locale as Locale) in STRINGS ? (locale as Locale) : "bg"];

  return (
    <section>
      <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-foreground mb-1.5">
        <div className="w-8 h-8 bg-primary-light/60 rounded-lg flex items-center justify-center">
          <Package className="w-4 h-4 text-primary" aria-hidden="true" />
        </div>
        {t.title}
      </h2>
      <p className="text-sm text-muted-foreground mb-4 ml-[42px]">{t.subtitle}</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {t.items.map((item, i) => {
          const Icon = ICONS[i] || Package;
          return (
            <li
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg border border-border/80 bg-white"
            >
              <div className="w-8 h-8 shrink-0 rounded-lg bg-primary-light/40 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground leading-tight">
                  {item.label}
                </div>
                {item.note && (
                  <div className="text-xs text-muted-foreground leading-snug mt-0.5">
                    {item.note}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
