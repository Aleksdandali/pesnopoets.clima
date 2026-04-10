export interface BittelApiInfo {
  i18n: string;
  currency: string;
  products_count: string | number;
  products_per_page: number;
  pages_count: number;
  pages_current: number;
}

export interface BittelFeatureItem {
  name: string;
  value: string;
}

export interface BittelFeatureGroup {
  name: string;
  items: BittelFeatureItem[];
}

export interface BittelTransportPackage {
  name: string;
  packages: Array<{
    height: number;
    width: number;
    length: number;
    weight: number;
    pieces: number;
  }>;
}

export interface BittelProduct {
  id: string;
  group: string;
  group_description: string;
  subgroup: string;
  subgroup_description: string;
  title: string;
  manufacturer: string;
  type: string;
  barcode: string | null;
  color: string | null;
  description: string | null;
  link: string;
  gallery: string[];
  is_promo: number;
  price_client_promo: number | string;
  price_client: string;
  price_dealers: string;
  availability: string;
  stock_size: number | null;
  is_ask: number;
  features: Record<string, BittelFeatureGroup>;
  transport_packages: BittelTransportPackage[];
}

export interface BittelApiResponse {
  info: BittelApiInfo;
  products: BittelProduct[];
}
