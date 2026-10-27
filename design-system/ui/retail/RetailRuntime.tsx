"use client";
import { createContext, useContext, type ReactNode } from "react";
import { retailProducts, type RetailProduct } from "../../data/storefront-products";

type Runtime = { products: RetailProduct[]; live: boolean; readOnly: boolean; categories: { id: number; name: string }[] };
const Context = createContext<Runtime>({ products: retailProducts, live: false, readOnly: true, categories: [] });
export function RetailRuntime({ children, ...value }: Runtime & { children: ReactNode }) {
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useRetailRuntime() { return useContext(Context); }
export function retailPath(path: string, runtime: Runtime): string {
  if (!runtime.live || !path.startsWith("/storefront")) return path;
  const tail = path.slice("/storefront".length);
  if (!tail || tail.startsWith("#")) return `/bg${tail}`;
  if (tail.startsWith("/catalog")) return `/bg/klimatici${tail.slice(8)}`;
  if (tail.startsWith("/cart") || tail.startsWith("/checkout")) return `/bg${tail}`;
  if (tail.startsWith("/installation")) return "/bg/montazh";
  if (tail.startsWith("/delivery")) return "/bg/dostavka";
  const [id, hash] = tail.slice(1).split("#");
  const product = runtime.products.find(p => (p.campaignKey ?? p.id) === id);
  return product?.path ? `${product.path}${hash ? `#${hash}` : ""}` : "/bg/klimatici";
}

export function cataloguePath(filters: {brand?:string;capacity?:number;query?:string;quiet?:boolean;favourites?:boolean}, runtime: Runtime) {
  const query=new URLSearchParams();
  if(filters.brand)query.set("brand",filters.brand);
  if(filters.capacity)query.set("btu",String(filters.capacity));
  if(filters.query)query.set("q",filters.query);
  if(filters.quiet)query.set("quiet","1");
  if(filters.favourites)query.set("saved","1");
  return retailPath("/storefront/catalog",runtime)+(query.size ? `?${query}` : "");
}
