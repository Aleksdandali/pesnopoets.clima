// Public storefront snapshot, 2026-09-27. Example prices, not a live sales feed.
export type Product = {
  id: string;
  brand: string;
  model: string;
  btu: number;
  area?: number;
  noise?: number;
  price: number;
  installation: number;
  image: string;
  href: string;
};
export const products: Product[] = [
  {
    id: "maxcool",
    brand: "TechPoint",
    model: "TCP H12 MAXCOOL",
    btu: 12000,
    area: 22,
    price: 315,
    installation: 190,
    image: "/design-system/techpoint-maxcool.png",
    href: "https://pesnopoets-clima.com/bg/klimatici/techpoint-tcp-h12-maxcool",
  },
  {
    id: "nordic09",
    brand: "TechPoint",
    model: "NPT 09 X-PRO NORDIC",
    btu: 9000,
    area: 17,
    noise: 22,
    price: 325,
    installation: 190,
    image: "/design-system/techpoint-nordic-09.png",
    href: "https://pesnopoets-clima.com/bg/klimatici/techpoint-npt-09-x-pro-nordic",
  },
  {
    id: "nordic12",
    brand: "TechPoint",
    model: "NPT 12 X-PRO NORDIC",
    btu: 12000,
    area: 22,
    noise: 22,
    price: 345,
    installation: 190,
    image: "/design-system/techpoint-nordic-12.png",
    href: "https://pesnopoets-clima.com/bg/klimatici/techpoint-npt-12-x-pro-nordic",
  },
  {
    id: "auratsu",
    brand: "Auratsu",
    model: "Osaka ATC-09CLHI / ATC-09CLHO",
    btu: 9000,
    price: 379,
    installation: 190,
    image: "/design-system/auratsu-osaka.jpg",
    href: "https://pesnopoets-clima.com/bg/klimatici/stenen-auratsu-osaka-atc-09clhi-atc-09clho",
  },
];
export const price = (value: number) =>
  new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
