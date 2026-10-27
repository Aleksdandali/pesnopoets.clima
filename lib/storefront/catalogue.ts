import { cache } from "react";
import { unstable_cache } from "next/cache";
import { createPublicClient } from "../supabase/public";
import { productPrice, installationPrice, supportsStandardInstallation, type CatalogueOffer } from "./offer";
import { retailProducts, type RetailProduct } from "../../design-system/data/storefront-products";

type Row = CatalogueOffer & { slug: string; gallery?: string[]; energy_class?: string; area_m2?: number; noise_db_indoor?: number; warranty_months?: number };
const campaigns = new Map(retailProducts.map(p => [p.href.split("/").pop(), p]));

export function adaptProduct(row: Row): RetailProduct {
  const campaign = campaigns.get(row.slug);
  const rawBrand = row.manufacturer || "";
  const brand = campaign?.brand || ({techpoint:"TechPoint",hitachi:"Hitachi"}[rawBrand.toLowerCase()] ?? rawBrand);
  const title = row.title_override || row.title;
  const gallery = (row.gallery ?? []).filter(src => typeof src === "string" && /^https?:\/\//.test(src));
  return {
    id: String(row.id), databaseId: row.id, path: `/bg/klimatici/${row.slug}`,
    campaignKey: campaign?.id, brand, title,
    series: campaign?.series || title.replace(/^(Инверторен климатик|Климатик|Хиперинверторен климатик|стенен|подов|канален|касетъчен|колонен)\s*/i, "").replace(new RegExp(`^${brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`, "i"), ""),
    model: campaign?.model || title,
    btu: row.btu || 0, area: row.area_m2 || undefined,
    noise: campaign?.id === "gree-airy" ? 19 : row.noise_db_indoor || undefined,
    noiseNote: campaign?.id === "gree-airy" ? "в тих режим" : undefined,
    energyClass: row.energy_class?.split("/")[0]?.trim().replace(/^-$/, "") || "",
    price: productPrice(row), installation: installationPrice(row),
    image: gallery[0] || campaign?.image || "/design-system/product-placeholder.svg", gallery,
    href: `/bg/klimatici/${row.slug}`, categoryId: row.category_id ?? undefined,
    availability: row.availability || "Наличността се потвърждава по телефона",
    warranty: row.warranty_months || undefined,
    orderable: !row.is_ask && row.availability !== "Неналичен" && productPrice(row) > 0,
    standardInstallation: supportsStandardInstallation(row),
  };
}

const loadCatalogue = unstable_cache(async () => {
  const client = createPublicClient();
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await client.from("products")
      .select("id,slug,title,title_override,manufacturer,price_client,price_override,price_promo,is_promo,is_ask,availability,btu,category_id,gallery,energy_class,area_m2,noise_db_indoor,warranty_months")
      .eq("is_active", true).eq("is_hidden", false).order("id").range(from, from + 999);
    if (error) { console.error("Public catalogue read failed", error.code, error.message); throw new Error("Catalogue temporarily unavailable"); }
    rows.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const { data: categories, error } = await client.from("categories").select("id,subgroup_name,group_name").order("id");
  if (error) throw new Error("Catalogue categories temporarily unavailable");
  const names: Record<number,string> = {1:"Стенни климатици",2:"Подови климатици",3:"Мултисплит: външни тела",4:"Колонни климатици",5:"Мултисплит: вътрешни тела",6:"Канални климатици",7:"Касетъчни климатици",8:"Аксесоари и управление",9:"Професионални външни тела",10:"Таванни климатици",11:"Термопомпи: сплит",12:"Термопомпи: моноблок",13:"Мобилни климатици",14:"Стенни климатици: промоции"};
  return { products: rows.map(row=>adaptProduct({...row,gallery:row.gallery?.slice(0,1)})), categories: (categories ?? []).filter(c => rows.some(p => p.category_id === c.id)).map(c => ({id:c.id, name:names[c.id] || c.subgroup_name})) };
}, ["public-retail-catalogue-v16", process.env.NEXT_PUBLIC_SUPABASE_URL || ""], {revalidate:300,tags:["retail-catalogue"]});
export const getRetailCatalogue = cache(loadCatalogue);

export function retailEnabled(locale: string) { return locale === "bg" && process.env.STOREFRONT_V2 === "1"; }
