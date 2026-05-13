import {
  Sparkles,
  Zap,
  Snowflake,
  Sun,
  Wifi,
  Volume2,
  Leaf,
  Wind,
  ShieldCheck,
  Award,
  Filter,
  Gauge,
} from "lucide-react";

type Locale = "bg" | "en" | "ru" | "ua";

interface FeatureItem {
  name: string;
  value: string;
}
interface FeatureGroup {
  name: string;
  items: FeatureItem[];
}

interface Product {
  title: string;
  energy_class?: string | null;
  noise_db_indoor?: number | null;
  refrigerant?: string | null;
  features?: Record<string, FeatureGroup> | null;
}

interface ProductBenefitsProps {
  locale: string;
  product: Product;
}

type BenefitKey =
  | "inverter"
  | "energy_top"
  | "wifi"
  | "silent"
  | "eco_r32"
  | "cold_heat"
  | "self_clean"
  | "ionizer"
  | "pm25_filter"
  | "warranty";

const STRINGS: Record<Locale, {
  title: string;
  subtitle: string;
  benefits: Record<BenefitKey, { title: string; desc: string }>;
}> = {
  bg: {
    title: "Защо да изберете този климатик",
    subtitle: "Ключови предимства, които правят разликата",
    benefits: {
      inverter: { title: "Инверторна технология", desc: "Плавно регулиране на мощността — до 30 % по-малко ток" },
      energy_top: { title: "Енергиен клас A++/A+++", desc: "Минимални месечни сметки за ток" },
      wifi: { title: "Wi-Fi управление", desc: "Включвайте от телефона си отвсякъде" },
      silent: { title: "Тиха работа", desc: "Подходящ за спалня и офис — няма да ви пречи" },
      eco_r32: { title: "Екохладилен агент R-32", desc: "По-нисък въглероден отпечатък, по-висока ефективност" },
      cold_heat: { title: "Отопление до -25 °C", desc: "Работи дори в най-студените зимни дни" },
      self_clean: { title: "Самопочистване", desc: "Автоматично подсушаване на изпарителя — без мирис" },
      ionizer: { title: "Йонизатор / плазма", desc: "Освежава въздуха и неутрализира бактерии" },
      pm25_filter: { title: "Филтър PM2.5", desc: "Задържа фини частици и алергени" },
      warranty: { title: "Гаранция", desc: "Официален дилър — гаранцията се обслужва от нас" },
    },
  },
  en: {
    title: "Why choose this AC",
    subtitle: "Key advantages that make the difference",
    benefits: {
      inverter: { title: "Inverter technology", desc: "Smooth power modulation — up to 30 % less energy" },
      energy_top: { title: "Energy class A++/A+++", desc: "Lowest possible monthly electricity bills" },
      wifi: { title: "Wi-Fi control", desc: "Turn it on from your phone anywhere" },
      silent: { title: "Quiet operation", desc: "Bedroom and office friendly — won't disturb you" },
      eco_r32: { title: "Eco refrigerant R-32", desc: "Lower carbon footprint, higher efficiency" },
      cold_heat: { title: "Heating down to -25 °C", desc: "Works even in the coldest winter days" },
      self_clean: { title: "Self-cleaning", desc: "Auto-dries the evaporator — no smell" },
      ionizer: { title: "Ionizer / plasma", desc: "Freshens the air and neutralises bacteria" },
      pm25_filter: { title: "PM2.5 filter", desc: "Captures fine particles and allergens" },
      warranty: { title: "Manufacturer warranty", desc: "Authorised dealer — warranty handled by us" },
    },
  },
  ru: {
    title: "Почему стоит выбрать этот кондиционер",
    subtitle: "Ключевые преимущества, которые имеют значение",
    benefits: {
      inverter: { title: "Инверторная технология", desc: "Плавная регулировка мощности — до 30 % меньше потребление" },
      energy_top: { title: "Энергокласс A++/A+++", desc: "Минимальные ежемесячные счета за электричество" },
      wifi: { title: "Wi-Fi управление", desc: "Включайте с телефона из любой точки" },
      silent: { title: "Тихая работа", desc: "Подходит для спальни и офиса — не помешает" },
      eco_r32: { title: "Эко-хладагент R-32", desc: "Ниже углеродный след, выше эффективность" },
      cold_heat: { title: "Обогрев до -25 °C", desc: "Работает даже в самые холодные зимние дни" },
      self_clean: { title: "Самоочистка", desc: "Автосушка испарителя — без запаха" },
      ionizer: { title: "Ионизатор / плазма", desc: "Освежает воздух и нейтрализует бактерии" },
      pm25_filter: { title: "Фильтр PM2.5", desc: "Задерживает мелкие частицы и аллергены" },
      warranty: { title: "Гарантия", desc: "Официальный дилер — гарантию обслуживаем сами" },
    },
  },
  ua: {
    title: "Чому варто обрати цей кондиціонер",
    subtitle: "Ключові переваги, які мають значення",
    benefits: {
      inverter: { title: "Інверторна технологія", desc: "Плавне регулювання потужності — до 30 % менше споживання" },
      energy_top: { title: "Енергоклас A++/A+++", desc: "Мінімальні щомісячні рахунки за електрику" },
      wifi: { title: "Wi-Fi керування", desc: "Вмикайте з телефона з будь-якого місця" },
      silent: { title: "Тиха робота", desc: "Підходить для спальні та офісу — не заважає" },
      eco_r32: { title: "Еко-холодагент R-32", desc: "Менший вуглецевий слід, вища ефективність" },
      cold_heat: { title: "Обігрів до -25 °C", desc: "Працює навіть у найхолодніші зимові дні" },
      self_clean: { title: "Самоочистка", desc: "Авто-сушіння випарника — без запаху" },
      ionizer: { title: "Іонізатор / плазма", desc: "Освіжає повітря та нейтралізує бактерії" },
      pm25_filter: { title: "Фільтр PM2.5", desc: "Затримує дрібні частинки й алергени" },
      warranty: { title: "Гарантія", desc: "Офіційний дилер — гарантію обслуговуємо самі" },
    },
  },
};

const ICONS: Record<BenefitKey, React.ComponentType<{ className?: string }>> = {
  inverter: Gauge,
  energy_top: Leaf,
  wifi: Wifi,
  silent: Volume2,
  eco_r32: Wind,
  cold_heat: Snowflake,
  self_clean: Sparkles,
  ionizer: Zap,
  pm25_filter: Filter,
  warranty: ShieldCheck,
};

function flattenFeatureText(features?: Record<string, FeatureGroup> | null): string {
  if (!features) return "";
  const parts: string[] = [];
  for (const group of Object.values(features)) {
    parts.push((group.name || "").toLowerCase());
    for (const item of group.items || []) {
      parts.push(`${item.name} ${item.value}`.toLowerCase());
    }
  }
  return parts.join(" | ");
}

function detectBenefits(product: Product): BenefitKey[] {
  const titleLower = (product.title || "").toLowerCase();
  const featureText = flattenFeatureText(product.features);
  const blob = `${titleLower} ${featureText}`;

  const detected: BenefitKey[] = [];

  // Inverter
  if (blob.includes("инверторен") || blob.includes("инвертор") || blob.includes("inverter") || blob.includes("інвертор")) {
    detected.push("inverter");
  }

  // Energy class A++ or A+++
  const ec = (product.energy_class || "").toUpperCase().replace(/\s/g, "");
  if (ec.includes("A+++") || ec.includes("A++")) {
    detected.push("energy_top");
  }

  // WiFi
  if (blob.includes("wi-fi") || blob.includes("wifi")) {
    detected.push("wifi");
  }

  // Silent — title or noise <= 22 dB
  const silentTitle = blob.includes("silent") || blob.includes("тих") || blob.includes("безшум");
  if (silentTitle || (product.noise_db_indoor && product.noise_db_indoor <= 22)) {
    detected.push("silent");
  }

  // R-32
  if (product.refrigerant?.trim() === "R-32" || blob.includes("r-32") || blob.includes("r32")) {
    detected.push("eco_r32");
  }

  // Cold-climate heating
  if (
    titleLower.includes("nordic") ||
    titleLower.includes("норд") ||
    titleLower.includes("north") ||
    titleLower.includes("arctic") ||
    titleLower.includes("арктик") ||
    titleLower.includes("-25") ||
    titleLower.includes("-30")
  ) {
    detected.push("cold_heat");
  } else if (product.features) {
    // Check min operating temperature in features
    for (const group of Object.values(product.features)) {
      for (const item of group.items || []) {
        const combined = `${item.name} ${item.value}`.toLowerCase();
        const isOpRange =
          combined.includes("работна температура") ||
          combined.includes("рабочая температура") ||
          combined.includes("operating temperature") ||
          combined.includes("робоча температура") ||
          combined.includes("отопление") ||
          combined.includes("heating");
        if (isOpRange) {
          const m = item.value.match(/-(\d{2,3})/);
          if (m && parseInt(m[1], 10) >= 20) {
            detected.push("cold_heat");
            break;
          }
        }
      }
      if (detected.includes("cold_heat")) break;
    }
  }

  // Self-clean
  if (
    blob.includes("самопочист") ||
    blob.includes("самоочистк") ||
    blob.includes("самоочищ") ||
    blob.includes("self-clean") ||
    blob.includes("self clean")
  ) {
    detected.push("self_clean");
  }

  // Ionizer / plasma
  if (
    blob.includes("йонизатор") ||
    blob.includes("ионизатор") ||
    blob.includes("іонізатор") ||
    blob.includes("ionizer") ||
    blob.includes("plasma") ||
    blob.includes("плазма")
  ) {
    detected.push("ionizer");
  }

  // PM2.5 / fine particle filter
  if (
    blob.includes("pm2.5") ||
    blob.includes("pm 2.5") ||
    blob.includes("pm25") ||
    blob.includes("hepa") ||
    blob.includes("фин филт") ||
    blob.includes("тонк фильтр")
  ) {
    detected.push("pm25_filter");
  }

  // Warranty — always show as a closing benefit
  detected.push("warranty");

  // Dedupe while preserving order
  return Array.from(new Set(detected));
}

export default function ProductBenefits({ locale, product }: ProductBenefitsProps) {
  const t = STRINGS[(locale as Locale) in STRINGS ? (locale as Locale) : "bg"];
  const keys = detectBenefits(product).slice(0, 6);

  if (keys.length < 2) return null;

  return (
    <section>
      <h2 className="flex items-center gap-2.5 text-base sm:text-lg font-bold text-foreground mb-1.5">
        <div className="w-8 h-8 bg-primary-light/60 rounded-lg flex items-center justify-center">
          <Award className="w-4 h-4 text-primary" aria-hidden="true" />
        </div>
        {t.title}
      </h2>
      <p className="text-sm text-muted-foreground mb-4 ml-[42px]">{t.subtitle}</p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {keys.map((key) => {
          const Icon = ICONS[key];
          const b = t.benefits[key];
          return (
            <li
              key={key}
              className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-border/80 hover:border-primary/30 transition-colors"
            >
              <div className="w-9 h-9 shrink-0 rounded-lg bg-primary-light/60 flex items-center justify-center">
                <Icon className="w-[18px] h-[18px] text-primary" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground leading-tight mb-0.5">
                  {b.title}
                </div>
                <div className="text-xs text-muted-foreground leading-snug">{b.desc}</div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
