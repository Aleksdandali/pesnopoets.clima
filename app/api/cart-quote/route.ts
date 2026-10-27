import { NextResponse } from 'next/server';
import { getCartQuote, validStoreOrigin } from '@/lib/storefront/quote';
import { QuoteError } from '@/lib/storefront/offer';
import { checkRateLimit } from '@/lib/security';
export async function POST(request: Request) {
  if (!validStoreOrigin(request)) return NextResponse.json({error:'Forbidden'}, {status:403});
  const limit = await checkRateLimit();
  if (!limit.allowed) return NextResponse.json({error:'Моля, изчакайте и опитайте отново.'}, {status:429});
  try {
    let body;
    try { body = await request.json(); } catch { throw new QuoteError('Невалидна заявка.'); }
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new QuoteError('Невалидна заявка.');
    return NextResponse.json(await getCartQuote(body.items), {headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    return NextResponse.json({error:error instanceof QuoteError ? error.message : 'Не успяхме да проверим цените. Опитайте отново.'}, {status:error instanceof QuoteError ? 400 : 503});
  }
}
