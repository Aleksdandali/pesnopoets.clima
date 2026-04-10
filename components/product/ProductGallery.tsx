"use client";

import Image from "next/image";
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wind, X } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  title: string;
}

const SWIPE_THRESHOLD = 50;
const SWIPE_DOWN_THRESHOLD = 80;

export default function ProductGallery({
  images,
  title,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Touch state for main gallery
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Touch state for fullscreen
  const fsTouchStartX = useRef<number | null>(null);
  const fsTouchStartY = useRef<number | null>(null);

  // Pinch-to-zoom state
  const [scale, setScale] = useState(1);
  const initialPinchDistance = useRef<number | null>(null);
  const initialScale = useRef(1);

  const hasMultiple = images && images.length > 1;

  // Keyboard navigation
  useEffect(() => {
    if (!isFullscreen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          setIsFullscreen(false);
          setScale(1);
          break;
        case "ArrowLeft":
          if (hasMultiple) {
            setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
            setScale(1);
          }
          break;
        case "ArrowRight":
          if (hasMultiple) {
            setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
            setScale(1);
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, hasMultiple, images?.length]);

  // Lock body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Main gallery touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      if (Math.abs(deltaX) > SWIPE_THRESHOLD && hasMultiple) {
        if (deltaX < 0) {
          setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
        } else {
          setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
        }
      }
      touchStartX.current = null;
      touchStartY.current = null;
    },
    [hasMultiple, images?.length]
  );

  // Fullscreen touch handlers (swipe left/right + swipe down to close + pinch-to-zoom)
  const handleFsTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialPinchDistance.current = Math.hypot(dx, dy);
      initialScale.current = scale;
    } else if (e.touches.length === 1) {
      fsTouchStartX.current = e.touches[0].clientX;
      fsTouchStartY.current = e.touches[0].clientY;
    }
  }, [scale]);

  const handleFsTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && initialPinchDistance.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const newScale = Math.min(
          Math.max(initialScale.current * (currentDistance / initialPinchDistance.current), 1),
          4
        );
        setScale(newScale);
      }
    },
    []
  );

  const handleFsTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      // Reset pinch tracking
      if (initialPinchDistance.current !== null) {
        initialPinchDistance.current = null;
        // If scale is close to 1, snap back
        if (scale < 1.1) {
          setScale(1);
        }
        return;
      }

      if (fsTouchStartX.current === null || fsTouchStartY.current === null) return;

      const deltaX = e.changedTouches[0].clientX - fsTouchStartX.current;
      const deltaY = e.changedTouches[0].clientY - fsTouchStartY.current;

      // Swipe down to close (only if not zoomed)
      if (scale <= 1 && deltaY > SWIPE_DOWN_THRESHOLD && Math.abs(deltaX) < SWIPE_DOWN_THRESHOLD) {
        setIsFullscreen(false);
        setScale(1);
        fsTouchStartX.current = null;
        fsTouchStartY.current = null;
        return;
      }

      // Horizontal swipe for navigation (only if not zoomed)
      if (scale <= 1 && Math.abs(deltaX) > SWIPE_THRESHOLD && hasMultiple) {
        if (deltaX < 0) {
          setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
        } else {
          setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
        }
      }

      fsTouchStartX.current = null;
      fsTouchStartY.current = null;
    },
    [hasMultiple, images?.length, scale]
  );

  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
    setScale(1);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setScale(1);
  }, []);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-muted/50 rounded-2xl flex items-center justify-center text-muted-foreground/20">
        <Wind className="w-12 h-12 sm:w-16 sm:h-16" aria-hidden="true" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {/* Main image */}
        <div
          className="relative aspect-square bg-white border border-border/80 rounded-2xl overflow-hidden group cursor-zoom-in"
          onTouchStart={hasMultiple ? handleTouchStart : undefined}
          onTouchEnd={hasMultiple ? handleTouchEnd : undefined}
          onClick={openFullscreen}
          role="button"
          tabIndex={0}
          aria-label="Open fullscreen gallery"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              openFullscreen();
            }
          }}
        >
          <Image
            src={images[activeIndex]}
            alt={`${title} - ${activeIndex + 1}`}
            fill
            className="object-contain p-4 sm:p-6"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={activeIndex === 0}
          />

          {/* Navigation arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
                }}
                className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/90 shadow-sm border border-border/60 flex items-center justify-center text-foreground hover:bg-white hover:shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
                }}
                className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-white/90 shadow-sm border border-border/60 flex items-center justify-center text-foreground hover:bg-white hover:shadow-md opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Image counter */}
          {hasMultiple && (
            <div className="absolute bottom-3 right-3 bg-foreground/60 text-white text-xs font-medium px-2.5 py-1 rounded-lg backdrop-blur-sm">
              {activeIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {hasMultiple && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
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

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onTouchStart={handleFsTouchStart}
          onTouchMove={handleFsTouchMove}
          onTouchEnd={handleFsTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen image gallery"
        >
          {/* Close button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 z-[51] w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image counter in fullscreen */}
          {hasMultiple && (
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[51] text-white/70 text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </div>
          )}

          {/* Fullscreen navigation arrows */}
          {hasMultiple && (
            <>
              <button
                onClick={() => {
                  setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
                  setScale(1);
                }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-[51] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
                  setScale(1);
                }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[51] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Fullscreen image */}
          <div
            className="relative w-full h-full max-w-[90vw] max-h-[85vh] mx-auto my-auto"
            style={{
              transform: `scale(${scale})`,
              transition: scale === 1 ? "transform 0.2s ease-out" : "none",
            }}
          >
            <Image
              src={images[activeIndex]}
              alt={`${title} - ${activeIndex + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Dot indicators in fullscreen */}
          {hasMultiple && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[51] flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveIndex(i);
                    setScale(1);
                  }}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIndex
                      ? "w-2.5 h-2.5 bg-white"
                      : "w-2 h-2 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
