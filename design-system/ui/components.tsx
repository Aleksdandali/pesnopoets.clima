"use client";

import {
  forwardRef,
  useId,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import {
  Check,
  Heart,
  LoaderCircle,
  ShoppingCart,
  Volume2,
  Wrench,
  Maximize2,
} from "lucide-react";
import type { Product } from "../data/products";
import { price } from "../data/products";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "quiet";
  loading?: boolean;
  children: ReactNode;
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        className={`pc-button pc-button-${variant} ${className}`}
      >
        {loading && (
          <LoaderCircle size={18} className="pc-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    );
  },
);

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success" | "warning" | "danger" | "blue";
  children: ReactNode;
}) {
  return <span className={`pc-badge pc-badge-${tone}`}>{children}</span>;
}

export function Field({
  label,
  hint,
  error,
  id: givenId,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
}) {
  const generated = useId();
  const id = givenId || generated;
  return (
    <div className={`pc-field ${error ? "pc-field-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || hint ? `${id}-help` : undefined}
      />
      {(error || hint) && (
        <span id={`${id}-help`} className="pc-field-help">
          {error || hint}
        </span>
      )}
    </div>
  );
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`pc-brand ${compact ? "pc-brand-compact" : ""}`}>
      {/* Existing brand artwork, no substitute mark. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" width="48" height="48" alt="" />
      <span>
        Песнопоец<span className="pc-brand-sub">КЛИМА</span>
      </span>
    </span>
  );
}

export function ProductCard({
  product,
  withInstallation,
  selected,
  favourite,
  onAdd,
  onFavourite,
}: {
  product: Product;
  withInstallation: boolean;
  selected: boolean;
  favourite: boolean;
  onAdd: () => void;
  onFavourite: () => void;
}) {
  return (
    <article className="pc-product" lang="bg">
      <div className="pc-product-top">
        <Badge tone="success">A++</Badge>
        <button
          className="pc-icon-button"
          onClick={onFavourite}
          aria-label={`${favourite ? "Премахни от" : "Добави в"} любими: ${product.model}`}
          aria-pressed={favourite}
        >
          <Heart size={20} fill={favourite ? "currentColor" : "none"} />
        </button>
      </div>
      <a
        className="pc-product-image"
        href={product.href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Виж ${product.brand} ${product.model} на сайта`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={`${product.brand} ${product.model}, вътрешно и външно тяло`}
          width="320"
          height="220"
        />
      </a>
      <div className="pc-product-content">
        <p className="pc-product-kind">Инверторен климатик</p>
        <h3>
          <a href={product.href} target="_blank" rel="noreferrer">
            <span>{product.brand}</span> {product.model}
          </a>
        </h3>
        <div className="pc-product-specs">
          <span>{product.btu.toLocaleString("bg-BG")} BTU</span>
          {product.area && (
            <span>
              <Maximize2 size={13} aria-hidden="true" /> до {product.area} m²
            </span>
          )}
          {product.noise && (
            <span>
              <Volume2 size={13} aria-hidden="true" /> {product.noise} dB
            </span>
          )}
        </div>
        <p className="pc-stock">
          <span aria-hidden="true" /> Наличен
        </p>
        <p className="pc-price">
          {price(product.price + (withInstallation ? product.installation : 0))}
        </p>
        <p className="pc-installation">
          <Wrench size={14} aria-hidden="true" />
          {withInstallation
            ? "Със стандартен монтаж"
            : `+ ${price(product.installation)} стандартен монтаж`}
        </p>
        <Button className="pc-product-buy" onClick={onAdd}>
          {selected ? <Check size={18} /> : <ShoppingCart size={18} />}
          {selected ? "Добавен" : "В количката"}
        </Button>
      </div>
    </article>
  );
}
