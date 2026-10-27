"use client";
import { useRetailRuntime } from "./RetailRuntime";
import { useState, type ReactNode } from "react";
import Link from "./RetailLink";
import {
  ArrowRight,
  Info,
  ChevronRight,
  Heart,
  Minus,
  Phone,
  Plus,
  Scale,
  ShoppingBag,
  Snowflake,
  Sun,
  Volume2,
  Wifi,
} from "lucide-react";
import {
  type RetailProduct,
} from "../../data/storefront-products";
import { airyDetails } from "../../data/product-details";
import { price } from "../../data/products";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
} from "../../../lib/constants";
import ProductCard from "./ProductCard";
import ProductGallery from "./ProductGallery";
import PurchaseConditions from "./PurchaseConditions";
import ProductDocuments from "./ProductDocuments";
import ProductStories, { InstallationStory, ProductPurchaseReturn } from "./ProductStories";
import { useStore } from "./StoreProvider";

export default function RetailProductPage({
  product, originalDescription, originalSpecs,
}: {
  product: RetailProduct;
  originalDescription?: ReactNode;
  originalSpecs?: ReactNode;
}) {
  const runtime = useRetailRuntime();
  const retailProducts = runtime.products;
  const store = useStore();
  const { setInstalled } = store;
  const installed = store.installed && product.standardInstallation !== false;
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState("description");
  const isAiry = (product.campaignKey ?? product.id) === "gree-airy";
  const specs = isAiry
    ? airyDetails.specification
    : [
        ["Производител", product.brand],
        ["Модел", product.model],
        ["Мощност", `${product.btu.toLocaleString("bg-BG")} BTU`],
        ["Клас при охлаждане", product.energyClass],
        ...(product.area
          ? [["Препоръчителна площ", `до ${product.area} m²`]]
          : []),
        ...(product.noise ? [["Минимално ниво на шум", `${product.noise} dB`]] : []),
      ];
  const total = product.price + (installed ? product.installation : 0);
  function buy() {
    store.add(product, installed, quantity);
    store.openCart();
  }
  return (
    <main className="rt-pdp" id="rt-content">
      <aside className="rt-mobile-buy" aria-label="Бърза покупка">
        <div><strong>{price(total * quantity)}</strong><span>{quantity > 1 ? `${quantity} бр. · ` : ""}{installed ? "със стандартен монтаж" : "без монтаж"}</span></div>
        <button className="rt-btn rt-btn-primary" aria-label={`Добави ${product.series} в количката`} onClick={buy} disabled={product.orderable === false}><ShoppingBag size={19} />Добави</button>
      </aside>
      <div className="rt-breadcrumb">
        <div className="rt-container">
          <Link href="/storefront">Начало</Link>
          <ChevronRight size={13} />
          <Link href="/storefront/catalog">Климатици</Link>
          <ChevronRight size={13} />
          <span>
            {product.brand} {product.series}
          </span>
        </div>
      </div>
      <div className="rt-container">
        <section className="rt-product-overview">
          <div className="rt-product-heading">
            <span className="rt-pdp-brand">{product.brand}</span>
            <h1>
              {product.campaignKey ? <>{product.brand} {product.series}{product.btu ? `, ${product.btu.toLocaleString("bg-BG")} BTU` : ""}</> : product.title}
            </h1>
            <p className="rt-model-code">
              {product.databaseId ? `Арт. № ${product.databaseId}${product.campaignKey ? ` · ${product.model}` : ""}` : `Инверторен климатик · ${product.model}`}
              {isAiry ? ` · Код на производителя ${airyDetails.code}` : ""}
            </p>
          </div>
          <div className="pd-gallery-column">
            <ProductGallery product={product} />
            {isAiry && <ProductDocuments compact />}
          </div>
          <div className="rt-purchase" id="product-purchase" tabIndex={-1}>
            <div className="rt-availability">
              <Info size={16} />
              <span>{product.availability || "Наличността се потвърждава по телефона"}</span>
            </div>
            {isAiry && (
              <ul
                className="rt-pdp-highlights"
                aria-label="Основни характеристики"
              >
                <li>
                  <Snowflake size={16} aria-hidden="true" />
                  A+++ при охлаждане
                </li>
                <li>
                  <Sun size={16} aria-hidden="true" />
                  A++ при отопление
                </li>
                <li>
                  <Wifi size={16} aria-hidden="true" />
                  Вграден Wi-Fi модул
                </li>
              </ul>
            )}
            <div className="rt-offer-summary">
              <div className="rt-pdp-price">
                <strong>{product.price ? price(total) : "По запитване"}</strong>
                <span>
                  {installed ? "със стандартен монтаж" : "без монтаж"}
                  {isAiry && <small>Цената е с ДДС</small>}
                </span>
              </div>
              <dl className="rt-price-breakdown">
                <div>
                  <dt>Климатик</dt>
                  <dd>{price(product.price)}</dd>
                </div>
                <div>
                  <dt>Стандартен монтаж</dt>
                  <dd>
                    {installed ? price(product.installation) : "Без монтаж"}
                  </dd>
                </div>
              </dl>
            </div>
            {product.standardInstallation !== false && <div className="rt-installation-choice">
              <fieldset className="r16-variants"><legend>Изберете вариант</legend>
                <label data-selected={installed}><input type="radio" name="installation" checked={installed} onChange={() => setInstalled(true)} /><span><strong>Климатик с монтаж</strong><small>Стандартен монтаж до 3 m</small></span><b>{price(product.price + product.installation)}</b></label>
                <label data-selected={!installed}><input type="radio" name="installation" checked={!installed} onChange={() => setInstalled(false)} /><span><strong>Само климатик</strong><small>Без монтаж</small></span><b>{price(product.price)}</b></label>
              </fieldset>
              <p>
                {installed
                  ? "До 3 m тръбен път, монтажни материали, вакуумиране и пускане в експлоатация."
                  : "Цената е само за климатика. Монтажът не е включен."}
              </p>

            </div>
            }<div className="rt-buy-box">
              <div className="rt-pdp-buy">
                <div className="rt-quantity">
                  <button
                    aria-label="Намали количеството"
                    disabled={quantity === 1}
                    onClick={() => setQuantity((value) => value - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <output aria-label="Количество">{quantity}</output>
                  <button
                    aria-label="Увеличи количеството"
                    disabled={quantity === 10}
                    onClick={() => setQuantity((value) => value + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button className="rt-btn rt-btn-primary" onClick={buy} disabled={product.orderable === false}>
                  <ShoppingBag size={20} />
                  {product.orderable === false ? "Наличност по запитване" : "Добави в количката"}
                </button>
              </div>
              <div className="rt-secondary-actions">
                <button
                  aria-pressed={store.favourites.includes(product.id)}
                  onClick={() => store.toggleFavourite(product.id)}
                >
                  <Heart
                    size={18}
                    fill={
                      store.favourites.includes(product.id)
                        ? "currentColor"
                        : "none"
                    }
                  />
                  Любими
                </button>
                <button
                  aria-pressed={store.compared.includes(product.id)}
                  onClick={() => store.toggleCompare(product.id)}
                >
                  <Scale size={18} />
                  Сравни модела
                </button>
              </div>
            </div>
            {product.standardInstallation !== false && <details className="rt-installation-details">
                <summary>Какво включва стандартният монтаж?</summary>
                <ul>
                  <li>До 3 m меден тръбен път</li>
                  <li>Монтажни материали</li>
                  <li>Вакуумиране и пускане в експлоатация</li>
                </ul>
                <p>
                  Допълнителните дейности се уточняват според условията на обекта.
                  Датата за монтаж се уговаря предварително.
                </p>
              </details>}
            <PurchaseConditions installed={installed} isAiry={isAiry} warranty={product.warranty} />
            <div className="rt-pdp-facts">
              <div>
                <Snowflake />
                <span>
                  {product.energyClass ? "Охлаждане" : "Производител"}<b>{product.energyClass || product.brand}</b>
                </span>
              </div>
              {product.area && (
                <div>
                  <Sun />
                  <span>
                    За помещения<b>до {product.area} m²</b>
                  </span>
                </div>
              )}
              {product.noise && (
                <div>
                  <Volume2 />
                  <span>
                    {product.noiseNote ? "Тих режим" : "Мин. ниво на шум"}<b>{product.noise} dB(A)</b>
                  </span>
                </div>
              )}
            </div>
            <a className="rt-consult" href={`tel:${BUSINESS_PHONE_TEL}`}>
              <Phone size={21} />
              <span>
                Консултация за този модел<b>{BUSINESS_PHONE_DISPLAY}</b>
              </span>
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
        <div
          className="rt-pdp-tabs"
          role="tablist"
          aria-label="Информация за продукта"
        >
          {[
            ["description", "Описание"],
            ["specs", "Технически характеристики"],
            ["installation", "Монтаж и доставка"],
          ].map(([id, label]) => (
            <button
              key={id}
              id={`tab-${id}`}
              role="tab"
              aria-selected={tab === id}
              aria-controls={`panel-${id}`}
              tabIndex={tab === id ? 0 : -1}
              onClick={() => setTab(id)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  const ids = ["description", "specs", "installation"];
                  const next =
                    ids[
                      (ids.indexOf(tab) +
                        (event.key === "ArrowRight" ? 1 : 2)) %
                        3
                    ];
                  setTab(next);
                  document.getElementById(`tab-${next}`)?.focus();
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <section
          className="rt-product-information"
          id={`panel-${tab}`}
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
        >
          {tab === "description" && <>
            {originalDescription}
            {(isAiry || !runtime.live) && <ProductStories product={product} onSpecs={() => { setTab("specs"); document.getElementById("tab-specs")?.scrollIntoView({ block: "start" }); }} onInstallation={() => { setTab("installation"); document.getElementById("tab-installation")?.scrollIntoView({ block: "start" }); }} />}
          </>}
          {tab === "specs" && (
            <div className="rt-specification">
              <h2>Технически характеристики</h2>
              {isAiry && <p className="pd-spec-note">Данни на GREE за GWH12AVCXD-K6DNA1A. Посочените 19 dB(A) се отнасят за специалния тих режим. Звуковата мощност в енергийния етикет е различен показател от звуковото налягане в таблицата.</p>}
              {originalSpecs || <table>
                <tbody>
                  {specs.map(([label, value]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>}
              {isAiry && <ProductDocuments />}
            </div>
          )}
          {tab === "installation" && (
            product.standardInstallation === false ? <div className="pd-fitting"><p>Монтажът на тази система се уточнява според проекта и условията на обекта.</p><a href={`tel:${BUSINESS_PHONE_TEL}`}>Консултация за монтаж</a></div> : <InstallationStory amount={product.installation} selectedInstalled={installed} detailed />
          )}
        </section>
        <ProductPurchaseReturn product={product} quantity={quantity} />
        <section className="rt-related">
          <div className="rt-section-title">
            <h2>Други модели</h2>
            <Link href="/storefront/catalog">
              Всички климатици <ArrowRight size={17} />
            </Link>
          </div>
          <div className="rt-product-grid">
            {retailProducts
              .filter((p) => p.id !== product.id && (!product.categoryId || p.categoryId === product.categoryId))
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
          </div>
        </section>
        {!runtime.live && <p className="rt-data-note">
          Работен преглед.{" "}
          {isAiry
            ? "Цената и условията са от нашия каталог. Характеристиките са сверени с GREE на 26.10.2026."
            : "Показаните данни са от каталога към 27.09.2026."}{" "}
          Няма изпращане на поръчки.
        </p>}
      </div>
    </main>
  );
}
