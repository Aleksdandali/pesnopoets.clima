"use client";
/* eslint-disable @next/next/no-img-element */
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { RetailProduct } from "../../data/storefront-products";

export default function ProductGallery({ product }: { product: RetailProduct }) {
  const images = (product.campaignKey ?? product.id) === "gree-airy" ? [
    { src: "/design-system/airy-12/indoor.jpg", label: "Вътрешно тяло", caption: "Gree Airy · бял цвят" },
    { src: product.image, label: "Комплект", caption: "Вътрешно тяло, външно тяло и дистанционно управление" },
    { src: "/design-system/airy-12/dimensions.jpg", label: "Размери", caption: "Airy 12: Ш 907 × В 292 × Д 200 mm. На схемата: първият модел." },
  ] : (product.gallery?.length ? product.gallery : [product.image]).map((src, index) => ({src, label: `Снимка ${index + 1}`, caption: `${product.brand} ${product.series}`}));
  const [selected, setSelected] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = images[selected];
  function step(direction: number) { setSelected(value => (value + direction + images.length) % images.length); }
  function thumbnails() {
    return <div className="pd-thumbnails" aria-label="Изображения на продукта">
      {images.map((item, index) => <button key={item.src} aria-label={`Покажи: ${item.label}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><img src={item.src} alt="" width={84} height={64} loading="lazy" /><span>{item.label}</span></button>)}
    </div>;
  }
  return <div className="pd-gallery" onKeyDown={event => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); step(event.key === "ArrowLeft" ? -1 : 1); }
  }}>
    <div className="pd-image-stage">
      <span className="pd-gallery-brand">{product.brand} <span>{product.series}</span></span>
      <button className="pd-main-image" aria-label={`Увеличи: ${current.label}`} onClick={() => dialog.current?.showModal()}>
        <img src={current.src} alt={`${product.brand} ${product.series}: ${current.label}`} width={600} height={440} fetchPriority="high" />
        <span><Maximize2 size={16} /> Увеличи снимката</span>
      </button>
      {images.length > 1 && <div className="pd-gallery-pagination"><button aria-label="Предишна снимка" onClick={() => step(-1)}><ChevronLeft size={20} /></button><span>{selected + 1} / {images.length}</span><button aria-label="Следваща снимка" onClick={() => step(1)}><ChevronRight size={20} /></button></div>}
    </div>
    {images.length > 1 && thumbnails()}
    <p className="pd-gallery-caption" aria-live="polite">{current.caption}</p>
    <dialog ref={dialog} className="pd-lightbox" aria-label={`Галерия ${product.brand} ${product.series}`} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <div className="pd-lightbox-content"><header><strong>{product.brand} {product.series}</strong><button aria-label="Затвори галерията" onClick={() => dialog.current?.close()}><X /></button></header>
        <img className="pd-lightbox-image" src={current.src} alt={`${product.brand} ${product.series}: ${current.label}`} width={1200} height={800} />
        <p aria-live="polite">{current.caption}</p>
        {images.length > 1 && <div className="pd-lightbox-controls"><button aria-label="Предишна снимка в галерията" onClick={() => step(-1)}><ChevronLeft /></button>{thumbnails()}<button aria-label="Следваща снимка в галерията" onClick={() => step(1)}><ChevronRight /></button></div>}
      </div>
    </dialog>
  </div>;
}
