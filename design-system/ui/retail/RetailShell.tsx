"use client";
import { useRetailRuntime, cataloguePath } from "./RetailRuntime";
import { useEffect, useRef, useState } from "react";
import Link from "./RetailLink";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Phone,
  Scale,
  Search,
  ShoppingBag,
  Wrench,
  X,
} from "lucide-react";
import { Brand } from "../components";
import { price } from "../../data/products";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_EMAIL,
  BUSINESS_STREET,
  BUSINESS_ADDRESS_CITY,
} from "../../../lib/constants";
import { emptyFilters, useStore } from "./StoreProvider";

export const retailBrands = [
  { name: "Gree", image: "/brands/gree.svg" },
  { name: "Mitsubishi Heavy", image: "/brands/mitsubishi-heavy.svg" },
  { name: "TechPoint", image: "" },
  { name: "Auratsu", image: "/brands/auratsu.png" },
];
export function Catalogue({ close }: { close?: () => void }) {
  const runtime = useRetailRuntime();
  const { filters, setFilters } = useStore();
  const router = useRouter();
  function choose(part: Partial<typeof emptyFilters>) {
    setFilters({ ...emptyFilters, ...part });
    close?.();
    router.push(cataloguePath(part, runtime));
  }
  return (
    <div className="rt-catalog-content">
      <section className="rt-catalog-options" aria-label="Избор на климатик">
        <button className="rt-catalog-all" onClick={() => choose({})}>
          Всички климатици <ArrowRight size={18} />
        </button>
        <h3>По мощност</h3>
        <div className="rt-catalog-capacities">
          {[7000, 9000, 12000, 18000, 24000].map(capacity => <button key={capacity} aria-pressed={filters.capacity === capacity} onClick={() => choose({ capacity })}>{capacity.toLocaleString("bg-BG")} <small>BTU</small></button>)}
        </div>
        <button className="rt-catalog-quiet" onClick={() => choose({ quiet: true })}>
          <span>Тихи модели<small>Минимално ниво на шум до 22 dB</small></span><ArrowRight size={16} />
        </button>
      </section>
      <section className="rt-catalog-brands" aria-label="Избор по марка">
        <h3>По марка</h3>
        {(runtime.live ? [...new Set(runtime.products.map(p=>p.brand))].filter(Boolean).slice(0,10).map(name=>({name})) : retailBrands).map((item) => (
          <button key={item.name} aria-pressed={filters.brand === item.name} onClick={() => choose({ brand: item.name })}>
            {item.name}<ArrowRight size={15} />
          </button>
        ))}
      </section>
      <aside className="rt-catalog-help">
        <Wrench size={25} />
        <h3>Монтаж във Варна</h3>
        <p>Вижте какво включва стандартният монтаж и кога е необходим оглед.</p>
        <Link href="/storefront/installation" onClick={close}>За монтажа <ArrowRight size={16} /></Link>
        <a href={`tel:${BUSINESS_PHONE_TEL}`} onClick={close}><Phone size={16} />{BUSINESS_PHONE_DISPLAY}</a>
      </aside>
    </div>
  );
}
export function RetailHeader() {
  const runtime = useRetailRuntime();
  const store = useStore();
  const router = useRouter();
  const [draft, setDraft] = useState({ value: store.filters.query, appliedQuery: store.filters.query });
  // Reset the draft when a category, chip or search submission changes the applied query.
  if (draft.appliedQuery !== store.filters.query) {
    setDraft({ value: store.filters.query, appliedQuery: store.filters.query });
  }
  const query = draft.value;
  const [menu, setMenu] = useState(false);
  const catalogueRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  function closeCatalogue() {
    catalogueRef.current?.hidePopover();
  }
  function positionCatalogue(event: React.MouseEvent<HTMLButtonElement>) {
    const trigger = event.currentTarget;
    const bounds = window.innerWidth <= 760
      ? trigger.closest("header")!.getBoundingClientRect()
      : trigger.getBoundingClientRect();
    catalogueRef.current?.style.setProperty("--catalog-top", `${bounds.bottom + 8}px`);
    catalogueRef.current?.style.setProperty("--catalog-left", `${bounds.left}px`);
  }
  useEffect(() => {
    if (!menu) return;
    // A fixed popover must not remain detached from its trigger after scrolling.
    window.addEventListener("scroll", closeCatalogue, { passive: true });
    window.addEventListener("resize", closeCatalogue);
    return () => {
      window.removeEventListener("scroll", closeCatalogue);
      window.removeEventListener("resize", closeCatalogue);
    };
  }, [menu]);
  function search(event: React.FormEvent) {
    event.preventDefault();
    closeCatalogue();
    store.setFilters({ ...emptyFilters, query: query.trim() });
    router.push(cataloguePath({query:query.trim()}, runtime));
  }
  return (
    <>
      <a href="#rt-content" className="rt-skip">
        Към съдържанието
      </a>
      {(!runtime.live || runtime.readOnly) && <div className="rt-preview">
        <div className="rt-container">
          <span>Работен преглед</span>
          <span>{runtime.live ? "Актуален каталог. Изпращането на заявки е изключено в този преглед." : "Демонстрационен магазин. Поръчки не се изпращат."}</span>
          <Link href="/">
            Дизайн система <ArrowRight size={12} />
          </Link>
        </div>
      </div>
      }<div className="rt-top">
        <div className="rt-container">
          <span>
            <MapPin size={14} />
            Варна и региона
          </span>
          <nav>
            <Link href="/storefront/installation">Монтаж на климатици</Link>
            <Link href="/storefront#help">Помощ при избора</Link>
          </nav>
          <a href={`tel:${BUSINESS_PHONE_TEL}`}>
            <Phone size={14} />
            {BUSINESS_PHONE_DISPLAY}
          </a>
        </div>
      </div>
      <header className="rt-header">
        <div className="rt-container rt-header-row">
          <button className="rt-mobile-menu" aria-label={menu ? "Затвори каталога" : "Отвори каталога"} aria-expanded={menu} aria-controls="rt-catalog-popover" popoverTarget="rt-catalog-popover" onClick={positionCatalogue}>{menu ? <X size={23} /> : <Menu size={23} />}</button>
          <Link
            href="/storefront"
            aria-label="Песнопоец Клима, начало"
            className="rt-logo"
            onClick={closeCatalogue}
          >
            <Brand />
            <small>климатици · монтаж · сервиз</small>
          </Link>
          <form role="search" className="rt-search" onSubmit={search}>
            <input
              ref={searchRef}
              aria-label="Търси климатик"
              type="search"
              placeholder="Климатик, марка или модел"
              value={query}
              onChange={(event) => setDraft({ value: event.target.value, appliedQuery: store.filters.query })}
            />
            {query && <button type="button" className="rt-search-clear" aria-label="Изчисти търсенето" onClick={() => {
              setDraft({ value: "", appliedQuery: "" });
              store.setFilters({ ...store.filters, query: "" });
              searchRef.current?.focus();
            }}><X size={18} /></button>}
            <button aria-label="Търси" type="submit">
              <Search size={22} />
            </button>
          </form>
          <div className="rt-header-actions">
            <button className="rt-mobile-cart" aria-label={`Количка: ${store.cart.reduce((sum, line) => sum + line.quantity, 0)}`} onClick={store.openCart}><ShoppingBag /><b>{store.cart.reduce((sum, line) => sum + line.quantity, 0)}</b></button>
            <button
              aria-label={`Любими: ${store.favourites.length}`}
              onClick={() => {
                store.setFilters({ ...emptyFilters, favourites: true });
                router.push(cataloguePath({favourites:true}, runtime));
              }}
            >
              <Heart />
              <span>
                Любими
              </span>
              <b>{store.favourites.length}</b>
            </button>
            <button
              aria-label={`Сравнение: ${store.compared.length}`}
              onClick={store.openCompare}
            >
              <Scale />
              <span>
                Сравнение
              </span>
              <b>{store.compared.length}</b>
            </button>
          </div>
        </div>
      </header>
      <div className="rt-navigation">
        <div className="rt-container rt-nav-row">
          <div className="rt-menu-wrap">
            <button
              className="rt-menu-button"
              onClick={positionCatalogue}
              aria-expanded={menu}
              aria-controls="rt-catalog-popover"
              popoverTarget="rt-catalog-popover"
            >
              {menu ? <X size={21} /> : <Menu size={21} />}
              Каталог
              <ChevronDown size={15} />
            </button>
          </div>
          <nav aria-label="Главна навигация">
            <Link
              href="/storefront/catalog"
              onClick={() => store.setFilters(emptyFilters)}
            >
              Климатици
            </Link>
            <Link href="/storefront#brands">Марки</Link>
            <Link href="/storefront/installation">Монтаж</Link>
            <Link href="/storefront#help">Помощ при избора</Link>
            <a href="#contacts">Контакти</a>
          </nav>
          <button
            className="rt-cart-button"
            onClick={store.openCart}
            aria-label={`Количка: ${store.cart.reduce((sum, line) => sum + line.quantity, 0)}`}
          >
            <span>
              Количка <b>{price(store.total)}</b>
            </span>
            <i>
              <ShoppingBag size={23} />
              <small>
                {store.cart.reduce((sum, line) => sum + line.quantity, 0)}
              </small>
            </i>
          </button>
        </div>
      </div>
      <div
        ref={catalogueRef}
        id="rt-catalog-popover"
        className="rt-catalog-popover"
        popover="auto"
        role="region"
        aria-label="Каталог на климатиците"
        onToggle={event => setMenu(event.newState === "open")}
        onBlur={event => {
          const next = event.relatedTarget;
          if (next instanceof HTMLElement && !event.currentTarget.contains(next) && next.getAttribute("popoverTarget") !== "rt-catalog-popover") closeCatalogue();
        }}
      >
        <div className="rt-catalog-title"><strong>Каталог на климатиците</strong><button aria-label="Затвори каталога" popoverTarget="rt-catalog-popover" popoverTargetAction="hide"><X size={21} /></button></div>
        <Catalogue close={closeCatalogue} />
        <button className="rt-mobile-compare" onClick={() => { closeCatalogue(); store.openCompare(); }}><Scale size={18} />Сравнение ({store.compared.length})</button>
      </div>
    </>
  );
}
export function RetailFooter() {
  const runtime = useRetailRuntime();
  return (
    <footer className="rt-footer" id="contacts">
      <div className="rt-container rt-footer-grid">
        <div>
          <Brand />
          <p>
            Климатици, монтаж и сервиз
            <br />
            във Варна и региона.
          </p>
        </div>
        <div>
          <h3>КАТАЛОГ</h3>
          <Link href={runtime.live ? "/bg/klimatici?category=1" : "/storefront/catalog"}>Стенни климатици</Link>
          <Link href="/storefront#brands">Марки климатици</Link>
          <Link href="/storefront/catalog">Всички модели</Link>
        </div>
        <div>
          <h3>Помощ при избора</h3>
          <Link href="/storefront/installation">Стандартен монтаж</Link>
          <Link href="/storefront#help">Избор на мощност</Link>
          <Link href="/storefront/delivery">Доставка и плащане</Link>
        </div>
        <div>
          <h3>СВЪРЖЕТЕ СЕ С НАС</h3>
          <a className="rt-contact-phone" href={`tel:${BUSINESS_PHONE_TEL}`}>
            {BUSINESS_PHONE_DISPLAY}
          </a>
          <a href={`mailto:${BUSINESS_EMAIL}`}>{BUSINESS_EMAIL}</a>
          <p>
            {BUSINESS_STREET}, {BUSINESS_ADDRESS_CITY}
          </p>
        </div>
      </div>
      <div className="rt-container rt-footer-bottom">
        <span>© 2026 Песнопоец Клима</span>{runtime.live && <nav aria-label="Език" className="r16-languages"><span aria-current="page">BG</span><Link href="/en" lang="en">EN</Link><Link href="/ua" lang="uk">UA</Link><Link href="/ru" lang="ru">RU</Link></nav>}
        <div className="r14-legal"><Link href={runtime.live ? "/bg/terms" : "https://pesnopoets-clima.com/bg/terms"}>Общи условия</Link><Link href={runtime.live ? "/bg/privacy" : "https://pesnopoets-clima.com/bg/privacy"}>Поверителност</Link>{runtime.live && <button onClick={()=>window.dispatchEvent(new CustomEvent("pc:open-consent"))}>Настройки за бисквитки</button>}{!runtime.live && <Link href="/design-system/reference-14/index.html">Референси и проверка</Link>}</div>
      </div>
    </footer>
  );
}
