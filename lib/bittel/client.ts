import type { BittelApiResponse, BittelProduct } from "./types";

const API_BASE = "https://dealers.bittel.bg/bg/api/json_v3";

export async function fetchAllProducts(): Promise<BittelProduct[]> {
  const token = process.env.BITTEL_API_TOKEN;
  if (!token) throw new Error("BITTEL_API_TOKEN is not configured");

  // Fetch first page to get total pages
  const firstPage = await fetchPage(token, 1);
  const totalPages = firstPage.info.pages_count;

  let allProducts = [...firstPage.products];

  // Fetch remaining pages in parallel
  if (totalPages > 1) {
    const pagePromises = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(fetchPage(token, page));
    }
    const pages = await Promise.all(pagePromises);
    for (const page of pages) {
      allProducts = allProducts.concat(page.products);
    }
  }

  // Filter only "Климатици" type
  const klimatici = allProducts.filter(
    (p) => p.type === "Климатици"
  );

  console.log(
    `[Bittel] Fetched ${allProducts.length} total, ${klimatici.length} klimatici from ${totalPages} pages`
  );

  return klimatici;
}

async function fetchPage(
  token: string,
  page: number
): Promise<BittelApiResponse> {
  const url = `${API_BASE}/${token}?page=${page}`;

  const res = await fetch(url, {
    next: { revalidate: 0 },
    headers: {
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(
      `Bittel API error: ${res.status} ${res.statusText} for page ${page}`
    );
  }

  const data: BittelApiResponse = await res.json();
  return data;
}
