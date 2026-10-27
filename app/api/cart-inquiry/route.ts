import { after, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendInquiryNotification } from '@/lib/telegram';
import { upsertClient } from '@/lib/clients';
import { checkRateLimit, sanitizeInput, isValidPhone, isValidEmail } from '@/lib/security';
import { getCartQuote, validStoreOrigin } from '@/lib/storefront/quote';
import { cents, QuoteError } from '@/lib/storefront/offer';
import { EUR_TO_BGN } from '@/lib/pricing';

/** Prices, identity and installation scope are always resolved on the server. */
export async function POST(request: Request) {
  if (!validStoreOrigin(request)) return NextResponse.json({error:'Forbidden'}, {status:403});
  // Local catalogue review must never create real leads or send notifications.
  if (process.env.RETAIL_READ_ONLY === '1') return NextResponse.json({error:'Изпращането е изключено в този работен преглед.'}, {status:503});
  const limit = await checkRateLimit();
  if (!limit.allowed) return NextResponse.json({error:'Моля, изчакайте и опитайте отново.'}, {status:429,headers:{'Retry-After':String(Math.ceil((limit.resetAt-Date.now())/1000))}});
  let body;
  try { body = await request.json(); } catch { return NextResponse.json({error:'Невалидна заявка.'}, {status:400}); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({error:'Невалидна заявка.'}, {status:400});
  const clean = (value: unknown, max: number) => typeof value === 'string' ? sanitizeInput(value, max) : '';
  const name = clean(body.name,100), phone=clean(body.phone,24), email=clean(body.email,200);
  const comment=clean(body.comment,1000), city=clean(body.city,120), payment=clean(body.payment,100);
  const locale = ['bg','en','ru','ua'].includes(body.locale) ? body.locale : 'bg';
  if (name.length<2 || !isValidPhone(phone) || (email && !isValidEmail(email))) return NextResponse.json({error:'Проверете името, телефона и имейла.'}, {status:400});
  try {
    const quote=await getCartQuote(body.items);
    // The new UI acknowledges an exact EUR quote. Older localized checkout
    // submits a rounded BGN total; preserve that contract during rollout.
    const changed = Number.isFinite(body.expectedTotalEur)
      ? cents(body.expectedTotalEur)!==cents(quote.totalEur)
      : Number.isFinite(body.subtotalBgn) && Math.abs(Math.round(quote.totalEur*EUR_TO_BGN)-body.subtotalBgn)>1;
    if (changed) return NextResponse.json({error:'Цената е променена. Прегледайте актуалната сума преди изпращане.',quote}, {status:409});
    const total=quote.totalEur.toFixed(2);
    const summary=[
      `Общо: ${total} EUR`,
      ...quote.lines.map((line,i)=>`${i+1}. [${line.id}] ${line.title} × ${line.quantity}\nУред: ${line.productEur.toFixed(2)} EUR/бр.; ${line.withInstallation ? `стандартен монтаж: ${line.installationEur.toFixed(2)} EUR/бр.` : 'без монтаж'}; ред: ${line.totalEur.toFixed(2)} EUR.`),
      city ? `Населено място: ${city}` : '', payment ? `Предпочитано плащане: ${payment}` : '', comment ? `Коментар: ${comment}` : '',
      'Наличност, доставка, допълнителни дейности и дата за монтаж подлежат на потвърждение.'
    ].filter(Boolean).join('\n\n');
    const supabase=createAdminClient();
    const clientId=await upsertClient(supabase,{phone,name,email:email||undefined,locale});
    const insertData:Record<string,unknown>={product_id:quote.lines[0].id,name,phone,message:summary,locale,source:'checkout',status:'new'};
    if(email)insertData.email=email;
    if(clientId)insertData.client_id=clientId;
    const {data,error}=await supabase.from('inquiries').insert(insertData).select('id').single();
    if(error||!data) return NextResponse.json({error:'Не успяхме да запазим заявката. Опитайте отново или се свържете с нас.'},{status:503});
    const reference=data.id;
    after(async()=>{
      const notification = await sendInquiryNotification({name,phone,email:email||null,message:`Заявка № ${reference}\n${summary.length>2700 ? summary.slice(0,2700)+'\nПълният списък е в заявката.' : summary}`,productTitle:quote.lines.length===1 ? quote.lines[0].title : `Количка (${quote.lines.length} позиции)`,productPrice:quote.totalEur,locale});
      console.info('[cart-inquiry] notification', { reference, ...notification });
    });
    return NextResponse.json({success:true,reference,totalEur:quote.totalEur},{status:201});
  } catch(error) {
    if(error instanceof QuoteError)return NextResponse.json({error:error.message},{status:400});
    return NextResponse.json({error:'Не успяхме да обработим заявката. Проверете връзката или се свържете с нас.'},{status:503});
  }
}
