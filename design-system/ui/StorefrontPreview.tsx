"use client";

/* Local static product images intentionally bypass the Next image optimizer. */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  Volume2,
  Wind,
  Wrench,
  X,
  Scale,
} from "lucide-react";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_EMAIL,
  BUSINESS_STREET,
  BUSINESS_ADDRESS_CITY,
} from "../../lib/constants";
import { price } from "../data/products";
import {
  retailProducts,
  type RetailProduct,
} from "../data/storefront-products";
import { Brand } from "./components";

const brands = [
  { name: "Gree", image: "/brands/gree.svg" },
  { name: "Mitsubishi Heavy", image: "/brands/mitsubishi-heavy.svg" },
  { name: "TechPoint", image: "" },
  { name: "Auratsu", image: "/brands/auratsu.png" },
];
type CartLine = { id: string; installed: boolean };

export default function StorefrontPreview() {
  const [query, setQuery] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [brand, setBrand] = useState("");
  const [quiet, setQuiet] = useState(false);
  const [installed, setInstalled] = useState(true);
  const [sort, setSort] = useState("selected");
  const [favourites, setFavourites] = useState<string[]>([]);
  const [onlyFavourites, setOnlyFavourites] = useState(false);
  const [compared, setCompared] = useState<string[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [detail, setDetail] = useState<RetailProduct | null>(null);
  const [detailInstalled, setDetailInstalled] = useState(true);
  const [notice, setNotice] = useState("");
  const cartRef = useRef<HTMLDialogElement>(null);
  const detailRef = useRef<HTMLDialogElement>(null);
  const compareRef = useRef<HTMLDialogElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  useEffect(() => {
    if (!detail) return;
    detailRef.current?.showModal();
  }, [detail]);
  useEffect(() => {
    if (!catalogueOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCatalogueOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [catalogueOpen]);

  const filtered = retailProducts
    .filter(
      (product) =>
        (!capacity || product.btu === capacity) &&
        (!brand || product.brand === brand) &&
        (!quiet || (product.noise !== undefined && product.noise <= 22)) &&
        (!onlyFavourites || favourites.includes(product.id)) &&
        `${product.brand} ${product.model} ${product.series} ${product.btu}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : 0,
    );
  const total = cart.reduce((sum, line) => {
    const p = retailProducts.find((item) => item.id === line.id)!;
    return sum + p.price + (line.installed ? p.installation : 0);
  }, 0);
  const compareProducts = retailProducts.filter((product) =>
    compared.includes(product.id),
  );

  function toProducts() {
    setCatalogueOpen(false);
    document
      .getElementById("sf-products")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function resetFilters() {
    setQuery("");
    setCapacity(0);
    setBrand("");
    setQuiet(false);
    setOnlyFavourites(false);
  }
  function selectCapacity(value: number) {
    resetFilters();
    setCapacity(value);
    toProducts();
  }
  function selectBrand(value: string) {
    resetFilters();
    setBrand(value);
    toProducts();
  }
  function openDetail(product: RetailProduct) {
    setDetailInstalled(installed);
    setDetail(product);
  }
  function addToCart(product: RetailProduct, withInstallation: boolean) {
    const exists = cart.some((line) => line.id === product.id);
    setCart((lines) => [
      ...lines.filter((line) => line.id !== product.id),
      { id: product.id, installed: withInstallation },
    ]);
    setNotice(
      `${product.brand} ${product.series}: ${exists ? "количката е обновена" : "добавен в количката"}`,
    );
  }
  function favourite(id: string) {
    setFavourites((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }
  function compare(id: string) {
    if (compared.includes(id))
      setCompared((items) => items.filter((item) => item !== id));
    else if (compared.length < 3) setCompared((items) => [...items, id]);
    else
      setNotice(
        "Можете да сравните до 3 модела. Премахнете един, за да добавите друг.",
      );
  }

  return (
    <div className="sf" lang="bg" id="sf-top">
      <div className="sf-preview">
        <div className="sf-wrap">
          <span>
            ПРЕГЛЕД НА НОВИЯ МАГАЗИН <b>03</b>
          </span>
          <span>Примерни цени към 27.09.2026</span>
          <Link href="/">
            Дизайн система <ArrowRight size={13} />
          </Link>
        </div>
      </div>
      <a href="#sf-products" className="sf-skip">
        Към продуктите
      </a>
      <div className="sf-utility">
        <div className="sf-wrap">
          <span>
            <MapPin size={14} /> Варна и региона
          </span>
          <nav aria-label="Информация">
            <a href="#sf-install">Монтаж</a>
            <a href="#sf-questions">Помощ при избора</a>
            <a href="#sf-contacts">Контакти</a>
          </nav>
          <a href={`tel:${BUSINESS_PHONE_TEL}`}>
            <Phone size={14} /> {BUSINESS_PHONE_DISPLAY}
          </a>
        </div>
      </div>
      <header className="sf-header">
        <div className="sf-wrap sf-header-main">
          <a
            href="#sf-top"
            className="sf-logo"
            aria-label="Песнопоец Клима, начало"
          >
            <Brand />
          </a>
          <form
            className="sf-search"
            role="search"
            onSubmit={(event) => {
              event.preventDefault();
              toProducts();
            }}
          >
            <label className="sf-sr" htmlFor="sf-search">
              Търси климатик
            </label>
            <input
              id="sf-search"
              type="search"
              placeholder="Търси по марка, модел или BTU"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit" aria-label="Търси">
              <Search size={22} />
            </button>
          </form>
          <div className="sf-header-actions">
            <button
              className={
                onlyFavourites ? "sf-icon-action is-active" : "sf-icon-action"
              }
              onClick={() => {
                resetFilters();
                setOnlyFavourites(true);
                toProducts();
              }}
              aria-label={`Любими: ${favourites.length}`}
            >
              <Heart size={23} />
              <span>Любими</span>
              {favourites.length > 0 && <b>{favourites.length}</b>}
            </button>
            <button
              className="sf-icon-action"
              onClick={() => cartRef.current?.showModal()}
              aria-label={`Количка: ${cart.length}`}
            >
              <ShoppingCart size={23} />
              <span>Количка</span>
              {cart.length > 0 && <b>{cart.length}</b>}
            </button>
          </div>
        </div>
      </header>
      <nav className="sf-main-nav" aria-label="Каталог и услуги">
        <div className="sf-wrap">
          <button
            className="sf-catalogue-toggle"
            aria-expanded={catalogueOpen}
            aria-controls="sf-catalogue"
            ref={menuButton}
            onClick={() => setCatalogueOpen((value) => !value)}
          >
            <Menu size={21} /> Каталог климатици
          </button>
          <button onClick={() => selectCapacity(9000)}>9 000 BTU</button>
          <button onClick={() => selectCapacity(12000)}>12 000 BTU</button>
          <button
            onClick={() => {
              resetFilters();
              setQuiet(true);
              toProducts();
            }}
          >
            Тихи модели
          </button>
          <a href="#sf-install">Климатик + монтаж</a>
          <a href="#sf-contacts" className="sf-nav-phone">
            Консултация <ArrowRight size={15} />
          </a>
        </div>
      </nav>
      <main>
        <div className="sf-wrap">
          <section className="sf-merch" aria-label="Избрано предложение">
            <aside
              id="sf-catalogue"
              className={`sf-catalogue ${catalogueOpen ? "is-open" : ""}`}
            >
              <div className="sf-catalogue-heading">
                Климатици{" "}
                <button
                  aria-label="Затвори каталога"
                  onClick={() => setCatalogueOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <button onClick={() => selectCapacity(0)}>
                <Wind size={19} /> Всички стенни <ChevronRight size={16} />
              </button>
              <button onClick={() => selectCapacity(9000)}>
                <span className="sf-rail-number">09</span> 9 000 BTU{" "}
                <ChevronRight size={16} />
              </button>
              <button onClick={() => selectCapacity(12000)}>
                <span className="sf-rail-number">12</span> 12 000 BTU{" "}
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => {
                  resetFilters();
                  setQuiet(true);
                  toProducts();
                }}
              >
                <Volume2 size={19} /> Тихи модели <ChevronRight size={16} />
              </button>
              <h2>Избери по марка</h2>
              <div className="sf-rail-brands">
                {brands.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => selectBrand(item.name)}
                  >
                    {item.name}
                    <ChevronRight size={14} />
                  </button>
                ))}
              </div>
              <a href="#sf-contacts" onClick={() => setCatalogueOpen(false)}>
                <Phone size={18} />
                <span>
                  Нужен е съвет?<b>Свържи се с нас</b>
                </span>
              </a>
            </aside>
            <article className="sf-product-banner">
              <div className="sf-banner-copy">
                <img
                  className="sf-gree-logo"
                  src="/brands/gree.svg"
                  alt="Gree"
                  width="121"
                  height="30"
                />
                <p className="sf-banner-overline">ИНВЕРТОРЕН КЛИМАТИК</p>
                <h1>
                  Airy <span>12</span>
                </h1>
                <p className="sf-banner-description">
                  За стаи до 24 m².
                  <br />
                  Клас A+++ при охлаждане.
                </p>
                <div className="sf-banner-price">
                  <strong>{price(958)}</strong>
                  <span>със стандартен монтаж</span>
                </div>
                <p className="sf-banner-breakdown">
                  Климатик 768 € + монтаж 190 €
                </p>
                <button
                  className="sf-button sf-button-dark"
                  onClick={() => openDetail(retailProducts[0])}
                >
                  Разгледай модела <ArrowRight size={18} />
                </button>
              </div>
              <div className="sf-banner-visual">
                <span className="sf-banner-capacity">
                  12 000 <small>BTU</small>
                </span>
                <img
                  src="/design-system/gree-airy-12.png"
                  alt="Gree Airy 12: вътрешно и външно тяло с дистанционно"
                  width="600"
                  height="600"
                  fetchPriority="high"
                />
                <span className="sf-banner-model">GWH12AVCXD-K6DNA1A</span>
              </div>
            </article>
            <a href="#sf-install" className="sf-service-banner">
              <img
                src="/portfolio/03-master-orange-install.jpg"
                alt="Монтаж на климатик от екипа на Песнопоец Клима"
                width="1200"
                height="1600"
              />
              <div>
                <span>МОНТАЖ ВЪВ ВАРНА</span>
                <h2>
                  От избора
                  <br />
                  до пускането.
                </h2>
                <p>
                  Виж какво включва
                  <br />
                  стандартният монтаж.
                </p>
                <b>
                  Подробности <ArrowRight size={20} />
                </b>
              </div>
            </a>
          </section>
          <div className="sf-brand-strip">
            <span>
              Марките в<br />
              <b>нашия каталог</b>
            </span>
            {brands.map((item) => (
              <button
                key={item.name}
                onClick={() => selectBrand(item.name)}
                aria-label={`Разгледай ${item.name}`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    width="150"
                    height="38"
                  />
                ) : (
                  <strong className="sf-techpoint">TechPoint</strong>
                )}
              </button>
            ))}
          </div>
          <section
            className="sf-product-section"
            id="sf-products"
            aria-labelledby="sf-products-title"
          >
            <div className="sf-section-heading">
              <div>
                <p>ИЗБЕРИ СВОЯ КЛИМАТИК</p>
                <h2 id="sf-products-title">
                  {onlyFavourites
                    ? "Любими модели"
                    : brand
                      ? `Климатици ${brand}`
                      : "Климатици за дома"}
                </h2>
              </div>
              <a href="#sf-contacts">
                Помощ от специалист <ArrowRight size={17} />
              </a>
            </div>
            <div className="sf-product-controls">
              <div className="sf-capacity-tabs" aria-label="Мощност">
                {[0, 9000, 12000].map((value) => (
                  <button
                    key={value}
                    aria-pressed={capacity === value}
                    onClick={() => setCapacity(value)}
                  >
                    {value ? `${value.toLocaleString("bg-BG")} BTU` : "Всички"}
                  </button>
                ))}
              </div>
              <label className="sf-mount-toggle">
                <input
                  type="checkbox"
                  checked={installed}
                  onChange={(event) => setInstalled(event.target.checked)}
                />
                <span />
                Цени с монтаж
              </label>
              <label className="sf-sort">
                <SlidersHorizontal size={16} />
                <span className="sf-sr">Подреди</span>
                <select
                  aria-label="Подреди"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                >
                  <option value="selected">Нашата селекция</option>
                  <option value="low">Цена: ниска към висока</option>
                  <option value="high">Цена: висока към ниска</option>
                </select>
              </label>
            </div>
            <div className="sf-results">
              <span aria-live="polite">
                {filtered.length} {filtered.length === 1 ? "модел" : "модела"}
                {quiet ? " · до 22 dB" : ""}
                {query ? ` · „${query}“` : ""}
              </span>
              {query || capacity || brand || quiet || onlyFavourites ? (
                <button onClick={resetFilters}>
                  Изчисти филтрите <X size={14} />
                </button>
              ) : (
                <span>Техника и монтаж с отделни цени</span>
              )}
            </div>
            <div className="sf-product-grid">
              {filtered.map((product) => (
                <article className="sf-product" key={product.id}>
                  <div className="sf-product-top">
                    <span
                      className="sf-energy"
                      title="Енергиен клас при охлаждане"
                    >
                      {product.energyClass}
                    </span>
                    <button
                      className="sf-heart"
                      aria-pressed={favourites.includes(product.id)}
                      aria-label={`Любим ${product.brand} ${product.series}`}
                      onClick={() => favourite(product.id)}
                    >
                      <Heart
                        size={21}
                        fill={
                          favourites.includes(product.id)
                            ? "currentColor"
                            : "none"
                        }
                      />
                    </button>
                  </div>
                  <button
                    className="sf-product-image"
                    onClick={() => openDetail(product)}
                    aria-label={`Разгледай ${product.brand} ${product.series}`}
                  >
                    <img
                      src={product.image}
                      alt={`${product.brand} ${product.series}`}
                      width="300"
                      height="220"
                      loading="lazy"
                    />
                  </button>
                  <div className="sf-product-info">
                    <p className="sf-product-brand">{product.brand}</p>
                    <h3>
                      <button onClick={() => openDetail(product)}>
                        {product.series}
                      </button>
                    </h3>
                    <p className="sf-product-sku">{product.model}</p>
                    <div className="sf-product-specs">
                      <b>{product.btu.toLocaleString("bg-BG")} BTU</b>
                      {product.area && <span>до {product.area} m²</span>}
                      {product.noise && <span>{product.noise} dB</span>}
                    </div>
                    <span className="sf-stock">
                      <span />В наличност*
                    </span>
                    <div className="sf-product-price">
                      <strong>
                        {price(
                          product.price +
                            (installed ? product.installation : 0),
                        )}
                      </strong>
                      <span>{installed ? "с монтаж" : "без монтаж"}</span>
                    </div>
                    <p className="sf-price-breakdown">
                      {price(product.price)} техника +{" "}
                      {price(product.installation)} монтаж
                    </p>
                    <button
                      className="sf-button sf-buy"
                      onClick={() => addToCart(product, installed)}
                    >
                      <ShoppingCart size={19} />
                      {cart.some((line) => line.id === product.id)
                        ? "В количката"
                        : "Добави"}
                    </button>
                    <label className="sf-compare-check">
                      <input
                        type="checkbox"
                        checked={compared.includes(product.id)}
                        onChange={() => compare(product.id)}
                      />
                      Сравни модела
                    </label>
                  </div>
                </article>
              ))}
            </div>
            {!filtered.length && (
              <div className="sf-empty">
                <Search size={28} />
                <h3>
                  {onlyFavourites
                    ? "Няма запазени модели"
                    : "Няма модел с тези филтри"}
                </h3>
                <p>
                  {onlyFavourites
                    ? "Натисни сърцето до модел, за да го запазиш тук."
                    : "Опитай друга марка, мощност или име на модел."}
                </p>
                <button className="sf-button" onClick={resetFilters}>
                  Всички климатици
                </button>
              </div>
            )}
            <p className="sf-catalogue-note">
              * Наличности и цени от публичния каталог към 27.09.2026. Прегледът
              не приема поръчки.
            </p>
          </section>
          <section className="sf-install" id="sf-install">
            <div className="sf-install-image">
              <img
                src="/portfolio/01-hero-install-wood-wall.jpg"
                alt="Монтиран климатик Gree върху дървена стена"
                width="1200"
                height="1600"
                loading="lazy"
              />
            </div>
            <div className="sf-install-content">
              <p className="sf-eyebrow">МОНТАЖ ВЪВ ВАРНА И РЕГИОНА</p>
              <h2>Какво включва монтажът.</h2>
              <p>
                Стандартният монтаж включва основните работи за пускането на
                климатик.
              </p>
              <ul>
                <li>
                  <Check size={18} />
                  Меден тръбен път до 3 метра
                </li>
                <li>
                  <Check size={18} />
                  Монтажни материали
                </li>
                <li>
                  <Check size={18} />
                  Вакуумиране и пускане в работа
                </li>
              </ul>
              <p className="sf-install-note">
                Допълнителните работи се уточняват според обекта.
              </p>
            </div>
            <div className="sf-install-price">
              <Wrench size={27} />
              <span>Стандартен монтаж</span>
              <strong>190 €</strong>
              <a className="sf-button" href={`tel:${BUSINESS_PHONE_TEL}`}>
                <Phone size={18} />
                Уточни монтажа
              </a>
              <small>Варна и региона</small>
            </div>
          </section>
          <section className="sf-faq" id="sf-questions">
            <div>
              <p className="sf-eyebrow">ПРЕДИ ДА ИЗБЕРЕШ</p>
              <h2>
                Въпроси за избора
                <br />и монтажа.
              </h2>
              <a href={`tel:${BUSINESS_PHONE_TEL}`}>
                {BUSINESS_PHONE_DISPLAY} <ArrowRight size={18} />
              </a>
            </div>
            <div className="sf-faq-items">
              <details>
                <summary>9 000 или 12 000 BTU?</summary>
                <p>
                  Площта е отправна точка. Важни са също изолацията,
                  изложението, височината и дали климатикът ще е основно
                  отопление. Посочената площ в картата е ориентир за конкретния
                  модел. За избор според стаята се свържи с нас.
                </p>
              </details>
              <details>
                <summary>Цената включва ли монтаж?</summary>
                <p>
                  При включен филтър „Цени с монтаж“ виждаш общата сума за
                  климатика и стандартния монтаж от 190 €. Двете стойности са
                  изписани отделно под цената. Допълнителни работи се уточняват
                  за конкретния обект.
                </p>
              </details>
              <details>
                <summary>Как се уговаря посещението?</summary>
                <p>
                  Свържи се с нас по телефона, за да уточним адреса, условията
                  за монтаж и възможната дата. Наличността и крайното
                  предложение се потвърждават при разговора.
                </p>
              </details>
            </div>
          </section>
        </div>
      </main>
      <footer className="sf-footer" id="sf-contacts">
        <div className="sf-wrap">
          <div>
            <Brand />
            <p>Климатици и монтаж във Варна.</p>
          </div>
          <div>
            <span>Говори с нас</span>
            <a className="sf-footer-phone" href={`tel:${BUSINESS_PHONE_TEL}`}>
              {BUSINESS_PHONE_DISPLAY}
            </a>
            <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          </div>
          <div>
            <span>Адрес</span>
            <p>
              {BUSINESS_STREET}
              <br />
              {BUSINESS_ADDRESS_CITY}
            </p>
            <a href="#sf-install">
              Условия за монтаж <ArrowRight size={15} />
            </a>
          </div>
        </div>
        <div className="sf-footer-bottom sf-wrap">
          <span>© 2026 Песнопоец Клима</span>
          <Link href="/">Работен преглед · Дизайн система</Link>
        </div>
      </footer>
      {compared.length > 0 && (
        <div className="sf-compare-bar">
          <Scale size={21} />
          <span>
            <b>{compared.length} от 3</b> модела за сравнение
          </span>
          <button
            className="sf-button"
            disabled={compared.length < 2}
            onClick={() => compareRef.current?.showModal()}
          >
            Сравни{compared.length < 2 ? " (избери още 1)" : " моделите"}
          </button>
          <button
            className="sf-close"
            aria-label="Изчисти сравнението"
            onClick={() => setCompared([])}
          >
            <X size={20} />
          </button>
        </div>
      )}
      <div className="sf-toast" role="status" aria-live="polite">
        {notice && (
          <span>
            <Check size={18} />
            {notice}
          </span>
        )}
      </div>
      <dialog
        className="sf-dialog sf-detail-dialog"
        ref={detailRef}
        onClose={() => setDetail(null)}
        aria-labelledby="sf-detail-title"
      >
        {detail && (
          <>
            <div className="sf-dialog-heading">
              <span>ПРЕГЛЕД НА МОДЕЛА</span>
              <button
                className="sf-close"
                aria-label="Затвори модела"
                onClick={() => detailRef.current?.close()}
              >
                <X size={22} />
              </button>
            </div>
            <div className="sf-detail-layout">
              <div className="sf-detail-image">
                <span className="sf-energy">{detail.energyClass}</span>
                <img
                  src={detail.image}
                  alt={`${detail.brand} ${detail.series}`}
                  width="480"
                  height="400"
                />
              </div>
              <div>
                <p className="sf-product-brand">{detail.brand}</p>
                <h2 id="sf-detail-title">{detail.series}</h2>
                <p className="sf-detail-model">{detail.model}</p>
                <dl className="sf-detail-specs">
                  <div>
                    <dt>Мощност</dt>
                    <dd>{detail.btu.toLocaleString("bg-BG")} BTU</dd>
                  </div>
                  {detail.area && (
                    <div>
                      <dt>Препоръчителна площ</dt>
                      <dd>до {detail.area} m²</dd>
                    </div>
                  )}
                  {detail.noise && (
                    <div>
                      <dt>Минимален шум</dt>
                      <dd>{detail.noise} dB</dd>
                    </div>
                  )}
                  <div>
                    <dt>Клас при охлаждане</dt>
                    <dd>{detail.energyClass}</dd>
                  </div>
                </dl>
                <label className="sf-detail-mount">
                  <input
                    type="checkbox"
                    checked={detailInstalled}
                    onChange={(event) =>
                      setDetailInstalled(event.target.checked)
                    }
                  />
                  Стандартен монтаж <b>+ {price(detail.installation)}</b>
                </label>
                <p className="sf-detail-mount-note">
                  До 3 m тръбен път, материали, вакуумиране и пускане.
                </p>
                <div className="sf-product-price">
                  <strong>
                    {price(
                      detail.price +
                        (detailInstalled ? detail.installation : 0),
                    )}
                  </strong>
                  <span>{detailInstalled ? "с монтаж" : "без монтаж"}</span>
                </div>
                <button
                  className="sf-button sf-detail-buy"
                  onClick={() => {
                    addToCart(detail, detailInstalled);
                    detailRef.current?.close();
                    cartRef.current?.showModal();
                  }}
                >
                  <ShoppingCart size={20} />
                  Добави в количката
                </button>
                <p className="sf-modal-disclaimer">
                  Работен преглед. Няма да бъде изпратена поръчка.
                </p>
              </div>
            </div>
          </>
        )}
      </dialog>
      <dialog
        className="sf-dialog sf-cart-dialog"
        ref={cartRef}
        aria-labelledby="sf-cart-title"
      >
        <div className="sf-dialog-heading">
          <h2 id="sf-cart-title">
            Твоята количка <span>({cart.length})</span>
          </h2>
          <button
            className="sf-close"
            aria-label="Затвори количката"
            onClick={() => cartRef.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        {cart.length ? (
          <>
            <div className="sf-cart-lines">
              {cart.map((line) => {
                const product = retailProducts.find(
                  (item) => item.id === line.id,
                )!;
                return (
                  <div className="sf-cart-line" key={line.id}>
                    <img src={product.image} alt="" width="92" height="92" />
                    <div>
                      <b>
                        {product.brand} {product.series}
                      </b>
                      <span>
                        {line.installed
                          ? `Техника ${price(product.price)} + монтаж ${price(product.installation)}`
                          : "Без монтаж"}
                      </span>
                      <strong>
                        {price(
                          product.price +
                            (line.installed ? product.installation : 0),
                        )}
                      </strong>
                    </div>
                    <button
                      className="sf-close"
                      aria-label={`Премахни ${product.brand} ${product.series}`}
                      onClick={() =>
                        setCart((lines) =>
                          lines.filter((item) => item.id !== line.id),
                        )
                      }
                    >
                      <Trash2 size={19} />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="sf-cart-total">
              <span>Общо</span>
              <strong>{price(total)}</strong>
            </div>
            <p className="sf-modal-disclaimer">
              Това е примерна количка. За наличност и реална поръчка се свържи с
              нас.
            </p>
            <a href={`tel:${BUSINESS_PHONE_TEL}`} className="sf-button">
              <Phone size={18} />
              {BUSINESS_PHONE_DISPLAY}
            </a>
          </>
        ) : (
          <div className="sf-empty">
            <ShoppingCart size={32} />
            <h3>Количката е празна</h3>
            <button
              className="sf-button"
              onClick={() => {
                cartRef.current?.close();
                toProducts();
              }}
            >
              Разгледай климатиците
            </button>
          </div>
        )}
      </dialog>
      <dialog
        className="sf-dialog sf-comparison-dialog"
        ref={compareRef}
        aria-labelledby="sf-compare-title"
      >
        <div className="sf-dialog-heading">
          <h2 id="sf-compare-title">Сравнение на модели</h2>
          <button
            className="sf-close"
            aria-label="Затвори сравнението"
            onClick={() => compareRef.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <div className="sf-table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Показател</th>
                {compareProducts.map((product) => (
                  <th scope="col" key={product.id}>
                    <img src={product.image} alt="" width="180" height="120" />
                    {product.brand}
                    <b>{product.series}</b>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Мощност",
                  (p: RetailProduct) => `${p.btu.toLocaleString("bg-BG")} BTU`,
                ],
                [
                  "Площ",
                  (p: RetailProduct) =>
                    p.area ? `до ${p.area} m²` : "Не е посочена",
                ],
                [
                  "Минимален шум",
                  (p: RetailProduct) =>
                    p.noise ? `${p.noise} dB` : "Не е посочен",
                ],
                ["Клас при охлаждане", (p: RetailProduct) => p.energyClass],
                ["Само техника", (p: RetailProduct) => price(p.price)],
                [
                  "Със стандартен монтаж",
                  (p: RetailProduct) => price(p.price + p.installation),
                ],
              ].map(([label, value]) => (
                <tr key={label as string}>
                  <th scope="row">{label as string}</th>
                  {compareProducts.map((product) => (
                    <td key={product.id}>
                      {(value as (p: RetailProduct) => string)(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sf-modal-disclaimer">
          Площта е ориентир. Условията в конкретната стая имат значение.
        </p>
      </dialog>
    </div>
  );
}
