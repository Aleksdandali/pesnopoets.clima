"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Wind } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

export default function ProductGallery({
  images,
  title,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted/50 rounded-2xl flex items-center justify-center text-muted-foreground/30">
        <Wind className="w-16 h-16" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square bg-white border border-border/80 rounded-2xl overflow-hidden group">
        <Image
          src={images[activeIndex]}
          alt={`${title} - ${activeIndex + 1}`}
          fill
          className="object-contain p-6"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority={activeIndex === 0}
        />

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 shadow-sm border border-border/60 flex items-center justify-center text-foreground hover:bg-white hover:shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-white/90 shadow-sm border border-border/60 flex items-center justify-center text-foreground hover:bg-white hover:shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-foreground/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 w-16 h-16 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                i === activeIndex
                  ? "border-primary shadow-sm"
                  : "border-border/60 hover:border-primary/40"
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                width={64}
                height={64}
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
