import Image from "next/image";
import { brandLogo } from "@/lib/brand-logos";

interface BrandLogoProps {
  name: string;
  /** Height (and any extra) classes for the logo image, e.g. "h-8". */
  className?: string;
  /** Classes for the text wordmark used when a brand has no logo file. */
  textClassName?: string;
}

/** Official logo of a manufacturer, or its name as a wordmark when there is no logo. */
export default function BrandLogo({
  name,
  className = "h-8",
  textClassName = "text-lg font-bold uppercase tracking-tight text-foreground/85",
}: BrandLogoProps) {
  const logo = brandLogo(name);
  if (!logo) return <span className={textClassName}>{name}</span>;
  return (
    <Image
      src={logo.src}
      alt={name}
      width={logo.width}
      height={logo.height}
      // Small vector/PNG files served as-is; the optimizer would rasterize the SVGs.
      unoptimized
      className={`w-auto max-w-full object-contain ${className}`}
    />
  );
}
