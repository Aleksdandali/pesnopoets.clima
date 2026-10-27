import { products, type Product } from "./products";

export type RetailProduct = Product & {
  series: string;
  energyClass: string;
  noiseNote?: string;
  databaseId?: number;
  path?: string;
  campaignKey?: string;
  title?: string;
  gallery?: string[];
  availability?: string;
  categoryId?: number;
  warranty?: number;
  orderable?: boolean;
  standardInstallation?: boolean;
};

// Verified public catalogue snapshot, 27 September 2026. Not a live inventory feed.
const originals: RetailProduct[] = products.map((product) => ({
  ...product,
  series: (
    {
      maxcool: "MAXCOOL 12",
      nordic09: "Nordic 09",
      nordic12: "Nordic 12",
      auratsu: "Osaka 09",
    } as Record<string, string>
  )[product.id],
  energyClass: "A++",
}));
export const retailProducts: RetailProduct[] = [
  {
    id: "gree-airy",
    brand: "Gree",
    series: "Airy 12",
    model: "GWH12AVCXD-K6DNA1A",
    btu: 12000,
    area: 24,
    noise: 19,
    noiseNote: "в тих режим",
    energyClass: "A+++",
    price: 768,
    installation: 190,
    image: "/design-system/gree-airy-12.png",
    href: "https://pesnopoets-clima.com/bg/klimatici/gree-airy-gwh12avcxd-k6dna1a",
  },
  {
    id: "mitsubishi-srk20",
    brand: "Mitsubishi Heavy",
    series: "SRK20ZS-W",
    model: "SRK20ZS-W / SRC20ZS-W",
    btu: 7000,
    area: 17,
    noise: 19,
    energyClass: "A+++",
    price: 875,
    installation: 190,
    image: "/design-system/mitsubishi-srk20.png",
    href: "https://pesnopoets-clima.com/bg/klimatici/mitsubishi-heavy-industries-srk20zs-w-src20zs-w",
  },
  {
    id: "gree-clivia",
    brand: "Gree",
    series: "Clivia 12",
    model: "GWH12AUCXB-K6DNA2A",
    btu: 12000,
    area: 24,
    noise: 25,
    energyClass: "A++",
    price: 654,
    installation: 190,
    image: "/design-system/gree-clivia-12.png",
    href: "https://pesnopoets-clima.com/bg/klimatici/gree-clivia-gwh12aucxb-k6dna2a",
  },
  originals[1],
  {
    id: "gree-pular",
    brand: "Gree",
    series: "Pular 09",
    model: "GWH09AGBXB-K6DNA1A",
    btu: 9000,
    area: 17,
    noise: 21,
    energyClass: "A++",
    price: 540,
    installation: 190,
    image: "/design-system/gree-pular-09.png",
    href: "https://pesnopoets-clima.com/bg/klimatici/gree-pular-gwh09agbxb-k6dna1a",
  },
  originals[0],
  originals[2],
  originals[3],
];
