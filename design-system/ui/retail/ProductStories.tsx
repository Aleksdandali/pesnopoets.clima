"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "./RetailLink";
import { ArrowRight, Check, Droplets, Fan, Gauge, Phone, Ruler, Sun, Thermometer, Volume2, Wifi } from "lucide-react";
import type { RetailProduct } from "../../data/storefront-products";
import { price } from "../../data/products";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from "../../../lib/constants";
import { useStore } from "./StoreProvider";
import ProductDocuments from "./ProductDocuments";

const assets = "/design-system/stories-09/";

export function StoryImage({ name, alt }: { name: string; alt: string }) {
  return <img className="ps-image" src={`${assets}${name}.webp`} srcSet={`${assets}${name}-768.webp 768w, ${assets}${name}.webp 1536w`} sizes="(max-width: 700px) 100vw, 650px" alt={alt} width="1536" height="1024" loading="lazy" decoding="async" />;
}

function WinterStory() {
  return <article className="ps-split ps-winter" data-story="winter">
    <div className="ps-copy">
      <span className="ps-kicker"><Sun size={16} /> GREE AIRY 12 · ОТОПЛЕНИЕ</span>
      <h2>Отопление при<br />ниски температури</h2>
      <p>Gree Airy 12 работи в режим на отопление при външни температури до −25 °C. За отопление през зимата мощността се подбира според топлинните загуби на помещението.</p>
      <div className="ps-big-stat"><strong>−25<span> °C</span></strong><span>долна граница на работния<br />диапазон при отопление</span></div>
      <small>Работен диапазон: от −25 до +30 °C. Отоплителната мощност зависи от външната температура.</small>
    </div>
    <figure className="ps-media"><StoryImage name="01-airy-winter" alt="Интериорна визуализация с Gree Airy и зимен изглед през прозореца" /></figure>
  </article>;
}

export function WifiArtwork() {
  return <figure className="ps-media ps-wifi-product"><span className="ps-wifi-model">GREE <b>AIRY 12</b></span><img className="ps-wifi-unit" src="/design-system/gree-airy-12.png" alt="Gree Airy 12: вътрешно тяло, външно тяло и дистанционно управление" width="800" height="800" loading="lazy" /><Wifi className="ps-wifi-signal" size={36} aria-hidden="true" /><div className="ps-app-phone"><img src="/design-system/stories-09/gree-plus-official.webp" alt="Официален примерен екран на приложението GREE+" width="314" height="680" loading="lazy" /></div><figcaption>GREE+ <span>Приложение за Android и iOS</span></figcaption></figure>;
}

function WifiStory() {
  return <article className="ps-split ps-wifi" data-story="wifi">
    <WifiArtwork />
    <div className="ps-copy">
      <span className="ps-kicker"><Wifi size={16} /> ВГРАДЕН WI-FI МОДУЛ</span>
      <h2>Wi-Fi управление<br />с GREE+</h2>
      <p>Вграденият Wi-Fi модул позволява да управлявате климатика през приложението GREE+. Можете да променяте настройките от телефона си, когато климатикът е свързан с интернет.</p>
      <ul className="ps-checks"><li><Check size={18} /> Wi-Fi модулът е включен в цената</li><li><Check size={18} /> Приложение за Android и iOS</li></ul>
      <small>Свързването се извършва според ръководството на производителя. Показан е примерен екран от GREE+.</small>
    </div>
  </article>;
}

export function RoomStory({ product }: { product?: RetailProduct }) {
  return <article className="ps-split ps-room" data-story="room">
    <div className="ps-copy">
      <span className="ps-kicker"><Ruler size={16} /> ИЗБОР НА МОЩНОСТ</span>
      <h2>Климатик според<br />помещението</h2>
      <p>{product?.area ? `${product.brand} ${product.series} е с препоръчителна площ до ${product.area} m². При избора трябва да се вземат предвид изолацията, изложението и височината на помещението.` : "За правилния избор на климатик са важни площта, изолацията, изложението и височината на помещението. Ще Ви помогнем да подберете мощност според условията и начина на използване."}</p>
      <div className="ps-factors"><span>Изложение</span><span>Изолация</span><span>Височина на помещението</span><span>Отопление или охлаждане</span></div>
      <a className="ps-text-link" href={`tel:${BUSINESS_PHONE_TEL}`}>Консултация по телефона <ArrowRight size={18} /></a>
    </div>
    <figure className="ps-media"><StoryImage name="04-room-selection" alt="Илюстративен интериор с широки прозорци и отворено пространство" />{product?.area && <figcaption className="ps-area"><span>Препоръчителна площ</span><strong>до {product.area} <small>m²</small></strong></figcaption>}</figure>
  </article>;
}

function QuietStory({ product }: { product: RetailProduct }) {
  return <article className="ps-split ps-quiet" data-story="quiet">
    <figure className="ps-media"><StoryImage name="03-bedroom" alt="Илюстративна сцена на спокойна спалня вечер" /></figure>
    <div className="ps-copy">
      <span className="ps-kicker">{product.brand.toUpperCase()} · {product.series.toUpperCase()}</span>
      <h2>Ниско ниво на шум<br />за спалнята</h2>
      <div className="ps-big-stat"><strong>{product.noise}<span> dB</span></strong><span>минимално ниво на шум<br />на вътрешното тяло</span></div>
      <p>Нивото на шум зависи от режима на работа и скоростта на вентилатора. За спалнята е важно да се съобрази и необходимата мощност за отопление и охлаждане.</p>
    </div>
  </article>;
}

function AiryFeatures() {
  const features = [
    { icon: Volume2, title: "19 dB(A) в тих режим", copy: "Специална функция за намаляване на шума. При обичайните скорости звуковото налягане е от 25 до 38 dB(A)." },
    { icon: Thermometer, title: "I-Feel", copy: "Температурният сензор в дистанционното управление отчита температурата близо до Вас." },
    { icon: Droplets, title: "Контрол на влажността", copy: "Регулиране на влажността в режим на охлаждане и изсушаване." },
    { icon: Gauge, title: "G-AI управление", copy: "Алгоритъмът управлява работата на климатика с цел по-ниска консумация на енергия." },
    { icon: Fan, title: "Самопочистване", copy: "Функцията Autoclean подпомага почистването на топлообменника на вътрешното тяло." },
    { icon: Sun, title: "Хибридно размразяване", copy: "Технологията HDT използва размразяване на стъпки за по-дълги периоди на непрекъснато отопление." },
  ];
  return <section className="pd-model-features"><div className="pd-section-heading"><span className="ps-kicker">GREE AIRY 12</span><h2>Функции за ежедневен комфорт</h2><p>Управление от телефона, тих режим и настройки според условията в помещението.</p></div><div className="pd-feature-grid">{features.map(({ icon: Icon, title, copy }) => <article key={title}><Icon size={25} aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}</div></section>;
}

function EfficiencyStory({ product, onSpecs }: { product: RetailProduct; onSpecs: () => void }) {
  const airy = (product.campaignKey ?? product.id) === "gree-airy";
  return <article className="ps-efficiency" data-story="efficiency">
    <div className="ps-efficiency-heading"><span className="ps-kicker">{product.brand.toUpperCase()} · {product.series.toUpperCase()}</span><h2>{airy ? <>Сезонна<br /> ефективност</> : <>Основни<br /> характеристики</>}</h2><button className="ps-text-link" onClick={onSpecs}>Технически характеристики <ArrowRight size={17} /></button></div>
    <div className="ps-energy-grade"><strong>{product.energyClass}</strong><span>енергиен клас<br />при охлаждане</span></div>
    <dl className="ps-numbers">{airy ? <><div><dt>SEER · охлаждане</dt><dd>8,5</dd></div><div><dt>SCOP · отопление</dt><dd>4,6</dd></div><div><dt>Клас при отопление</dt><dd>A++</dd></div></> : <><div><dt>Мощност</dt><dd>{product.btu.toLocaleString("bg-BG")} <small>BTU</small></dd></div><div><dt>Климатик</dt><dd>{price(product.price)}</dd></div><div><dt>Стандартен монтаж</dt><dd>{price(product.installation)}</dd></div></>}</dl>
  </article>;
}

export function InstallationStory({ amount = 190, detailed = false, onDetails, selectedInstalled }: { amount?: number; detailed?: boolean; onDetails?: () => void; selectedInstalled?: boolean }) {
  return <div className={`ps-installation ${detailed ? "ps-installation-detailed" : ""}`} data-story="installation">
    <article className="ps-split ps-install-banner">
      <figure className="ps-media"><StoryImage name="05-installation-materials" alt="Рекламна предметна композиция: медна тръба, изолация и монтажни инструменти" /></figure>
      <div className="ps-copy"><span className="ps-kicker">СТАНДАРТЕН МОНТАЖ · ВАРНА И РЕГИОНА</span><h2>Стандартен монтаж<br />на климатик</h2><div className="ps-install-price"><strong>{price(amount)}</strong><span>{selectedInstalled === undefined ? <>отделно от цената<br />на климатика</> : selectedInstalled ? <>включен в избрания<br />вариант</> : <>допълнителна услуга<br />по избор</>}</span></div>
        <ul className="ps-checks"><li><Check size={18} /> До 3 m меден тръбен път</li><li><Check size={18} /> Монтажни материали</li><li><Check size={18} /> Вакуумиране и пускане в експлоатация</li></ul>
        <p className="ps-condition">Необходимите допълнителни дейности и датата за монтаж се уточняват предварително според условията на обекта.</p>
        {onDetails ? <button className="rt-btn" onClick={onDetails}>Монтаж и доставка <ArrowRight size={17} /></button> : <a className="rt-btn" href={`tel:${BUSINESS_PHONE_TEL}`}>Консултация за монтаж <Phone size={17} /></a>}
      </div>
    </article>
    {detailed && <div className="ps-install-process">
      <figure><img src="/portfolio/10-pipe-flaring-tool.jpg" width="1200" height="1600" alt="Подготовка на тръбна връзка при монтаж от портфолиото ни" loading="lazy" /><figcaption>От работата на нашия екип</figcaption></figure>
      <div><span className="ps-kicker">ОТ ИЗБОРА ДО ПУСКАНЕТО</span><h3>Подготовка<br />за монтажа</h3><ol><li><strong>Помещението</strong><span>Уточняваме площта, изложението и местата за вътрешното и външното тяло.</span></li><li><strong>Обхватът на работата</strong><span>Уточняваме дължината на тръбния път, достъпа и необходимите допълнителни дейности.</span></li><li><strong>Доставката и датата</strong><span>Потвърждаваме наличността и уговаряме дата за доставка и монтаж.</span></li></ol><a className="ps-text-link" href={`tel:${BUSINESS_PHONE_TEL}`}><Phone size={17} />{BUSINESS_PHONE_DISPLAY}</a></div>
    </div>}
  </div>;
}

export default function ProductStories({ product, onSpecs, onInstallation }: { product: RetailProduct; onSpecs: () => void; onInstallation: () => void }) {
  const store = useStore();
  const installed = store.installed && product.standardInstallation !== false;
  const airy = (product.campaignKey ?? product.id) === "gree-airy";
  const quiet = product.noise !== undefined && product.noise <= 22;
  if (airy) return <div className="ps-flow pd-airy-story" id="product-story">
    <AiryFeatures />
    <WinterStory />
    <EfficiencyStory product={product} onSpecs={onSpecs} />
    <WifiStory />
    <aside className="pd-fitting"><Ruler size={28} /><div><h2>Подходящ ли е за Вашето помещение?</h2><p>Препоръчителната площ е до 24 m². За избор на мощност съобразяваме изолацията, изложението и нуждата от отопление.</p></div><a href={`tel:${BUSINESS_PHONE_TEL}`}><Phone size={17} /> Консултация</a></aside>
    <ProductDocuments />
    <div className="pd-install-reminder"><div><strong>Стандартен монтаж · {price(product.installation)}</strong><span>{installed ? "Включен в избрания вариант" : "Допълнителна услуга по избор"}. До 3 m тръбен път, материали, вакуумиране и пуск.</span></div><button className="ps-text-link" onClick={onInstallation}>Монтаж и доставка <ArrowRight size={17} /></button></div>
  </div>;
  return <div className="ps-flow" id="product-story">
    {quiet ? <QuietStory product={product} /> : <RoomStory product={product} />}
    <EfficiencyStory product={product} onSpecs={onSpecs} />
    {quiet && <RoomStory product={product} />}
    <InstallationStory amount={product.installation} selectedInstalled={installed} onDetails={onInstallation} />
  </div>;
}

export function ProductPurchaseReturn({ product, quantity }: { product: RetailProduct; quantity: number }) {
  const store = useStore();
  const installed = store.installed && product.standardInstallation !== false;
  return <aside className="ps-purchase-return" aria-label="Обратно към избрания вариант">
    <img src={product.image} width="90" height="80" alt="" loading="lazy" />
    <div className="ps-return-model"><span>{product.brand}</span><strong>{product.series}</strong></div>
    <div className="ps-return-price"><strong>{price((product.price + (installed ? product.installation : 0)) * quantity)}</strong><span>{quantity > 1 ? `${quantity} бр. · ` : ""}{installed ? "със стандартен монтаж" : "само климатик"}</span></div>
    <a className="rt-btn" href="#product-purchase">Избор на вариант <ArrowRight size={17} /></a>
  </aside>;
}

export function AiryEditorialLink() {
  return <section className="ps-editorial" aria-label="Gree Airy 12">
    <StoryImage name="01-airy-winter" alt="Интериорна визуализация на Gree Airy през зимата" />
    <div><span className="ps-kicker">GREE AIRY 12 · 12 000 BTU</span><h2>Отопление до −25 °C.<br />Wi-Fi управление.</h2><p>Енергиен клас A+++ при охлаждане и A++ при отопление. Вграден Wi-Fi модул за управление през GREE+.</p><Link className="rt-btn" href="/storefront/gree-airy#product-story">Повече за Gree Airy <ArrowRight size={17} /></Link></div>
  </section>;
}
