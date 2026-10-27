import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { retailProducts } from "../../../data/storefront-products";
import RetailProductPage from "../../../ui/retail/RetailProductPage";
export function generateStaticParams() {
  return retailProducts.map((product) => ({ id: product.id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = retailProducts.find((p) => p.id === id);
  return {
    title: product
      ? `${product.brand} ${product.series} | Песнопоец Клима`
      : "Моделът не е намерен",
    description: product
      ? `Инверторен климатик ${product.brand} ${product.series}, ${product.btu.toLocaleString("bg-BG")} BTU. Характеристики, цена и вариант със стандартен монтаж във Варна и региона.`
      : "Разгледайте климатиците в каталога на Песнопоец Клима.",
  };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = retailProducts.find((p) => p.id === id);
  if (!product) notFound();
  return <RetailProductPage key={product.id} product={product} />;
}
