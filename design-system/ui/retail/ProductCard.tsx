"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "./RetailLink";
import { Heart, Scale, ShoppingBag, Wifi } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { type RetailProduct } from "../../data/storefront-products";
import { price } from "../../data/products";
import { productUrl, useStore } from "./StoreProvider";
export default function ProductCard({ product }: { product: RetailProduct }) {
  const store = useStore();
  const title = product.title && !product.campaignKey ? product.title : `${product.brand} ${product.series}${product.btu ? `, ${product.btu.toLocaleString("bg-BG")} BTU` : ""}`;
  const installed = store.installed && product.standardInstallation !== false;
  return (
    <article className="rt-product-card">
      <div className="rt-card-badges">
        {product.energyClass && <span className="rt-energy" title="Енергиен клас при охлаждане">
          {product.energyClass}
        </span>}
        {installed && (
          <span className="rt-mount-badge" title="Със стандартен монтаж">
            С МОНТАЖ
          </span>
        )}
      </div>
      <Link
        href={productUrl(product)}
        className="rt-card-image"
        aria-label={`Разгледай ${product.brand} ${product.series}`}
      >
        <img
          src={product.image}
          alt={`${product.brand} ${product.series}`}
          width="320"
          height="230"
          loading="lazy"
        />
      </Link>
      <div className="rt-card-brand">{product.brand}</div>
      <h3>
        <Link href={productUrl(product)}>
          {title}
        </Link>
      </h3>
      <p className="rt-card-specs">{[product.area ? `Препоръчителна площ: до ${product.area} m²` : product.btu ? `${product.btu.toLocaleString("bg-BG")} BTU` : "", product.noise ? `от ${product.noise} dB(A)${product.noiseNote ? ` (${product.noiseNote})` : ""}` : "", product.energyClass ? `${product.energyClass} при охлаждане` : ""].filter(Boolean).join(" · ")}</p>
      {(product.campaignKey ?? product.id) === "gree-airy" && (
        <p className="rt-card-feature">
          <Wifi size={15} aria-hidden="true" />
          Вграден Wi-Fi модул
        </p>
      )}
      {product.availability && <p className="r16-stock" data-available={product.availability === "Наличен"}>{product.availability}</p>}
      <div className="rt-card-price">
        {product.price ? price(product.price + (installed ? product.installation : 0)) : "По запитване"}
        <span>{installed ? "със стандартен монтаж" : "без монтаж"}</span>
      </div>
      <p className="rt-card-breakdown">
        {installed
          ? `${price(product.price)} уред + ${price(product.installation)} монтаж`
          : product.standardInstallation === false ? "Доставка и условия след потвърждение" : `Стандартен монтаж по избор: +${price(product.installation)}`}
      </p>
      <div className="rt-card-actions">
        <div className="rt-card-purchase">
          <Button
            aria-label={`Добави ${product.brand} ${product.series} в количката`}
            disabled={product.orderable === false}
            onClick={() => store.add(product, installed)}
          >
            <ShoppingBag data-icon="inline-start" />
            {product.orderable === false ? "По запитване" : "В количката"}
          </Button>
        </div>
        <div className="rt-card-tools">
          <button
            className="rt-icon"
            aria-label={`${store.favourites.includes(product.id) ? "Премахни от любими" : "Добави в любими"} ${product.series}`}
            aria-pressed={store.favourites.includes(product.id)}
            onClick={() => store.toggleFavourite(product.id)}
          >
            <Heart
              size={21}
              fill={
                store.favourites.includes(product.id) ? "currentColor" : "none"
              }
            />
            <span>Любими</span>
          </button>
          <button
            className="rt-icon"
            aria-label={`Сравни ${product.series}`}
            aria-pressed={store.compared.includes(product.id)}
            onClick={() => store.toggleCompare(product.id)}
          >
            <Scale size={21} />
            <span>Сравни</span>
          </button>
        </div>
      </div>
    </article>
  );
}
