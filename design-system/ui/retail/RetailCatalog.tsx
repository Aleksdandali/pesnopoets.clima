"use client";
import { useRetailRuntime, retailPath } from "./RetailRuntime";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "./RetailLink";
import { ArrowRight, ChevronDown, Phone, SlidersHorizontal, Scale, X } from "lucide-react";

import { matchesProductQuery } from "../../data/catalog-search";
import { BUSINESS_PHONE_TEL } from "../../../lib/constants";

import ProductCard from "./ProductCard";
import { emptyFilters, useStore } from "./StoreProvider";

export default function RetailCatalog() {
  const runtime = useRetailRuntime();
  const retailProducts = runtime.products;
  const store = useStore();
  const { installed, setInstalled } = store;
  const router = useRouter();
  const params = useSearchParams();
  const sortAlias: Record<string,string> = {price_asc:"low",price_desc:"high"};
  const rawSort = params.get("sort") || "selected";
  const sort = sortAlias[rawSort] || rawSort;
  const energy = params.get("energy") || "";
  const available = params.get("available") === "1";
  const page = Math.max(1, Math.floor(Number(params.get("page"))) || 1);
  const category = Number(params.get("category")) || 0;
  function updateUrl(values: Record<string,string>) { const next=new URLSearchParams(window.location.search); for(const [key,value] of Object.entries(values)) { if(value)next.set(key,value);else next.delete(key); } if(!("page" in values))next.delete("page"); window.history.replaceState(null, "", `${retailPath("/storefront/catalog",runtime)}${next.size ? `?${next}` : ""}`); }
  const setSort = (value:string) => updateUrl({sort:value});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = {query:params.get("q")||"",brand:params.get("brand")||"",capacity:Number(params.get("btu"))||0,quiet:params.get("quiet")==="1",favourites:params.get("saved")==="1"};
  useEffect(() => { if (store.filters.query !== filters.query) store.setFilters({...store.filters,query:filters.query}); }, [filters.query, store]);
  function setFilters(value: typeof emptyFilters) { store.setFilters(value); updateUrl({q:value.query,brand:value.brand,btu:value.capacity ? String(value.capacity):"",quiet:value.quiet?"1":"",saved:value.favourites?"1":""}); }
  const brands = [...new Set(retailProducts.map(p=>p.brand))].filter(Boolean).sort();
  const selected = retailProducts
    .filter(
      (p) =>
        (!category || p.categoryId === category) &&
        (!filters.brand || p.brand.toLowerCase() === filters.brand.toLowerCase()) &&
        (!energy || p.energyClass.includes(energy)) &&
        (!available || p.availability === "Наличен") &&
        (!filters.capacity || p.btu === filters.capacity) &&
        (!filters.quiet || (p.noise !== undefined && p.noise <= 22)) &&
        (!filters.favourites || store.favourites.includes(p.id)) &&
        matchesProductQuery(p, filters.query),
    )
    .sort((a, b) =>
      sort === "low"
        ? (a.price + (installed ? a.installation : 0)) - (b.price + (installed ? b.installation : 0))
        : sort === "high"
          ? (b.price + (installed ? b.installation : 0)) - (a.price + (installed ? a.installation : 0))
          : sort === "btu_asc" ? a.btu - b.btu
          : sort === "btu_desc" ? b.btu - a.btu
          : sort === "name_asc" ? `${a.brand} ${a.series}`.localeCompare(`${b.brand} ${b.series}`,"bg")
          : (a.categoryId || 0)-(b.categoryId || 0) || Number(a.orderable===false)-Number(b.orderable===false) || a.brand.localeCompare(b.brand),
    );
  const pageCount = Math.max(1, Math.ceil(selected.length / 24));
  const currentPage = Math.min(page, pageCount);
  const visibleProducts = selected.slice((currentPage-1)*24,currentPage*24);
  const capacities = [...new Set(retailProducts.map(p => p.btu))].filter(Boolean).sort((a, b) => a - b);
  const active = Boolean(
    category || energy || available || filters.brand ||
      filters.capacity ||
      filters.query ||
      filters.quiet ||
      filters.favourites,
  );
  return <main id="rt-content" className="r14-catalog"><div className="rt-container"><nav className="r14-breadcrumb" aria-label="Навигация"><Link href="/storefront">Начало</Link><span>/</span><span>Климатици</span></nav>
        <section className="rt-catalog-section" id="catalog">
          <div className="rt-section-title">
            <div>
              <h1>
                {filters.favourites
                  ? "Любими модели"
                  : filters.query
                    ? "Резултати от търсенето"
                  : category ? runtime.categories.find(c=>c.id===category)?.name || "Каталог"
                  : filters.brand
                    ? `Климатици ${filters.brand}`
                    : "Климатици и климатична техника"}
              </h1>
              <p>{category===8 ? "Управление и аксесоари за климатична техника. Проверете съвместимостта с Вашия модел." : "Сравнете характеристиките и цените. Стандартен монтаж се предлага за стенни климатици до 24 000 BTU."}</p>
            </div>
            <a href={`tel:${BUSINESS_PHONE_TEL}`}>
              <Phone size={17} />
              Помощ при избора
            </a>
          </div>
          <div className="rt-selection-panel" data-expanded={filtersOpen}>
            <div className="rt-selection-fields" id="rt-product-filters">
            {runtime.categories.length>0 && <label className="r16-category-filter">Категория<select value={category} onChange={event=>updateUrl({category:event.target.value})}><option value="0">Всички категории</option>{runtime.categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>}
            <label className="rt-brand-filter">
              <span>Марка</span>
              <select value={filters.brand} onChange={event => setFilters({ ...filters, brand: event.target.value })}>
                <option value="">Всички марки</option>
                {brands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
              </select>
            </label>
            {category!==8 && <fieldset className="rt-capacity-field">
              <legend>Мощност</legend>
              {capacities.length>6 ? <select aria-label="Мощност" value={filters.capacity} onChange={event=>setFilters({...filters,capacity:Number(event.target.value)})}><option value={0}>Всички мощности</option>{capacities.map(value=><option key={value} value={value}>{value.toLocaleString("bg-BG")} BTU</option>)}</select> : <div className="rt-capacities">
              {[0, ...capacities].map((value) => (
                <button
                  key={value}
                  aria-pressed={filters.capacity === value}
                  onClick={() => setFilters({ ...filters, capacity: value })}
                >
                  {value ? `${value.toLocaleString("bg-BG")} BTU` : "Всички"}
                </button>
              ))}
            </div>}
            </fieldset>}
            {runtime.live && category!==8 && <label className="r16-energy-filter">Енергиен клас<select value={energy} onChange={event=>updateUrl({energy:event.target.value})}><option value="">Всички класове</option>{[...new Set(retailProducts.map(p=>p.energyClass))].filter(Boolean).sort().map(value=><option key={value} value={value}>{value}</option>)}</select></label>}
            {runtime.live && <label className="rt-quiet-toggle"><input type="checkbox" checked={available} onChange={event=>updateUrl({available:event.target.checked ? "1" : ""})}/>Само налични</label>}
            {category!==8 && <label className="rt-quiet-toggle"><input type="checkbox" checked={filters.quiet} onChange={event => setFilters({ ...filters, quiet: event.target.checked })} />Тихи модели до 22 dB(A)</label>}
            <Link href="/storefront#help" className="rt-selection-help">Каква мощност ми е нужна? <ArrowRight size={16} /></Link>
            </div>
            <div className="rt-selection-options">
            <button className="rt-filter-disclosure" aria-expanded={filtersOpen} aria-controls="rt-product-filters" onClick={() => setFiltersOpen(value => !value)}><SlidersHorizontal size={17} />Филтри<ChevronDown size={16} /></button>
            {(!category || category===1 || category===14) && <label className="rt-install-toggle">
              <input
                type="checkbox"
                checked={installed}
                onChange={(event) => setInstalled(event.target.checked)}
              />
              Цени с монтаж
            </label>}
            <Link href="/storefront#installation">Какво включва монтажът?</Link>
            </div>
          </div>
          <div className="rt-results-toolbar">
          <div className="rt-result-count" aria-live="polite">
            <span>
              {selected.length} {selected.length === 1 ? "продукт" : "продукта"}
              {filters.query ? ` · „${filters.query}“` : ""}
              {filters.quiet ? " · мин. шум до 22 dB(A)" : ""}
            </span>
            {active && (
              <button onClick={() => {store.setFilters(emptyFilters);router.replace(retailPath("/storefront/catalog",runtime));}}>
                Изчисти филтрите <X size={14} />
              </button>
            )}
          </div>
            <label className="rt-sort">
              <SlidersHorizontal size={16} />
              <select
                aria-label="Подредба на климатиците"
                value={sort}
                onChange={(event) => setSort(event.target.value)}
              >
                <option value="selected">По подразбиране</option>
                <option value="low">Цена: възходящо</option>
                <option value="high">Цена: низходящо</option><option value="btu_asc">Мощност: възходящо</option><option value="btu_desc">Мощност: низходящо</option><option value="name_asc">По име</option>
              </select>
            </label>
          </div>
          {active && <div className="rt-active-filters" aria-label="Активни филтри">
            {category>0 && <button onClick={()=>updateUrl({category:""})}>{runtime.categories.find(c=>c.id===category)?.name || "Категория"}<X size={14}/></button>}
            {energy && <button onClick={()=>updateUrl({energy:""})}>{energy}<X size={14}/></button>}
            {available && <button onClick={()=>updateUrl({available:""})}>Само налични<X size={14}/></button>}
            {filters.brand && <button aria-label={`Премахни филтъра за ${filters.brand}`} onClick={() => setFilters({ ...filters, brand: "" })}>{filters.brand}<X size={14} /></button>}
            {filters.capacity > 0 && <button aria-label="Премахни филтъра за мощност" onClick={() => setFilters({ ...filters, capacity: 0 })}>{filters.capacity.toLocaleString("bg-BG")} BTU<X size={14} /></button>}
            {filters.quiet && <button aria-label="Премахни филтъра за шум" onClick={() => setFilters({ ...filters, quiet: false })}>Тихи модели до 22 dB(A)<X size={14} /></button>}
            {filters.query && <button aria-label="Премахни филтъра за търсене" onClick={() => setFilters({ ...filters, query: "" })}>Търсене: {filters.query}<X size={14} /></button>}
            {filters.favourites && <button aria-label="Покажи и незапазените модели" onClick={() => setFilters({ ...filters, favourites: false })}>Любими<X size={14} /></button>}
          </div>}
          {store.compared.length > 0 && <aside className="rt-compare-tray" aria-label="Избрани за сравнение">
            <div><strong>{store.compared.length === 1 ? "Добавете още един модел" : "Модели за сравнение"}</strong><div className="rt-compare-chips">{retailProducts.filter(p => store.compared.includes(p.id)).map(p => <button key={p.id} aria-label={`Премахни ${p.series} от сравнението`} onClick={() => store.toggleCompare(p.id)}>{p.series}<X size={13} /></button>)}</div></div>
            <button className="rt-btn" onClick={store.openCompare} disabled={store.compared.length < 2}><Scale size={18} />Сравни ({store.compared.length})</button>
          </aside>}
          <div className="rt-product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
          {!selected.length && (
            <div className="rt-empty">
              <h3>
                {filters.favourites && !store.favourites.length
                  ? "Нямате запазени модели"
                  : "Няма модели по избраните критерии"}
              </h3>
              <p>
                {filters.favourites && !store.favourites.length
                  ? "Използвайте бутона със сърце до модела, за да го добавите в любими."
                  : "Променете търсенето или изчистете филтрите."}
              </p>
              <button
                className="rt-btn"
                onClick={() => {store.setFilters(emptyFilters);router.replace(retailPath("/storefront/catalog",runtime));}}
              >
                Всички климатици
              </button>
            </div>
          )}
          {pageCount>1 && <nav className="r16-pagination" aria-label="Страници на каталога">{[...new Set([1,currentPage-1,currentPage,currentPage+1,pageCount])].filter(p=>p>=1&&p<=pageCount).map(p=>{const query=new URLSearchParams(params.toString());query.set("page",String(p));return <Link key={p} href={`${retailPath("/storefront/catalog",runtime)}?${query}`} aria-current={p===currentPage?"page":undefined}>{p}</Link>;})}</nav>}
          {!runtime.live && <p className="rt-data-note">
            Демонстрационни цени от каталога към 27.09.2026. Gree Airy 12 е
            проверен повторно на 26.10.2026. Наличността се потвърждава при
            реална поръчка.
          </p>}
        </section>
</div></main>;
}
