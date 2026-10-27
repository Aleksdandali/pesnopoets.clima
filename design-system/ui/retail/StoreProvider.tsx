"use client";
/* eslint-disable @next/next/no-img-element */
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  useMemo,
} from "react";
import Link from "./RetailLink";
import { useSavedList } from "./saved-store";
import {
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  type RetailProduct,
} from "../../data/storefront-products";
import { price } from "../../data/products";
import { useRetailRuntime } from "./RetailRuntime";

type Filters = {
  query: string;
  brand: string;
  capacity: number;
  quiet: boolean;
  favourites: boolean;
};
export const emptyFilters: Filters = {
  query: "",
  brand: "",
  capacity: 0,
  quiet: false,
  favourites: false,
};
export type Line = { key: string; id: string; quantity: number; installed: boolean };
type Store = {
  filters: Filters;
  setFilters: (value: Filters) => void;
  installed: boolean;
  setInstalled: (value: boolean) => void;
  favourites: string[];
  toggleFavourite: (id: string) => void;
  compared: string[];
  toggleCompare: (id: string) => void;
  cart: Line[];
  total: number;
  clear: () => void;
  add: (product: RetailProduct, installed: boolean, quantity?: number) => void;
  changeQuantity: (key: string, delta: number) => void;
  remove: (key: string) => void;
  changeInstallation: (key: string, installed: boolean) => void;
  openCart: () => void;
  openCompare: () => void;
};
const StoreContext = createContext<Store | null>(null);
export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("StoreProvider is required");
  return store;
}
export const productUrl = (product: RetailProduct) =>
  product.path ?? `/storefront/${product.id}`;

export function useOptionalStore() { return useContext(StoreContext); }

export default function StoreProvider({ children }: { children: ReactNode }) {
  const { products: retailProducts, live, readOnly } = useRetailRuntime();
  const {validIds, validCart} = useMemo(() => {
    const knownIds = new Set(retailProducts.map(product => product.id));
function validIds(input: unknown): string[] {
  return Array.isArray(input) ? [...new Set(input.filter((id): id is string => typeof id === "string" && knownIds.has(id)))] : [];
}
function validCart(input: unknown): Line[] {
  if (!Array.isArray(input)) return [];
  const lines = new Map<string, Line>();
  for (const raw of input) {
    const item = raw && typeof raw.id === "number" ? {id:String(raw.id),quantity:raw.quantity,installed:raw.withInstallation === true && retailProducts.find(p=>p.id===String(raw.id))?.standardInstallation !== false} : raw;
    if (!item || typeof item !== "object" || !knownIds.has(item.id) || typeof item.installed !== "boolean" || !Number.isFinite(item.quantity)) continue;
    const key = `${item.id}-${item.installed ? 1 : 0}`;
    const quantity = Math.max(1, Math.min(10, Math.floor(item.quantity)));
    lines.set(key, { key, id: item.id, installed: item.installed, quantity });
  }
  return [...lines.values()];
}

return { validIds, validCart };
}, [retailProducts]);
  const [filters, setFilters] = useState(emptyFilters);
  const [installed, setInstalled] = useState(true);
  const [favourites, setFavourites] = useSavedList(live ? "pc-live-favourites-v1" : "pc-favourites-v1", validIds);
  const [compared, setCompared] = useState<string[]>([]);
  const [cart, setCart] = useSavedList(live ? "pc-live-cart-v1" : "pc-cart-v1", validCart, live ? "pesnopoets-cart-v1" : undefined);
  const [notice, setNotice] = useState("");
  const [noticeTarget, setNoticeTarget] = useState<"cart" | "compare">("cart");
  const cartRef = useRef<HTMLDialogElement>(null);
  const compareRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  const total = cart.reduce((sum, line) => {
    const p = retailProducts.find((p) => p.id === line.id)!;
    return (
      sum + (p.price + (line.installed ? p.installation : 0)) * line.quantity
    );
  }, 0);
  function add(product: RetailProduct, installed: boolean, quantity = 1) {
    if (product.orderable === false) return;
    installed = installed && product.standardInstallation !== false;
    const key = `${product.id}-${installed ? 1 : 0}`;
    const currentQuantity = cart.find((line) => line.key === key)?.quantity ?? 0;
    const requestedQuantity = currentQuantity + quantity;
    setCart((lines) => {
      const existing = lines.find((line) => line.key === key);
      return existing
        ? lines.map((line) =>
            line.key === key
              ? { ...line, quantity: Math.min(10, line.quantity + quantity) }
              : line,
          )
        : [...lines, { key, id: product.id, quantity, installed }];
    });
    if (live && !readOnly && product.databaseId && currentQuantity < 10) window.dispatchEvent(new CustomEvent("pc:add-to-cart", {detail:{id:product.databaseId,title:product.title || `${product.brand} ${product.series}`,price:product.price}}));
    setNoticeTarget("cart");
    setNotice(requestedQuantity > 10
      ? `В количката има 10 бр. ${product.brand} ${product.series}. За по-голямо количество се свържете с нас.`
      : `${product.brand} ${product.series} е добавен в количката.`);
  }
  function changeQuantity(key: string, delta: number) {
    setCart((lines) =>
      lines.map((line) =>
        line.key === key
          ? {
              ...line,
              quantity: Math.max(1, Math.min(10, line.quantity + delta)),
            }
          : line,
      ),
    );
  }
  function changeInstallation(key: string, installed: boolean) {
    const current = cart.find(line => line.key === key);
    if (!current || current.installed === installed || (installed && retailProducts.find(p=>p.id===current.id)?.standardInstallation === false)) return;
    const targetKey = `${current.id}-${installed ? 1 : 0}`;
    const target = cart.find(line => line.key === targetKey);
    if (target && target.quantity + current.quantity > 10) {
      setNoticeTarget("cart");
      setNotice("Общото количество за този вариант надвишава 10 броя. Намалете количеството или се свържете с нас.");
      return;
    }
    setCart(lines => target
      ? lines.filter(line => line.key !== key).map(line => line.key === targetKey ? { ...line, quantity: line.quantity + current.quantity } : line)
      : lines.map(line => line.key === key ? { ...line, key: targetKey, installed } : line));
  }
  function toggleFavourite(id: string) {
    setFavourites((values) =>
      values.includes(id)
        ? values.filter((value) => value !== id)
        : [...values, id],
    );
  }
  function toggleCompare(id: string) {
    if (compared.includes(id))
      setCompared((values) => values.filter((value) => value !== id));
    else if (compared.length < 3) setCompared((values) => [...values, id]);
    else {
      setNoticeTarget("compare");
      setNotice(
        "Можете да сравнявате до 3 модела. Премахнете един, за да добавите друг.",
      );
    }
  }
  const chosen = retailProducts.filter((product) =>
    compared.includes(product.id),
  );
  return (
    <StoreContext.Provider
      value={{
        filters,
        setFilters,
        installed,
        setInstalled,
        favourites,
        toggleFavourite,
        compared,
        toggleCompare,
        cart,
        total,
        clear: () => setCart([]),
        add,
        changeQuantity,
        changeInstallation,
        remove: key => setCart(lines => lines.filter(line => line.key !== key)),
        openCart: () => cartRef.current?.showModal(),
        openCompare: () => compareRef.current?.showModal(),
      }}
    >
      <div className="rt" lang="bg">
        {children}
        <div className="rt-toast" role="status">
          {notice && (
            <div>
              <Check size={18} />
              <span>{notice}</span>
              <button
                onClick={() => {
                  setNotice("");
                  (noticeTarget === "cart" ? cartRef : compareRef).current?.showModal();
                }}
              >
                {noticeTarget === "cart" ? "Към количката" : "Към сравнението"}
              </button>
              <button
                aria-label="Затвори известието"
                onClick={() => setNotice("")}
              >
                <X size={17} />
              </button>
            </div>
          )}
        </div>
        <dialog
          className="rt-dialog"
          ref={cartRef}
          aria-labelledby="rt-cart-title"
        >
          <div className="rt-dialog-title">
            <h2 id="rt-cart-title">Количка</h2>
            <button
              aria-label="Затвори количката"
              onClick={() => cartRef.current?.close()}
            >
              <X />
            </button>
          </div>
          {cart.length ? (
            <>
              <div className="rt-cart-lines">
                {cart.map((line) => {
                  const product = retailProducts.find((p) => p.id === line.id)!;
                  return (
                    <article className="rt-cart-line" key={line.key}>
                      <img src={product.image} alt="" width="90" height="90" />
                      <div>
                        <Link
                          href={productUrl(product)}
                          onClick={() => {
                            setInstalled(line.installed);
                            cartRef.current?.close();
                          }}
                        >
                          {product.brand} {product.series}
                        </Link>
                        <p>
                          {line.installed
                            ? "Със стандартен монтаж"
                            : "Само климатик"}
                        </p>
                        <div className="rt-quantity">
                          <button
                            aria-label={`Намали количеството на ${product.series}`}
                            disabled={line.quantity === 1}
                            onClick={() => changeQuantity(line.key, -1)}
                          >
                            <Minus size={14} />
                          </button>
                          <span>{line.quantity}</span>
                          <button
                            aria-label={`Увеличи количеството на ${product.series}`}
                            disabled={line.quantity === 10}
                            onClick={() => changeQuantity(line.key, 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      <strong>
                        {price(
                          (product.price +
                            (line.installed ? product.installation : 0)) *
                            line.quantity,
                        )}
                      </strong>
                      <button
                        className="rt-icon"
                        aria-label={`Премахни ${product.series}`}
                        onClick={() =>
                          setCart((lines) =>
                            lines.filter((item) => item.key !== line.key),
                          )
                        }
                      >
                        <Trash2 size={18} />
                      </button>
                    </article>
                  );
                })}
              </div>
              <div className="rt-cart-total">
                <span>Общо</span>
                <strong>{price(total)}</strong>
              </div>
              <p className="rt-demo-note">
                {live && !readOnly ? "Потвърждаваме наличността, доставката и монтажа по телефона." : "Работен преглед. Заявки не се изпращат."}
              </p>
              <Link className="rt-btn rt-btn-primary" href="/storefront/cart" onClick={() => cartRef.current?.close()}>Преглед на количката</Link>
              <Link className="rt-btn" href="/storefront/checkout" onClick={() => cartRef.current?.close()}>Към заявката</Link>
            </>
          ) : (
            <div className="rt-empty">
              <ShoppingBag size={34} />
              <h3>Количката е празна</h3>
              <button
                className="rt-btn"
                onClick={() => cartRef.current?.close()}
              >
                Продължете разглеждането
              </button>
            </div>
          )}
        </dialog>
        <dialog
          className="rt-dialog rt-compare-dialog"
          ref={compareRef}
          aria-labelledby="rt-compare-title"
        >
          <div className="rt-dialog-title">
            <h2 id="rt-compare-title">Сравнение на климатици</h2>
            <button
              aria-label="Затвори сравнението"
              onClick={() => compareRef.current?.close()}
            >
              <X />
            </button>
          </div>
          {chosen.length ? (
            <>
              {chosen.length === 3 && <p className="rt-compare-scroll-hint">Плъзнете наляво, за да видите всички модели →</p>}
              <div className="rt-table-scroll" tabIndex={0} role="region" aria-label="Таблица за сравнение на избраните модели">
                <table className="rt-compare-table" data-products={chosen.length}>
                  <thead>
                    <tr>
                      <th>Характеристика</th>
                      {chosen.map((product) => (
                        <th key={product.id}>
                          <img
                            src={product.image}
                            alt=""
                            width="160"
                            height="110"
                          />
                          <Link
                            href={productUrl(product)}
                            onClick={() => compareRef.current?.close()}
                          >
                            {product.brand} {product.series}
                          </Link>
                          <button
                            onClick={() => toggleCompare(product.id)}
                            aria-label={`Премахни от сравнението ${product.series}`}
                          >
                            <X size={16} />
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        "Мощност",
                        (p: RetailProduct) =>
                          `${p.btu.toLocaleString("bg-BG")} BTU`,
                      ],
                      [
                        "Препоръчителна площ",
                        (p: RetailProduct) =>
                          p.area ? `до ${p.area} m²` : "Не е посочена",
                      ],
                      [
                        "Минимално ниво на шум",
                        (p: RetailProduct) =>
                          p.noise ? `${p.noise} dB${p.noiseNote ? ` (${p.noiseNote})` : ""}` : "Не е посочено",
                      ],
                      [
                        "Клас при охлаждане",
                        (p: RetailProduct) => p.energyClass,
                      ],
                      ["Климатик", (p: RetailProduct) => price(p.price)],
                      [
                        "Със стандартен монтаж",
                        (p: RetailProduct) => price(p.price + p.installation),
                      ],
                    ].map(([label, value]) => (
                      <tr key={label as string}>
                        <th scope="row">{label as string}</th>
                        {chosen.map((p) => (
                          <td key={p.id}>
                            {(value as (p: RetailProduct) => string)(p)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="rt-demo-note">
                До 3 модела. Посочената площ е ориентир и зависи от помещението.
              </p>
            </>
          ) : (
            <div className="rt-empty">
              <Heart size={30} />
              <h3>Добавете модели за сравнение</h3>
              <p>Използвайте бутона за сравнение до избрания модел в каталога.</p>
            </div>
          )}
        </dialog>
      </div>
    </StoreContext.Provider>
  );
}
