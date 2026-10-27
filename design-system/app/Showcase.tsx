"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
/* Static showroom assets are served directly, without an image optimization server. */
/* eslint-disable @next/next/no-img-element */
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  CircleHelp,
  Copy,
  Download,
  Grid2X2,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Snowflake,
  Sun,
  Trash2,
  Wind,
  Wrench,
  X,
} from "lucide-react";
import { Badge, Brand, Button, Field, ProductCard } from "../ui/components";
import { products, price } from "../data/products";

const navigation = [
  ["overview", "Направление"],
  ["colours", "Цвет и характер"],
  ["type", "Типографика"],
  ["components", "Элементы"],
  ["storefront", "Торговый интерфейс"],
  ["forms", "Формы и обратная связь"],
  ["rules", "Правила применения"],
];
const colours = [
  {
    name: "Фирменный синий",
    value: "#0866D9",
    token: "blue",
    use: "Главное действие, ссылки",
    dark: true,
  },
  {
    name: "Графит",
    value: "#172536",
    token: "ink",
    use: "Заголовки и основной текст",
    dark: true,
  },
  {
    name: "Тёплый акцент",
    value: "#F47732",
    token: "orange",
    use: "Детали и акценты бренда",
    dark: false,
  },
  {
    name: "Белый",
    value: "#FFFFFF",
    token: "paper",
    use: "Товары и рабочие поверхности",
    dark: false,
  },
  {
    name: "Светлый фон",
    value: "#F5F7FA",
    token: "canvas",
    use: "Разделение и группировка",
    dark: false,
  },
  {
    name: "Тихий синий",
    value: "#EDF4FF",
    token: "blue-soft",
    use: "Выбранное и подсказки",
    dark: false,
  },
];

function SectionHeading({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="ds-section-heading">
      <span className="ds-section-number">{number}</span>
      <div>
        <h2>{title}</h2>
        <p>{children}</p>
      </div>
    </div>
  );
}

export default function Showcase() {
  const [active, setActive] = useState("overview");
  const [toast, setToast] = useState("");
  const [query, setQuery] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [installation, setInstallation] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [formDone, setFormDone] = useState(false);
  const cartDialog = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-15% 0px -65% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  async function copyColour(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast(`${value} скопирован`);
    } catch {
      setToast(`Цвет: ${value}. Можно скопировать из подписи.`);
    }
  }
  function downloadTokens() {
    const style = getComputedStyle(document.body);
    const names = [
      "blue",
      "blue-hover",
      "blue-soft",
      "ink",
      "muted",
      "paper",
      "canvas",
      "border",
      "input-border",
      "orange",
      "orange-ink",
      "orange-soft",
      "success",
      "success-soft",
      "warning",
      "warning-soft",
      "danger",
      "danger-soft",
      "font",
      "font-xs",
      "font-sm",
      "font-md",
      "font-lg",
      "font-xl",
      "font-2xl",
      "font-display",
      "space-1",
      "space-2",
      "space-3",
      "space-4",
      "space-6",
      "space-8",
      "space-12",
      "space-16",
      "radius-sm",
      "radius-md",
      "radius-lg",
      "control-height",
      "transition",
      "shadow",
    ];
    const css = `/* Песнопоец Клима. Design tokens v0.1. Font files are supplied separately. */\n.pc-theme {\n${names.map((name) => `  --pc-${name}: ${style.getPropertyValue(`--pc-${name}`).trim()};`).join("\n")}\n}\n`;
    const url = URL.createObjectURL(new Blob([css], { type: "text/css" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "pesnopoets-tokens-v0.1.css";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setToast("CSS-переменные экспортированы");
  }
  function addToCart(id: string) {
    if (cart.includes(id)) {
      cartDialog.current?.showModal();
      return;
    }
    setCart((items) => [...items, id]);
    setToast("Товар добавлен в демонстрационную корзину");
  }
  function toggleFavourite(id: string) {
    setFavourites((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }
  function resetFilters() {
    setQuery("");
    setCapacity(0);
    setFavouritesOnly(false);
  }
  function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalised = phone.replace(/[\s()-]/g, "");
    if (!/^(\+359\d{9}|0\d{9})$/.test(normalised)) {
      setPhoneError(
        phone.trim()
          ? "Въведете валиден номер: +359 и 9 цифри или 0 и 9 цифри."
          : "Въведете телефонния си номер.",
      );
      formRef.current?.focus();
      return;
    }
    setPhoneError("");
    setFormDone(true);
  }
  const filteredProducts = products.filter(
    (product) =>
      (!capacity || product.btu === capacity) &&
      (!favouritesOnly || favourites.includes(product.id)) &&
      `${product.brand} ${product.model} ${product.btu}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  const cartProducts = products.filter((product) => cart.includes(product.id));
  const total = cartProducts.reduce(
    (sum, product) =>
      sum + product.price + (installation ? product.installation : 0),
    0,
  );

  return (
    <>
      <a href="#content" className="ds-skip">
        Перейти к содержимому
      </a>
      <aside className="ds-sidebar" aria-label="Дизайн-система">
        <a
          href="#overview"
          className="ds-brand-link"
          aria-label="Песнопоец Клима, начало"
        >
          <Brand compact />
        </a>
        <div className="ds-sidebar-caption">
          ДИЗАЙН-СИСТЕМА <span>0.1</span>
        </div>
        <nav aria-label="Разделы дизайн-системы">
          {navigation.map(([id, label], index) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? "is-active" : ""}
              aria-current={active === id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {label}
            </a>
          ))}
        </nav>
        <div className="ds-sidebar-bottom">
          <span className="ds-status-dot" /> Первый вариант
          <br />
          <p>
            Публичный сайт
            <br />
            Болгария · BG / RU / EN / UA
          </p>
          <a
            href="https://pesnopoets-clima.com/bg"
            target="_blank"
            rel="noreferrer"
          >
            Действующий сайт <ArrowUpRight size={14} />
          </a>
        </div>
      </aside>

      <div className="ds-workspace">
        <header className="ds-topbar">
          <span>
            Песнопоец Клима <span className="ds-topbar-separator">/</span>{" "}
            <strong>Система оформления</strong>
          </span>
          <button onClick={downloadTokens}>
            <Download size={15} /> <span>Скачать токены</span>
          </button>
        </header>
        <main id="content">
          <section id="overview" className="ds-overview">
            <div className="ds-overview-meta">
              <span>ОСНОВА НОВОГО МАГАЗИНА</span>
              <span>СЕНТЯБРЬ 2026</span>
            </div>
            <div className="ds-hero">
              <div className="ds-hero-copy">
                <Badge tone="blue">Песнопоец Клима / v0.1</Badge>
                <h1>
                  Один характер.
                  <br />
                  <span>Каждый экран.</span>
                </h1>
                <p>
                  Понятный выбор техники, заметная цена и внимание к деталям.
                  Общий язык для магазина, монтажа и сервиса.
                </p>
                <Link href="/storefront" className="pc-button pc-button-primary">
                  Новый магазин · 05 <ArrowUpRight size={18} />
                </Link>
                <div className="ds-hero-note">
                  <span /> Создано для болгарского покупателя
                </div>
              </div>
              <div
                className="ds-hero-board"
                aria-label="Визуальный образ системы"
              >
                <div className="ds-board-top">
                  <span>ПРОДУКТ В ЦЕНТРЕ</span>
                  <Wind size={23} />
                </div>
                <div className="ds-board-product">
                  <img
                    src="/design-system/techpoint-nordic-12.png"
                    alt="Кондиционер TechPoint Nordic"
                    width="420"
                    height="250"
                  />
                </div>
                <div className="ds-board-bottom">
                  <div>
                    <span lang="bg">Комфортът започва с избор.</span>
                    <strong>TechPoint Nordic</strong>
                  </div>
                  <span className="ds-board-arrow">
                    <ArrowUpRight size={28} />
                  </span>
                </div>
                <div className="ds-board-swatches">
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
            <div className="ds-principles">
              <div>
                <span>01 / ЯСНОСТЬ</span>
                <h3>Сначала товар</h3>
                <p>
                  Поиск, параметры и цена помогают выбрать с первого экрана.
                </p>
              </div>
              <div>
                <span>02 / ХАРАКТЕР</span>
                <h3>Свой узнаваемый бренд</h3>
                <p>
                  Синий, тёплая деталь и реальные фотографии работы команды.
                </p>
              </div>
              <div>
                <span>03 / ПОСЛЕДОВАТЕЛЬНОСТЬ</span>
                <h3>Привычные действия</h3>
                <p>Одинаковые элементы ведут себя одинаково на всём сайте.</p>
              </div>
            </div>
          </section>

          <section id="colours" className="ds-section">
            <SectionHeading number="02" title="Цвет и характер">
              Спокойная основа, один цвет действия и тёплая деталь из
              существующего логотипа.
            </SectionHeading>
            <div className="ds-palette">
              {colours.map((colour) => (
                <button
                  className="ds-swatch"
                  key={colour.token}
                  onClick={() => copyColour(colour.value)}
                  aria-label={`Скопировать ${colour.name}: ${colour.value}`}
                >
                  <span
                    className={`ds-swatch-colour ${colour.dark ? "is-dark" : ""}`}
                    style={{ background: colour.value }}
                  >
                    <span>{colour.value}</span>
                    <Copy size={16} />
                  </span>
                  <strong>{colour.name}</strong>
                  <span className="ds-swatch-use">{colour.use}</span>
                  <code>--pc-{colour.token}</code>
                </button>
              ))}
            </div>
            <div className="ds-colour-footer">
              <div>
                <span className="ds-micro-label">ЦВЕТ СООБЩАЕТ СОСТОЯНИЕ</span>
                <div className="ds-inline">
                  <Badge tone="success">
                    <Check size={12} /> Успех
                  </Badge>
                  <Badge tone="warning">Внимание</Badge>
                  <Badge tone="danger">Ошибка</Badge>
                  <Badge tone="blue">Выбрано</Badge>
                </div>
              </div>
              <p>
                Синий ведёт к действию. Оранжевый подчёркивает бренд. Состояния
                всегда сопровождаются текстом или значком.
              </p>
            </div>
          </section>

          <section id="type" className="ds-section">
            <SectionHeading number="03" title="Типографика и ритм">
              Один шрифт с кириллицей. Размер, насыщенность и пространство
              задают иерархию.
            </SectionHeading>
            <div className="ds-type-panel">
              <div className="ds-font-intro">
                <span className="ds-micro-label">ОСНОВНОЙ ШРИФТ</span>
                <h3>Roboto</h3>
                <p>
                  Аа Бб Вв
                  <br />
                  Aa Bb Cc
                  <br />
                  0123456789
                </p>
                <div>
                  <Badge>Regular 400</Badge>
                  <Badge>Medium 500</Badge>
                  <Badge>Bold 700</Badge>
                </div>
                <small>Локальные файлы. Без внешних запросов к шрифтам.</small>
              </div>
              <div className="ds-type-specimens" lang="bg">
                <div>
                  <span>36 / 700 · Заголовок раздела</span>
                  <p className="ds-specimen-heading">Климатът у дома.</p>
                </div>
                <div>
                  <span>20 / 500 · Подзаголовок</span>
                  <p className="ds-specimen-subtitle">
                    Изберете според стаята.
                  </p>
                </div>
                <div>
                  <span>16 / 400 · Основной текст</span>
                  <p>Сравнете моделите и вижте цената с монтаж.</p>
                </div>
                <div>
                  <span>14 / 400 · Вторичный текст</span>
                  <p className="ds-specimen-small">
                    Помощ при избора на климатик
                  </p>
                </div>
                <div className="ds-price-specimen">
                  <div>
                    <span>30 / 700 · Цена</span>
                    <p>345 €</p>
                  </div>
                  <div>
                    <span>12 / 400 · Параметры</span>
                    <small>12 000 BTU · до 22 m² · 22 dB</small>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-rhythm">
              <div>
                <h3>Шаг 4 px</h3>
                <p>Отступы создают порядок.</p>
                <div className="ds-space-scale">
                  {[4, 8, 12, 16, 24, 32, 48, 64].map((space) => (
                    <div key={space}>
                      <span style={{ height: space }} />
                      <small>{space}</small>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3>Простая геометрия</h3>
                <p>Радиусы: 6 / 10 / 16 px.</p>
                <div className="ds-radius-scale">
                  {[6, 10, 16].map((radius) => (
                    <div style={{ borderRadius: radius }} key={radius}>
                      {radius}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3>Один стиль иконок</h3>
                <p>Lucide · 20 px · 1.75 px.</p>
                <div className="ds-icon-scale">
                  {[
                    Search,
                    ShoppingCart,
                    Heart,
                    Wind,
                    Snowflake,
                    Sun,
                    Wrench,
                    Phone,
                  ].map((Icon, index) => (
                    <Icon
                      size={20}
                      strokeWidth={1.75}
                      key={index}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="components" className="ds-section">
            <SectionHeading number="04" title="Элементы интерфейса">
              Размер действия 48 px. Видимый фокус с клавиатуры. Ошибка
              объясняет, что исправить.
            </SectionHeading>
            <div className="ds-component-grid">
              <div className="ds-component-panel">
                <span className="ds-micro-label">ИЕРАРХИЯ ДЕЙСТВИЙ</span>
                <div className="ds-button-demo" lang="bg">
                  <Button
                    onClick={() =>
                      setToast(
                        "Главная кнопка: одно приоритетное действие в блоке",
                      )
                    }
                  >
                    Към каталога <ArrowRight size={18} />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setToast("Вторичная кнопка: дополнительное действие")
                    }
                  >
                    Сравни моделите
                  </Button>
                  <Button
                    variant="quiet"
                    onClick={() =>
                      setToast(
                        "Текстовая кнопка: действие с меньшим визуальным весом",
                      )
                    }
                  >
                    Виж повече <ArrowRight size={16} />
                  </Button>
                </div>
                <div className="ds-component-caption">
                  Главное · Вторичное · Текстовое
                </div>
                <div className="ds-button-states" lang="bg">
                  <div>
                    <Button disabled>Недостъпно</Button>
                    <small>Disabled</small>
                  </div>
                  <div>
                    <Button loading>Зареждане</Button>
                    <small>Loading</small>
                  </div>
                </div>
              </div>
              <div className="ds-component-panel">
                <span className="ds-micro-label">ПОЛЯ И ВЫБОР</span>
                <div lang="bg" className="ds-field-examples">
                  <Field
                    label="Търсене по модел"
                    placeholder="Например: TechPoint Nordic"
                  />
                  <Field
                    label="Телефон"
                    value="+359 88"
                    readOnly
                    error="Въведете пълния телефонен номер."
                  />
                  <label className="ds-check">
                    <input type="checkbox" defaultChecked />
                    <span>Добави стандартен монтаж</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="ds-accessibility-note">
              <CheckCheck size={20} />
              <span>
                <strong>Доступность входит в систему.</strong> Контраст, подписи
                полей, управление с клавиатуры и уменьшение анимации
                предусмотрены в компонентах.
              </span>
              <kbd>Tab</kbd>
            </div>
          </section>

          <section id="storefront" className="ds-section ds-store-section">
            <SectionHeading number="05" title="Система в торговом интерфейсе">
              Шапка и товарная полка. Поиск, фильтры, избранное и
              демонстрационная корзина работают.
            </SectionHeading>
            <div className="ds-demo-notice">
              <CircleHelp size={16} />
              <span>
                Демонстрация. Данные с сайта на 27.09.2026, цены округлены.
                Действия локальные, заказ не оформляется.
              </span>
            </div>
            <div className="ds-store" lang="bg">
              <div className="ds-store-top">
                <span>
                  <MapPin size={13} /> Варна
                </span>
                <a href="#forms">
                  Помощ при избора <ArrowUpRight size={13} />
                </a>
              </div>
              <div className="ds-store-header">
                <Brand compact />
                <div className="ds-catalogue-wrap">
                  <Button
                    aria-label="Каталог"
                    aria-expanded={catalogueOpen}
                    aria-controls="demo-catalogue"
                    onClick={() => setCatalogueOpen((open) => !open)}
                  >
                    <Menu size={19} />
                    <span>Каталог</span>
                  </Button>
                  {catalogueOpen && (
                    <div id="demo-catalogue" className="ds-catalogue-menu">
                      <strong>Климатици</strong>
                      {[
                        [0, "Всички модели"],
                        [9000, "9 000 BTU"],
                        [12000, "12 000 BTU"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          onClick={() => {
                            setCapacity(Number(value));
                            setCatalogueOpen(false);
                            setQuery("");
                          }}
                        >
                          {label}
                          <ArrowRight size={15} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="ds-search">
                  <Search size={19} aria-hidden="true" />
                  <input
                    aria-label="Търсене в демонстрационния каталог"
                    placeholder="Марка, модел или BTU"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  {query && (
                    <button
                      aria-label="Изчисти търсенето"
                      onClick={() => setQuery("")}
                    >
                      <X size={17} />
                    </button>
                  )}
                </div>
                <button
                  className="ds-store-action"
                  aria-label={`Любими: ${favourites.length}`}
                  aria-pressed={favouritesOnly}
                  onClick={() => setFavouritesOnly((value) => !value)}
                >
                  <Heart
                    size={22}
                    fill={favouritesOnly ? "currentColor" : "none"}
                  />
                  <span>Любими</span>
                  {favourites.length > 0 && <b>{favourites.length}</b>}
                </button>
                <button
                  className="ds-store-action"
                  aria-label={`Отвори количката: ${cart.length} продукта`}
                  onClick={() => cartDialog.current?.showModal()}
                >
                  <ShoppingCart size={22} />
                  <span>Количка</span>
                  <b>{cart.length}</b>
                </button>
              </div>
              <div className="ds-store-navigation">
                <span>
                  <Snowflake size={16} /> Климатици
                </span>
                <a href="#service-example">Монтаж</a>
                <a href="#forms">Консултация</a>
                <span className="ds-store-navigation-note">
                  Техника и монтаж на едно място
                </span>
              </div>
              <div className="ds-store-content">
                <div className="ds-shelf-heading">
                  <div>
                    <span className="ds-micro-label">КЛИМАТИЦИ ЗА ДОМА</span>
                    <h3>
                      {favouritesOnly
                        ? "Вашите любими модели"
                        : "Намерете своя климатик"}
                    </h3>
                  </div>
                  <span className="ds-result-count" aria-live="polite">
                    {filteredProducts.length} модела
                  </span>
                </div>
                <div className="ds-shelf-tools">
                  <div className="ds-segments" aria-label="Филтър по мощност">
                    {[
                      [0, "Всички"],
                      [9000, "9 000 BTU"],
                      [12000, "12 000 BTU"],
                    ].map(([value, label]) => (
                      <button
                        key={value}
                        aria-pressed={capacity === value}
                        onClick={() => setCapacity(Number(value))}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <label className="ds-switch">
                    <input
                      type="checkbox"
                      role="switch"
                      checked={installation}
                      onChange={(event) =>
                        setInstallation(event.target.checked)
                      }
                    />
                    <span className="ds-switch-track" aria-hidden="true" />
                    <span>Цена с монтаж</span>
                  </label>
                </div>
                <div className="ds-products">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      withInstallation={installation}
                      favourite={favourites.includes(product.id)}
                      selected={cart.includes(product.id)}
                      onAdd={() => addToCart(product.id)}
                      onFavourite={() => toggleFavourite(product.id)}
                    />
                  ))}
                </div>
                {filteredProducts.length === 0 && (
                  <div className="ds-empty">
                    <Search size={32} />
                    <h4>
                      {favouritesOnly
                        ? "Няма избрани модели"
                        : "Няма намерени модели"}
                    </h4>
                    <p>
                      {favouritesOnly
                        ? "Добавете модел със сърцето върху картата."
                        : "Опитайте с друга марка или премахнете филтъра."}
                    </p>
                    <Button variant="secondary" onClick={resetFilters}>
                      Покажи всички
                    </Button>
                  </div>
                )}
                <div id="service-example" className="ds-service">
                  <div className="ds-service-copy">
                    <span className="ds-micro-label">ТЕХНИКА + МОНТАЖ</span>
                    <h3>
                      Добрият избор
                      <br />
                      продължава с монтажа.
                    </h3>
                    <p>
                      Вижте какво включва стандартният монтаж и обсъдете
                      особеностите на вашето помещение.
                    </p>
                    <a
                      className="pc-button pc-button-secondary"
                      href="https://pesnopoets-clima.com/bg/montazh"
                      target="_blank"
                      rel="noreferrer"
                    >
                      За монтажа <ArrowUpRight size={17} />
                    </a>
                  </div>
                  <div className="ds-service-photo">
                    <img
                      src="/portfolio/01-hero-install-wood-wall.jpg"
                      alt="Монтиран климатик Gree върху дървена стена, снимка от портфолиото на Песнопоец Клима"
                      width="600"
                      height="800"
                    />
                    <span>
                      <Wrench size={14} /> От нашето портфолио
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ds-anatomy">
              <span>
                <b>01</b> Товар и параметры
              </span>
              <span>
                <b>02</b> Цена и состав предложения
              </span>
              <span>
                <b>03</b> Одно главное действие
              </span>
            </div>
          </section>

          <section id="forms" className="ds-section">
            <SectionHeading number="06" title="Помощь без лишних шагов">
              Одно поле, ясная ошибка и отдельное подтверждение. Проверка
              происходит на этой странице.
            </SectionHeading>
            <div className="ds-form-layout">
              <div className="ds-form-story">
                <span className="ds-micro-label">ФОРМА КОНСУЛЬТАЦИИ</span>
                <h3>
                  Коротко. <br />
                  По делу. <br />
                  <span>По-человечески.</span>
                </h3>
                <p>
                  Подпись остаётся над полем. Подсказка показывает формат. После
                  действия интерфейс объясняет результат.
                </p>
                <div className="ds-inline">
                  <Badge>Default</Badge>
                  <Badge tone="danger">Error</Badge>
                  <Badge tone="success">Success</Badge>
                </div>
              </div>
              <div className="ds-form-card" lang="bg">
                {formDone ? (
                  <div className="ds-form-success" role="status">
                    <span>
                      <Check size={32} />
                    </span>
                    <h3>Номерът е валиден.</h3>
                    <p>
                      Това е демонстрация на успешно състояние. Заявка не е
                      изпратена и няма да получите обаждане.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setFormDone(false);
                        setPhone("");
                      }}
                    >
                      Опитай отново
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submitForm} noValidate>
                    <span className="ds-form-icon">
                      <Phone size={22} />
                    </span>
                    <h3>Нуждаете се от помощ?</h3>
                    <p>Пробвайте формата за консултация.</p>
                    <div
                      className={`pc-field ${phoneError ? "pc-field-error" : ""}`}
                    >
                      <label htmlFor="demo-phone">Вашият телефон</label>
                      <input
                        ref={formRef}
                        id="demo-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="off"
                        placeholder="+359 88 123 4567"
                        value={phone}
                        onChange={(event) => {
                          setPhone(event.target.value);
                          if (phoneError) setPhoneError("");
                        }}
                        aria-invalid={!!phoneError}
                        aria-describedby="demo-phone-help"
                      />
                      <span
                        id="demo-phone-help"
                        className="pc-field-help"
                        aria-live="polite"
                      >
                        {phoneError || "Български номер с +359 или начална 0."}
                      </span>
                    </div>
                    <Button type="submit">
                      Провери формата <ArrowRight size={18} />
                    </Button>
                    <p className="ds-form-disclaimer">
                      Само демонстрация. Номерът не се изпраща и не се запазва.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </section>

          <section id="rules" className="ds-section">
            <SectionHeading number="07" title="Как применять систему">
              Начинаем с главной. Проверяем поведение и переносим общие элементы
              на остальные страницы.
            </SectionHeading>
            <div className="ds-rules-grid">
              <div>
                <Grid2X2 size={22} />
                <h3>Одна основа для экранов</h3>
                <p>
                  Главная, каталог, товар, монтаж и оформление используют общие
                  цвета, размеры и состояния.
                </p>
              </div>
              <div>
                <SlidersHorizontal size={22} />
                <h3>Контент управляет формой</h3>
                <p>
                  Длинные названия, нет фото, нет в наличии, цена по запросу:
                  каждое состояние получает свой вариант.
                </p>
              </div>
              <div>
                <CheckCheck size={22} />
                <h3>Проверяем на телефоне</h3>
                <p>
                  Поиск виден, кнопки удобны для нажатия, цена и монтаж читаются
                  без горизонтальной прокрутки.
                </p>
              </div>
            </div>
            <div className="ds-next-step">
              <div>
                <Badge tone="blue">Следующий шаг</Badge>
                <h3>Собрать главную на этой основе</h3>
                <p>
                  Шапка, промозона, быстрый выбор и первая товарная подборка.
                </p>
              </div>
              <a href="#storefront" className="pc-button pc-button-secondary">
                К примеру магазина <ArrowUpRight size={18} />
              </a>
            </div>
            <p className="ds-scope-note">
              Версия 0.1 задаёт визуальное направление и базовые компоненты.
              Полный каталог, оформление заказа, коммерческие условия и все
              языковые версии развиваются на следующих этапах.
            </p>
          </section>
          <footer className="ds-footer">
            <Brand compact />
            <span>Дизайн-система 0.1 · Рабочий вариант</span>
            <a href="#overview">Наверх ↑</a>
          </footer>
        </main>
      </div>
      <div
        className={`ds-toast ${toast ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && <Check size={17} />}
        {toast}
      </div>
      <dialog
        ref={cartDialog}
        className="ds-cart-dialog"
        aria-labelledby="cart-heading"
        lang="bg"
      >
        <div className="ds-cart-top">
          <h2 id="cart-heading">
            Вашата количка <span>{cart.length}</span>
          </h2>
          <button
            className="pc-icon-button"
            aria-label="Затвори количката"
            onClick={() => cartDialog.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <p className="ds-cart-demo">
          Демонстрация. Няма да бъде създадена поръчка.
        </p>
        {cartProducts.length ? (
          <>
            <div className="ds-cart-items">
              {cartProducts.map((product) => (
                <div className="ds-cart-item" key={product.id}>
                  <img src={product.image} alt="" width="80" height="70" />
                  <div>
                    <strong>
                      {product.brand} {product.model}
                    </strong>
                    <span>
                      {installation ? "Със стандартен монтаж" : "Без монтаж"}
                    </span>
                    <b>
                      {price(
                        product.price +
                          (installation ? product.installation : 0),
                      )}
                    </b>
                  </div>
                  <button
                    className="pc-icon-button"
                    aria-label={`Премахни ${product.model}`}
                    onClick={() =>
                      setCart((items) =>
                        items.filter((id) => id !== product.id),
                      )
                    }
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
            <div className="ds-cart-total">
              <span>Общо</span>
              <strong>{price(total)}</strong>
            </div>
            <Button onClick={() => cartDialog.current?.close()}>
              Продължи разглеждането <ArrowRight size={18} />
            </Button>
          </>
        ) : (
          <div className="ds-empty">
            <ShoppingCart size={38} />
            <h3>Количката е празна</h3>
            <p>Добавете модел от демонстрационния каталог.</p>
            <Button onClick={() => cartDialog.current?.close()}>
              Към моделите
            </Button>
          </div>
        )}
      </dialog>
    </>
  );
}
