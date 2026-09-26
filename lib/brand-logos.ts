/**
 * Official brand logos in /public/brands. SVGs come from Wikimedia Commons
 * (public domain), the rest from the makers' own sites. Nippon and Techpoint
 * are Bittel house brands without a published logo — they render as text.
 */
export interface BrandLogoFile {
  src: string;
  width: number;
  height: number;
}

const LOGOS: Record<string, BrandLogoFile> = {
  daikin: { src: "/brands/daikin.svg", width: 300, height: 65 },
  mitsubishi: { src: "/brands/mitsubishi-electric.svg", width: 794, height: 242 },
  "mitsubishi heavy": { src: "/brands/mitsubishi-heavy.svg", width: 670, height: 124 },
  gree: { src: "/brands/gree.svg", width: 195, height: 38 },
  aux: { src: "/brands/aux.svg", width: 167, height: 44 },
  toshiba: { src: "/brands/toshiba.svg", width: 800, height: 122 },
  hitachi: { src: "/brands/hitachi.svg", width: 225, height: 36 },
  lg: { src: "/brands/lg.svg", width: 600, height: 275 },
  samsung: { src: "/brands/samsung.svg", width: 7051, height: 1080 },
  atlantic: { src: "/brands/atlantic.svg", width: 210, height: 40 },
  aspen: { src: "/brands/aspen.svg", width: 236, height: 100 },
  general: { src: "/brands/general.png", width: 512, height: 63 },
  kaisai: { src: "/brands/kaisai.png", width: 148, height: 29 },
  auratsu: { src: "/brands/auratsu.png", width: 199, height: 39 },
  "olimpia splendid": { src: "/brands/olimpia-splendid.png", width: 200, height: 49 },
  williams: { src: "/brands/williams.png", width: 783, height: 198 },
};

export function brandLogo(manufacturer: string | null | undefined): BrandLogoFile | null {
  return manufacturer ? LOGOS[manufacturer.trim().toLowerCase()] ?? null : null;
}
