import { Shield, Truck, Wrench, Award } from "lucide-react";

const content: Record<string, {
  title: string;
  subtitle: string;
  teamParagraph: string;
  stats: Array<{ value: string; label: string }>;
  values: Array<{ title: string; desc: string }>;
}> = {
  bg: {
    title: "За нас",
    subtitle: "Песнопоец Клима е официален дилър на водещи марки климатици в България. Предлагаме пълен спектър от услуги — от консултация и избор на климатик, през доставка, до професионален монтаж и гаранционно обслужване.",
    teamParagraph: "Зад Песнопоец Клима стои екип от специалисти с дългогодишен опит в климатичната техника. Нашият приоритет е да предложим на всеки клиент решение, съобразено с неговото помещение и бюджет — честно, професионално и без излишен натиск.",
    stats: [
      { value: "500+", label: "монтажа" },
      { value: "8+", label: "години опит" },
      { value: "10+", label: "марки" },
      { value: "4.9/5", label: "оценка" },
    ],
    values: [
      { title: "Оригинални продукти", desc: "Работим директно с производителите. Всички продукти са с пълна гаранция." },
      { title: "Доставка в цяла България", desc: "Бърза доставка до вашия адрес. Наличност в реално време." },
      { title: "Професионален монтаж", desc: "Монтаж от сертифицирани специалисти с дългогодишен опит." },
      { title: "Следпродажбено обслужване", desc: "Гаранционен и извънгаранционен сервиз. Винаги на линия." },
    ],
  },
  en: {
    title: "About Us",
    subtitle: "Pesnopoets Clima is an authorized dealer of leading air conditioning brands in Bulgaria. We offer a full range of services — from consultation and selection, through delivery, to professional installation and warranty service.",
    teamParagraph: "Behind Pesnopoets Clima is a team of specialists with years of experience in HVAC systems. Our priority is to offer every client a solution tailored to their space and budget — honestly, professionally, and without pressure.",
    stats: [
      { value: "500+", label: "installations" },
      { value: "8+", label: "years experience" },
      { value: "10+", label: "brands" },
      { value: "4.9/5", label: "rating" },
    ],
    values: [
      { title: "Original Products", desc: "We work directly with manufacturers. All products come with full warranty." },
      { title: "Delivery Across Bulgaria", desc: "Fast delivery to your address. Real-time availability." },
      { title: "Professional Installation", desc: "Installation by certified specialists with years of experience." },
      { title: "After-Sales Service", desc: "Warranty and out-of-warranty service. Always available." },
    ],
  },
  ru: {
    title: "О нас",
    subtitle: "Песнопоец Клима — официальный дилер ведущих брендов кондиционеров в Болгарии. Мы предлагаем полный спектр услуг — от консультации и выбора кондиционера до доставки, профессионального монтажа и гарантийного обслуживания.",
    teamParagraph: "За Песнопоец Клима стоит команда специалистов с многолетним опытом в климатической технике. Наш приоритет — предложить каждому клиенту решение, подобранное под его помещение и бюджет — честно, профессионально и без давления.",
    stats: [
      { value: "500+", label: "монтажей" },
      { value: "8+", label: "лет опыта" },
      { value: "10+", label: "брендов" },
      { value: "4.9/5", label: "оценка" },
    ],
    values: [
      { title: "Оригинальная продукция", desc: "Работаем напрямую с производителями. Все товары с полной гарантией." },
      { title: "Доставка по всей Болгарии", desc: "Быстрая доставка по вашему адресу. Наличие в реальном времени." },
      { title: "Профессиональный монтаж", desc: "Монтаж сертифицированными специалистами с многолетним опытом." },
      { title: "Сервисное обслуживание", desc: "Гарантийный и послегарантийный сервис. Всегда на связи." },
    ],
  },
  ua: {
    title: "Про нас",
    subtitle: "Піснопоєць Кліма — офіційний дилер провідних брендів кондиціонерів у Болгарії. Ми пропонуємо повний спектр послуг — від консультації та вибору кондиціонера до доставки, професійного монтажу та гарантійного обслуговування.",
    teamParagraph: "За Піснопоєць Кліма стоїть команда фахівців з багаторічним досвідом у кліматичній техніці. Наш пріоритет — запропонувати кожному клієнту рішення, підібране під його приміщення та бюджет — чесно, професійно і без тиску.",
    stats: [
      { value: "500+", label: "монтажів" },
      { value: "8+", label: "років досвіду" },
      { value: "10+", label: "брендів" },
      { value: "4.9/5", label: "оцінка" },
    ],
    values: [
      { title: "Оригінальна продукція", desc: "Працюємо напряму з виробниками. Уся продукція з повною гарантією." },
      { title: "Доставка по всій Болгарії", desc: "Швидка доставка за вашою адресою. Наявність у реальному часі." },
      { title: "Професійний монтаж", desc: "Монтаж сертифікованими фахівцями з багаторічним досвідом." },
      { title: "Сервісне обслуговування", desc: "Гарантійний та післягарантійний сервіс. Завжди на зв'язку." },
    ],
  },
};

const icons = [Shield, Truck, Wrench, Award];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const c = content[locale] || content.bg;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">{c.title}</h1>
      <p className="text-lg text-muted-foreground leading-relaxed mb-8">{c.subtitle}</p>

      {/* Team paragraph */}
      <p className="text-base text-muted-foreground leading-relaxed mb-10">{c.teamParagraph}</p>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
        {c.stats.map((stat) => (
          <div key={stat.label} className="text-center p-5 bg-white border border-border/80 rounded-2xl">
            <p className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {c.values.map((val, i) => {
          const Icon = icons[i];
          return (
            <div key={val.title} className="p-6 bg-white border border-border/80 rounded-2xl">
              <div className="w-12 h-12 bg-primary-light/60 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{val.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{val.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
