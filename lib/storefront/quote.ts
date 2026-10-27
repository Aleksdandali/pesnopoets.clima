import { createPublicClient } from '../supabase/public';
import { parseLines, quoteCart } from './offer';

export async function getCartQuote(input: unknown) {
  const lines = parseLines(input);
  const { data, error } = await createPublicClient().from('products')
    .select('id,title,title_override,manufacturer,price_client,price_override,price_promo,is_promo,btu,category_id,is_active,is_hidden,is_ask,availability')
    .in('id', [...new Set(lines.map(line => line.id))]);
  if (error) throw new Error('Catalogue temporarily unavailable');
  return quoteCart(lines, data ?? []);
}
export function validStoreOrigin(request: Request) {
  const origin = request.headers.get('origin');
  const allowed = ['https://pesnopoets-clima.com','https://www.pesnopoets-clima.com',process.env.NEXT_PUBLIC_SITE_URL];
  if (process.env.VERCEL_URL) allowed.push(`https://${process.env.VERCEL_URL}`);
  if (process.env.NODE_ENV === 'development') allowed.push('http://127.0.0.1:3200','http://localhost:3200');
  return !origin || allowed.includes(origin);
}
