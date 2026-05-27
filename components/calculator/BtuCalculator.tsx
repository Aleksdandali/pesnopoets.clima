"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, Info, Sun } from "lucide-react";

type Locale = "bg" | "en" | "ru" | "ua";

interface Copy {
  area: string;
  areaHint: string;
  ceiling: string;
  ceilingHint: string;
  sun: string;
  sunLow: string;
  sunMed: string;
  sunHigh: string;
  insulation: string;
  insulationGood: string;
  insulationAvg: string;
  insulationPoor: string;
  occupants: string;
  topFloor: string;
  kitchen: string;
  result: string;
  resultBtu: string;
  resultTier: string;
  resultPower: string;
  resultPriceFrom: string;
  ctaBrowse: string;
  ctaMontazh: string;
  ctaConsult: string;
  detailsTitle: string;
  detailsAdj: string;
  detailsBase: string;
  noteTitle: string;
  noteText: string;
}

const COPY: Record<Locale, Copy> = {
  bg: {
    area: "Площ на стаята",
    areaHint: "м²",
    ceiling: "Височина на тавана",
    ceilingHint: "м",
    sun: "Слънчево изложение",
    sunLow: "Северна / сенчеста",
    sunMed: "Изток или запад",
    sunHigh: "Южна / силно слънце",
    insulation: "Изолация",
    insulationGood: "Добра (нова сграда, дограма)",
    insulationAvg: "Средна",
    insulationPoor: "Слаба (стара сграда)",
    occupants: "Постоянни обитатели",
    topFloor: "Последен етаж под покрив",
    kitchen: "Кухня с готвене",
    result: "Препоръка",
    resultBtu: "BTU/h",
    resultTier: "Препоръчан клас",
    resultPower: "kW охлаждане",
    resultPriceFrom: "Монтаж от",
    ctaBrowse: "Виж модели в каталога",
    ctaMontazh: "Заявка за монтаж",
    ctaConsult: "Безплатна консултация",
    detailsTitle: "Как се изчислява",
    detailsAdj: "Корекции",
    detailsBase: "Базова стойност: 600 BTU/h на м² при таван 2,7 м, средно слънце и добра изолация.",
    noteTitle: "Важно",
    noteText: "Калкулаторът дава ориентировъчна стойност. За точен избор и оглед на място — свържете се с нас.",
  },
  en: {
    area: "Room area",
    areaHint: "m²",
    ceiling: "Ceiling height",
    ceilingHint: "m",
    sun: "Sun exposure",
    sunLow: "North / shaded",
    sunMed: "East or west",
    sunHigh: "South / strong sun",
    insulation: "Insulation",
    insulationGood: "Good (new build, double glazing)",
    insulationAvg: "Average",
    insulationPoor: "Poor (old building)",
    occupants: "Regular occupants",
    topFloor: "Top floor under roof",
    kitchen: "Kitchen with cooking",
    result: "Recommendation",
    resultBtu: "BTU/h",
    resultTier: "Recommended class",
    resultPower: "kW cooling",
    resultPriceFrom: "Install from",
    ctaBrowse: "Browse catalog",
    ctaMontazh: "Request installation",
    ctaConsult: "Free consultation",
    detailsTitle: "How it is calculated",
    detailsAdj: "Adjustments",
    detailsBase: "Base value: 600 BTU/h per m² at 2.7 m ceiling, average sun and good insulation.",
    noteTitle: "Important",
    noteText: "The calculator gives an approximate value. For an exact match and on-site survey — contact us.",
  },
  ru: {
    area: "Площадь комнаты",
    areaHint: "м²",
    ceiling: "Высота потолка",
    ceilingHint: "м",
    sun: "Солнечная сторона",
    sunLow: "Север / тень",
    sunMed: "Восток или запад",
    sunHigh: "Юг / сильное солнце",
    insulation: "Утепление",
    insulationGood: "Хорошее (новостройка, стеклопакеты)",
    insulationAvg: "Среднее",
    insulationPoor: "Слабое (старое здание)",
    occupants: "Постоянных жильцов",
    topFloor: "Последний этаж под крышей",
    kitchen: "Кухня с готовкой",
    result: "Рекомендация",
    resultBtu: "BTU/ч",
    resultTier: "Рекомендуемый класс",
    resultPower: "кВт охлаждения",
    resultPriceFrom: "Монтаж от",
    ctaBrowse: "Смотреть каталог",
    ctaMontazh: "Заявка на монтаж",
    ctaConsult: "Бесплатная консультация",
    detailsTitle: "Как рассчитывается",
    detailsAdj: "Корректировки",
    detailsBase: "Базовое значение: 600 BTU/ч на м² при потолке 2,7 м, средняя инсоляция, хорошее утепление.",
    noteTitle: "Важно",
    noteText: "Калькулятор даёт ориентировочное значение. Для точного подбора и осмотра — свяжитесь с нами.",
  },
  ua: {
    area: "Площа кімнати",
    areaHint: "м²",
    ceiling: "Висота стелі",
    ceilingHint: "м",
    sun: "Сонячна сторона",
    sunLow: "Північ / тінь",
    sunMed: "Схід або захід",
    sunHigh: "Південь / сильне сонце",
    insulation: "Утеплення",
    insulationGood: "Добре (новобудова, склопакети)",
    insulationAvg: "Середнє",
    insulationPoor: "Слабке (стара будівля)",
    occupants: "Постійних мешканців",
    topFloor: "Останній поверх під дахом",
    kitchen: "Кухня з готуванням",
    result: "Рекомендація",
    resultBtu: "BTU/год",
    resultTier: "Рекомендований клас",
    resultPower: "кВт охолодження",
    resultPriceFrom: "Монтаж від",
    ctaBrowse: "Дивитись каталог",
    ctaMontazh: "Заявка на монтаж",
    ctaConsult: "Безкоштовна консультація",
    detailsTitle: "Як розраховується",
    detailsAdj: "Коригування",
    detailsBase: "Базове значення: 600 BTU/год на м² при стелі 2,7 м, середнє сонце, добре утеплення.",
    noteTitle: "Важливо",
    noteText: "Калькулятор дає орієнтовне значення. Для точного підбору й огляду на місці — зв'яжіться з нами.",
  },
};

const TIERS = [
  { maxBtu: 9_000, label: "9 000 BTU", kw: 2.6, installEur: 190 },
  { maxBtu: 12_000, label: "12 000 BTU", kw: 3.5, installEur: 190 },
  { maxBtu: 14_000, label: "14 000 BTU", kw: 4.1, installEur: 190 },
  { maxBtu: 18_000, label: "18 000 BTU", kw: 5.3, installEur: 230 },
  { maxBtu: 24_000, label: "24 000 BTU", kw: 7.0, installEur: 230 },
  { maxBtu: 30_000, label: "30 000 BTU", kw: 8.8, installEur: 300 },
];

function pickTier(btu: number) {
  for (const t of TIERS) if (btu <= t.maxBtu) return t;
  return TIERS[TIERS.length - 1];
}

interface Props {
  locale: Locale;
}

export default function BtuCalculator({ locale }: Props) {
  const c = COPY[locale];
  const [area, setArea] = useState(20);
  const [ceiling, setCeiling] = useState(2.7);
  const [sun, setSun] = useState<"low" | "med" | "high">("med");
  const [insulation, setInsulation] = useState<"good" | "avg" | "poor">("avg");
  const [occupants, setOccupants] = useState(2);
  const [topFloor, setTopFloor] = useState(false);
  const [kitchen, setKitchen] = useState(false);

  const { btu, tier, adjustments } = useMemo(() => {
    const base = Math.max(0, area) * 600;
    const adj: { label: string; pct: number }[] = [];

    // ceiling
    const ceilingDelta = Math.max(0, ceiling - 2.7);
    if (ceilingDelta > 0.05) {
      const pct = Math.round((ceilingDelta / 0.3) * 10);
      adj.push({ label: `+${pct}% — ${c.ceiling} ${ceiling.toFixed(1)} ${c.ceilingHint}`, pct });
    }
    if (sun === "high") adj.push({ label: `+20% — ${c.sunHigh}`, pct: 20 });
    if (sun === "low") adj.push({ label: `-10% — ${c.sunLow}`, pct: -10 });
    if (insulation === "poor") adj.push({ label: `+15% — ${c.insulationPoor}`, pct: 15 });
    if (insulation === "good") adj.push({ label: `-5% — ${c.insulationGood}`, pct: -5 });
    if (occupants > 2) {
      const extra = (occupants - 2) * 600;
      adj.push({
        label: `+${extra} BTU — ${c.occupants}: ${occupants}`,
        pct: Math.round((extra / base) * 100),
      });
    }
    if (topFloor) adj.push({ label: `+10% — ${c.topFloor}`, pct: 10 });
    if (kitchen) adj.push({ label: `+4 000 BTU — ${c.kitchen}`, pct: Math.round((4000 / base) * 100) });

    let total = base;
    const ceilingPct = ceilingDelta > 0.05 ? (ceilingDelta / 0.3) * 10 : 0;
    total *= 1 + ceilingPct / 100;
    if (sun === "high") total *= 1.2;
    if (sun === "low") total *= 0.9;
    if (insulation === "poor") total *= 1.15;
    if (insulation === "good") total *= 0.95;
    if (topFloor) total *= 1.1;
    if (occupants > 2) total += (occupants - 2) * 600;
    if (kitchen) total += 4000;

    const rounded = Math.round(total / 100) * 100;
    return { btu: rounded, tier: pickTier(rounded), adjustments: adj };
  }, [area, ceiling, sun, insulation, occupants, topFloor, kitchen, c]);

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-6 lg:gap-8">
      {/* Form */}
      <div className="bg-white border border-border/60 rounded-2xl p-5 sm:p-6 space-y-5">
        <div>
          <label htmlFor="btu-area" className="block text-sm font-semibold text-foreground mb-1.5">
            {c.area} <span className="text-muted-foreground font-normal">({c.areaHint})</span>
          </label>
          <input
            id="btu-area"
            name="area_m2"
            type="number"
            min={5}
            max={200}
            step={1}
            value={area}
            onChange={(e) => setArea(Number(e.target.value) || 0)}
            className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <input
            id="btu-area-range"
            name="area_m2_range"
            aria-label={c.area}
            type="range"
            min={5}
            max={120}
            step={1}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="w-full mt-2 accent-primary"
          />
        </div>

        <div>
          <label htmlFor="btu-ceiling" className="block text-sm font-semibold text-foreground mb-1.5">
            {c.ceiling} <span className="text-muted-foreground font-normal">({c.ceilingHint})</span>
          </label>
          <input
            id="btu-ceiling"
            name="ceiling_h"
            type="number"
            min={2.2}
            max={5}
            step={0.1}
            value={ceiling}
            onChange={(e) => setCeiling(Number(e.target.value) || 2.7)}
            className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div role="radiogroup" aria-labelledby="btu-sun-label">
          <div id="btu-sun-label" className="block text-sm font-semibold text-foreground mb-1.5">
            <Sun className="inline w-4 h-4 mr-1 text-primary" aria-hidden="true" />
            {c.sun}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "med", "high"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={sun === v}
                onClick={() => setSun(v)}
                className={`px-3 py-2 rounded-xl text-sm border transition ${
                  sun === v
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border/60 hover:border-primary/40"
                }`}
              >
                {v === "low" ? c.sunLow : v === "med" ? c.sunMed : c.sunHigh}
              </button>
            ))}
          </div>
        </div>

        <div role="radiogroup" aria-labelledby="btu-insulation-label">
          <div id="btu-insulation-label" className="block text-sm font-semibold text-foreground mb-1.5">
            {c.insulation}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(["good", "avg", "poor"] as const).map((v) => (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={insulation === v}
                onClick={() => setInsulation(v)}
                className={`px-3 py-2 rounded-xl text-sm border transition ${
                  insulation === v
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-border/60 hover:border-primary/40"
                }`}
              >
                {v === "good" ? c.insulationGood : v === "avg" ? c.insulationAvg : c.insulationPoor}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="btu-occupants" className="block text-sm font-semibold text-foreground mb-1.5">
            {c.occupants}
          </label>
          <input
            id="btu-occupants"
            name="occupants"
            type="number"
            min={1}
            max={10}
            step={1}
            value={occupants}
            onChange={(e) => setOccupants(Number(e.target.value) || 1)}
            className="w-full px-4 py-2.5 border border-border/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              name="top_floor"
              type="checkbox"
              checked={topFloor}
              onChange={(e) => setTopFloor(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            {c.topFloor}
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input
              name="kitchen"
              type="checkbox"
              checked={kitchen}
              onChange={(e) => setKitchen(e.target.checked)}
              className="w-4 h-4 accent-primary"
            />
            {c.kitchen}
          </label>
        </div>
      </div>

      {/* Result */}
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-primary-light/40 to-white border border-primary/30 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calculator className="w-4 h-4 text-primary" aria-hidden="true" />
            {c.result}
          </div>
          <div className="text-4xl sm:text-5xl font-bold text-foreground">
            {btu.toLocaleString(
              locale === "bg" ? "bg-BG" : locale === "ru" ? "ru-RU" : locale === "ua" ? "uk-UA" : "en-GB"
            )}{" "}
            <span className="text-xl sm:text-2xl text-muted-foreground font-medium">{c.resultBtu}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground">{c.resultTier}</div>
              <div className="font-semibold text-foreground">{tier.label}</div>
            </div>
            <div>
              <div className="text-muted-foreground">{c.resultPower}</div>
              <div className="font-semibold text-foreground">{tier.kw} kW</div>
            </div>
            <div>
              <div className="text-muted-foreground">{c.resultPriceFrom}</div>
              <div className="font-semibold text-foreground">{tier.installEur} €</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Link
              href={`/${locale}/klimatici`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark transition"
            >
              {c.ctaBrowse}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={`/${locale}/montazh`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-primary/40 text-foreground text-sm font-medium rounded-xl hover:bg-primary-light/40 transition"
            >
              {c.ctaMontazh}
            </Link>
          </div>
        </div>

        <div className="bg-white border border-border/60 rounded-2xl p-5">
          <div className="text-sm font-semibold text-foreground mb-2">{c.detailsTitle}</div>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">{c.detailsBase}</p>
          {adjustments.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-foreground mb-1">{c.detailsAdj}</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {adjustments.map((a, i) => (
                  <li key={i}>• {a.label}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">{c.noteTitle}.</span> {c.noteText}
          </div>
        </div>
      </div>
    </div>
  );
}
