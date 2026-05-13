import { BedDouble, Sofa, Briefcase, Building2, Snowflake, Sun, Wind, Droplets, Check, Home } from "lucide-react";

type Locale = "bg" | "en" | "ru" | "ua";

interface RoomFitProps {
  locale: string;
  areaM2: number | null;
  btu: number | null;
}

const STRINGS: Record<Locale, {
  title: string;
  subtitle: (area: string) => string;
  rooms: { key: string; label: string; range: string; min: number; max: number }[];
  modesTitle: string;
  modes: { key: string; label: string }[];
  fitYes: string;
  fitNo: string;
  fitTight: string;
}> = {
  bg: {
    title: "За кои помещения е подходящ",
    subtitle: (area) => `Препоръчителна площ: до ${area} кв.м`,
    rooms: [
      { key: "bedroom", label: "Спалня", range: "10–18 кв.м", min: 10, max: 18 },
      { key: "living", label: "Хол / трапезария", range: "18–28 кв.м", min: 18, max: 28 },
      { key: "office", label: "Офис / кабинет", range: "12–22 кв.м", min: 12, max: 22 },
      { key: "studio", label: "Студио / open space", range: "25–40 кв.м", min: 25, max: 40 },
    ],
    modesTitle: "Режими на работа",
    modes: [
      { key: "cool", label: "Охлаждане" },
      { key: "heat", label: "Отопление" },
      { key: "dry", label: "Изсушаване" },
      { key: "fan", label: "Вентилация" },
    ],
    fitYes: "Подходящ",
    fitNo: "Малък за тази площ",
    fitTight: "На границата",
  },
  en: {
    title: "Where this AC fits best",
    subtitle: (area) => `Recommended area: up to ${area} m²`,
    rooms: [
      { key: "bedroom", label: "Bedroom", range: "10–18 m²", min: 10, max: 18 },
      { key: "living", label: "Living / dining room", range: "18–28 m²", min: 18, max: 28 },
      { key: "office", label: "Office / study", range: "12–22 m²", min: 12, max: 22 },
      { key: "studio", label: "Studio / open space", range: "25–40 m²", min: 25, max: 40 },
    ],
    modesTitle: "Operating modes",
    modes: [
      { key: "cool", label: "Cooling" },
      { key: "heat", label: "Heating" },
      { key: "dry", label: "Dehumidify" },
      { key: "fan", label: "Fan" },
    ],
    fitYes: "Good fit",
    fitNo: "Underpowered",
    fitTight: "At the limit",
  },
  ru: {
    title: "Для каких помещений подходит",
    subtitle: (area) => `Рекомендуемая площадь: до ${area} кв.м`,
    rooms: [
      { key: "bedroom", label: "Спальня", range: "10–18 кв.м", min: 10, max: 18 },
      { key: "living", label: "Гостиная / столовая", range: "18–28 кв.м", min: 18, max: 28 },
      { key: "office", label: "Офис / кабинет", range: "12–22 кв.м", min: 12, max: 22 },
      { key: "studio", label: "Студия / open space", range: "25–40 кв.м", min: 25, max: 40 },
    ],
    modesTitle: "Режимы работы",
    modes: [
      { key: "cool", label: "Охлаждение" },
      { key: "heat", label: "Обогрев" },
      { key: "dry", label: "Осушение" },
      { key: "fan", label: "Вентиляция" },
    ],
    fitYes: "Подходит",
    fitNo: "Маловат для этой площади",
    fitTight: "На границе",
  },
  ua: {
    title: "Для яких приміщень підходить",
    subtitle: (area) => `Рекомендована площа: до ${area} кв.м`,
    rooms: [
      { key: "bedroom", label: "Спальня", range: "10–18 кв.м", min: 10, max: 18 },
      { key: "living", label: "Вітальня / їдальня", range: "18–28 кв.м", min: 18, max: 28 },
      { key: "office", label: "Офіс / кабінет", range: "12–22 кв.м", min: 12, max: 22 },
      { key: "studio", label: "Студія / open space", range: "25–40 кв.м", min: 25, max: 40 },
    ],
    modesTitle: "Режими роботи",
    modes: [
      { key: "cool", label: "Охолодження" },
      { key: "heat", label: "Обігрів" },
      { key: "dry", label: "Осушення" },
      { key: "fan", label: "Вентиляція" },
    ],
    fitYes: "Підходить",
    fitNo: "Замалий для цієї площі",
    fitTight: "На межі",
  },
};

const ROOM_ICONS: Record<string, typeof BedDouble> = {
  bedroom: BedDouble,
  living: Sofa,
  office: Briefcase,
  studio: Building2,
};

const MODE_ICONS: Record<string, typeof Snowflake> = {
  cool: Snowflake,
  heat: Sun,
  dry: Droplets,
  fan: Wind,
};

export default function RoomFit({ locale, areaM2, btu }: RoomFitProps) {
  // Skip if we have no signal at all
  if (!areaM2 && !btu) return null;

  const t = STRINGS[(locale as Locale) in STRINGS ? (locale as Locale) : "bg"];

  // Effective max area: prefer DB value; otherwise estimate from BTU (1 kW ≈ 10 m², 1 kW ≈ 3412 BTU → ~30 m² per 10 000 BTU)
  const effectiveArea = areaM2 ?? (btu ? Math.round((btu / 10000) * 30) : 0);

  function fitFor(min: number, max: number): "yes" | "tight" | "no" {
    if (effectiveArea >= max) return "yes";
    if (effectiveArea >= min) return "tight";
    return "no";
  }

  const fitStyles: Record<"yes" | "tight" | "no", { bg: string; text: string; ring: string }> = {
    yes: {
      bg: "bg-success-light/40",
      text: "text-success",
      ring: "ring-1 ring-success/20",
    },
    tight: {
      bg: "bg-warning-light/40",
      text: "text-warning",
      ring: "ring-1 ring-warning/20",
    },
    no: {
      bg: "bg-muted",
      text: "text-muted-foreground",
      ring: "ring-1 ring-border",
    },
  };

  const fitLabels: Record<"yes" | "tight" | "no", string> = {
    yes: t.fitYes,
    tight: t.fitTight,
    no: t.fitNo,
  };

  return (
    <section>
      <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-foreground mb-1.5">
        <div className="w-8 h-8 bg-primary-light/60 rounded-lg flex items-center justify-center">
          <Home className="w-4 h-4 text-primary" aria-hidden="true" />
        </div>
        {t.title}
      </h2>
      {effectiveArea > 0 && (
        <p className="text-sm text-muted-foreground mb-4 ml-[42px]">
          {t.subtitle(String(effectiveArea))}
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        {t.rooms.map((room) => {
          const Icon = ROOM_ICONS[room.key] || Home;
          const fit = fitFor(room.min, room.max);
          const styles = fitStyles[fit];
          return (
            <div
              key={room.key}
              className={`relative p-3 rounded-lg ${styles.bg} ${styles.ring}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${styles.text}`} aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">{room.label}</span>
              </div>
              <div className="text-xs text-muted-foreground leading-tight mb-1.5">{room.range}</div>
              <div className={`inline-flex items-center gap-1 text-[11px] font-medium ${styles.text}`}>
                {fit === "yes" && <Check className="w-3 h-3" aria-hidden="true" />}
                {fitLabels[fit]}
              </div>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2.5 ml-[42px]">{t.modesTitle}</h3>
        <ul className="flex flex-wrap gap-2 ml-[42px]">
          {t.modes.map((mode) => {
            const Icon = MODE_ICONS[mode.key] || Wind;
            return (
              <li
                key={mode.key}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-light/40 text-primary text-xs font-medium"
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {mode.label}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
