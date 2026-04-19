"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";

interface BeforeAfterSliderProps {
  /** Before image URL (or null for placeholder). */
  beforeSrc?: string | null;
  /** After image URL (or null for placeholder). */
  afterSrc?: string | null;
  beforeLabel: string;
  afterLabel: string;
  dragHint?: string;
  /** Alt text for both images (describe the job). */
  alt?: string;
}

/**
 * Draggable Before/After comparison slider.
 *
 * The "before" image is the base layer. The "after" image is clipped with
 * `clip-path: inset()` controlled by a slider position (0–100%).
 * Users drag the vertical divider to reveal more/less of the "after" state.
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel,
  afterLabel,
  dragHint,
  alt,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl border border-border/60 bg-[#f1f5f9] select-none cursor-ew-resize touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-label={`${beforeLabel} / ${afterLabel}`}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(position)}
    >
      {/* BEFORE layer (base) */}
      {beforeSrc ? (
        <Image
          src={beforeSrc}
          alt={`${beforeLabel}${alt ? ` — ${alt}` : ""}`}
          fill
          className="object-cover pointer-events-none"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-500 text-white/80">
          <span className="text-4xl sm:text-6xl font-bold uppercase tracking-[0.2em] opacity-40">
            {beforeLabel}
          </span>
        </div>
      )}

      {/* AFTER layer — clipped */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        {afterSrc ? (
          <Image
            src={afterSrc}
            alt={`${afterLabel}${alt ? ` — ${alt}` : ""}`}
            fill
            className="object-cover pointer-events-none"
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary to-primary-dark text-white">
            <span className="text-4xl sm:text-6xl font-bold uppercase tracking-[0.2em] opacity-60">
              {afterLabel}
            </span>
          </div>
        )}
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-black/60 text-white backdrop-blur-sm">
        {beforeLabel}
      </span>
      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-semibold bg-primary text-white backdrop-blur-sm">
        {afterLabel}
      </span>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)] pointer-events-none"
        style={{ left: `${position}%` }}
      />

      {/* Drag handle */}
      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-foreground border-2 border-white focus:outline-none focus:ring-2 focus:ring-primary touch-none"
        style={{ left: `${position}%` }}
        aria-label="Drag to compare"
        onPointerDown={(e) => {
          e.stopPropagation();
          handlePointerDown(e);
        }}
      >
        <ChevronsLeftRight className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Drag hint — fades out on first interaction */}
      {dragHint && position === 50 && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-medium bg-black/70 text-white backdrop-blur-sm pointer-events-none animate-pulse">
          {dragHint}
        </span>
      )}
    </div>
  );
}
