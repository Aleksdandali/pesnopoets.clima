"use client";
/* eslint-disable @next/next/no-img-element */
import Link from './RetailLink';
import { useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, Minus, Phone, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { price } from '../../data/products';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from '../../../lib/constants';
import { productUrl, useStore } from './StoreProvider';
import { useRetailRuntime } from './RetailRuntime';
import type { QuotedLine } from '../../../lib/storefront/offer';

type Quote = {lines:QuotedLine[];totalEur:number};
function OrderSummary({ checkout=false, quote }: {checkout?:boolean;quote?:Quote|null}) {
 const {products}=useRetailRuntime();
 const store=useStore();
 const equipment=quote ? quote.lines.reduce((n,l)=>n+l.productEur*l.quantity,0) : store.cart.reduce((n,l)=>n+products.find(p=>p.id===l.id)!.price*l.quantity,0);
 const total=quote?.totalEur ?? store.total;
 const installation=total-equipment;
 const withoutInstallation=store.cart.some(l=>!l.installed);
 return <aside className="r14-order-summary"><h2>Вашият избор</h2><dl><div><dt>Продукти</dt><dd>{price(equipment)}</dd></div><div><dt>Стандартен монтаж</dt><dd>{installation>0.001 ? price(installation) : 'Не е избран'}</dd></div><div className="r14-summary-total"><dt>Общо</dt><dd>{price(total)}</dd></div></dl><p className="r14-delivery-note">{withoutInstallation ? 'Доставката без монтаж се уточнява отделно и не е включена в сумата.' : 'Безплатна доставка при монтаж във Варна и областта.'}</p>{!checkout&&<Link className="rt-btn rt-btn-primary" href="/storefront/checkout">Към заявката <ArrowRight size={18}/></Link>}<ul><li><Check size={16}/>Наличността се потвърждава</li><li><Check size={16}/>Монтажът се уговаря предварително</li><li><Check size={16}/>Без онлайн плащане</li></ul><a className="r14-order-phone" href={`tel:${BUSINESS_PHONE_TEL}`}><Phone size={17}/><span>Имате въпрос?<strong>{BUSINESS_PHONE_DISPLAY}</strong></span></a></aside>;
}
function CartLines() {
 const {products}=useRetailRuntime();const store=useStore();
 return <div className="r14-cart-lines">{store.cart.map(line=>{
 const product=products.find(p=>p.id===line.id)!;
 return <article key={line.key} className="r14-cart-line"><Link className="r14-cart-image" href={productUrl(product)} onClick={()=>store.setInstalled(line.installed)}><img src={product.image} alt={`${product.brand} ${product.series}`} width={160} height={130}/></Link><div className="r14-line-details"><span>{product.brand}</span><h2><Link href={productUrl(product)} onClick={()=>store.setInstalled(line.installed)}>{product.series}</Link></h2><p>{product.btu ? `${product.btu.toLocaleString('bg-BG')} BTU · ` : ''}{line.installed ? 'Със стандартен монтаж':'Без монтаж'}</p>{product.standardInstallation!==false&&<label className="r14-line-variant">Комплектация<select aria-label={`Комплектация за ${product.series}`} value={line.installed?'installed':'unit'} onChange={e=>store.changeInstallation(line.key,e.target.value==='installed')}><option value="installed">Със стандартен монтаж</option><option value="unit">Само климатик</option></select></label>}<small>{price(product.price)} уред{line.installed?` + ${price(product.installation)} монтаж`:''} / бр.</small>{product.orderable===false&&<p role="alert">Наличността или цената се е променила. Свържете се с нас.</p>}</div><div className="r14-line-controls"><div className="rt-quantity"><button aria-label={`Намали количеството на ${product.series}`} disabled={line.quantity===1} onClick={()=>store.changeQuantity(line.key,-1)}><Minus size={15}/></button><output aria-label={`Количество на ${product.series}`}>{line.quantity}</output><button aria-label={`Увеличи количеството на ${product.series}`} disabled={line.quantity===10} onClick={()=>store.changeQuantity(line.key,1)}><Plus size={15}/></button></div><strong>{price((product.price+(line.installed?product.installation:0))*line.quantity)}</strong><button className="r14-remove" aria-label={`Премахни ${product.series}`} onClick={()=>store.remove(line.key)}><Trash2 size={15}/>Премахни</button></div></article>;
 })}</div>;
}
function EmptyCart(){return <div className="r14-empty-cart"><ShoppingBag size={48}/><h2>Количката Ви е празна</h2><p>Разгледайте моделите и добавете климатик със или без монтаж.</p><Link className="rt-btn rt-btn-primary" href="/storefront/catalog">Към климатиците <ArrowRight size={18}/></Link></div>;}
export default function RetailCart(){const store=useStore();return <main id="rt-content" className="r14-cart-page"><div className="rt-container"><nav className="r14-breadcrumb"><Link href="/storefront">Начало</Link><span>/</span><span>Количка</span></nav><div className="r14-page-heading"><h1>Вашата количка <span>({store.cart.reduce((n,l)=>n+l.quantity,0)})</span></h1><Link href="/storefront/catalog"><ArrowLeft size={17}/>Продължете разглеждането</Link></div>{store.cart.length?<div className="r14-cart-layout"><div><CartLines/><div className="r14-cart-footnote"><ShoppingBag size={20}/><p>Проверете продуктите, количествата и монтажа. Преди изпращане ще видите пълната заявка.</p></div></div><OrderSummary/></div>:<EmptyCart/>}</div></main>;}

type Fields={name:string;phone:string;city:string;comment:string;payment:string};
export function RetailCheckout(){
 const runtime=useRetailRuntime();const store=useStore();
 const [form,setForm]=useState<Fields>({name:'',phone:'',city:'',comment:'',payment:'При получаване / монтаж'});
 const [errors,setErrors]=useState<Partial<Record<keyof Fields,string>>>({});
 const [review,setReview]=useState(false),[quote,setQuote]=useState<Quote|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[reference,setReference]=useState<string|null>(null);
 const [reviewCart,setReviewCart]=useState('');
 const reviewRef=useRef<HTMLDivElement>(null), submitLock=useRef(false);
 const items=store.cart.map(line=>({id:runtime.products.find(p=>p.id===line.id)?.databaseId,quantity:line.quantity,withInstallation:line.installed}));
 const signature=JSON.stringify(store.cart);
 const changed=review&&reviewCart!==signature;
 function field(key:keyof Fields,value:string){setForm(prev=>({...prev,[key]:value}));setErrors(prev=>({...prev,[key]:undefined}));}
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(submitLock.current)return;
  const next:typeof errors={};
  if(form.name.trim().length<2)next.name='Въведете име (поне 2 знака).';
  if(!/^(\+359|0)\d{8,9}$/.test(form.phone.replace(/[\s\-()]/g,'')))next.phone='Въведете телефон във формат +359… или 0….';
  if(form.city.trim().length<2)next.city='Въведете населено място.';
  setErrors(next);const invalid=Object.keys(next)[0];if(invalid){(event.currentTarget.elements.namedItem(invalid) as HTMLInputElement)?.focus();return;}
  submitLock.current=true;setBusy(true);setError('');
  try{
   if(runtime.live){const response=await fetch('/api/cart-quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Не успяхме да проверим цените.');setQuote(data);}
   setReviewCart(signature);setReview(true);requestAnimationFrame(()=>{reviewRef.current?.focus();reviewRef.current?.scrollIntoView({block:'start',behavior:'smooth'});});
  }catch(e){setError(e instanceof Error?e.message:'Не успяхме да проверим цените. Опитайте отново.');}finally{setBusy(false);submitLock.current=false;}
 }
 async function send(){
  if(!runtime.live||runtime.readOnly||!quote||changed||submitLock.current)return;
  submitLock.current=true;setBusy(true);setError('');
  try{
   const response=await fetch('/api/cart-inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,locale:'bg',items,expectedTotalEur:quote.totalEur})});
   const data=await response.json();
   if(!response.ok){if(response.status===409&&data.quote)setQuote(data.quote);throw new Error(data.error||'Не успяхме да запазим заявката.');}
   if(!data.success||!data.reference)throw new Error('Не получихме потвърждение. Свържете се с нас, преди да изпратите отново.');
   setReference(String(data.reference));store.clear();
   window.dispatchEvent(new CustomEvent('pc:enquiry-saved',{detail:{count:quote.lines.length}}));
  }catch(e){setError(e instanceof Error?e.message:'Не получихме потвърждение. Проверете връзката или се свържете с нас, преди да изпратите отново.');}finally{setBusy(false);submitLock.current=false;}
 }
 return <main id="rt-content" className="r14-cart-page"><div className="rt-container"><nav className="r14-breadcrumb"><Link href="/storefront">Начало</Link><span>/</span><Link href="/storefront/cart">Количка</Link><span>/</span><span>Заявка</span></nav><div className="r14-page-heading"><h1>{reference?'Заявката е получена':review?'Преглед на заявката':'Данни за заявката'}</h1>{!reference&&<Link href="/storefront/cart"><ArrowLeft size={17}/>Обратно в количката</Link>}</div>
 {reference?<div className="r14-enquiry-review" role="status"><CheckCircle2 size={40}/><h2>Благодарим Ви. Заявка № {reference}</h2><p>Ще се свържем с Вас за наличността, доставката и монтажа. Не е извършено онлайн плащане.</p><Link href="/storefront/catalog" className="rt-btn rt-btn-primary">Към каталога</Link></div>:<><ol className="r14-checkout-steps" aria-label="Стъпки"><li><Check size={15}/>Количка</li><li aria-current={!review?'step':undefined}><b>2</b>Данни</li><li aria-current={review?'step':undefined}><b>3</b>Преглед и изпращане</li></ol>{!store.cart.length?<EmptyCart/>:<div className="r14-cart-layout"><div>{error&&<p className="r16-submit-error" role="alert">{error}</p>}{review?<div className="r14-enquiry-review" ref={reviewRef} tabIndex={-1}><div className="r14-review-status"><CheckCircle2 size={30}/><div><h2>Проверете данните преди изпращане</h2><p>{runtime.readOnly?'Работен преглед. Заявката не е изпратена.':'Наличността и датата за доставка и монтаж се потвърждават по телефона.'}</p></div></div><dl><div><dt>Име</dt><dd>{form.name}</dd></div><div><dt>Телефон</dt><dd>{form.phone}</dd></div><div><dt>Населено място</dt><dd>{form.city}</dd></div><div><dt>Предпочитано плащане</dt><dd>{form.payment}</dd></div>{form.comment&&<div><dt>Коментар</dt><dd>{form.comment}</dd></div>}</dl><h2 className="r14-review-products-heading">Избрани продукти</h2>{quote?<div className="r16-quoted-lines">{quote.lines.map(line=><article key={`${line.id}-${line.withInstallation}`}><h3>{line.title}</h3><p>{line.quantity} бр. · {line.withInstallation?`Уред ${price(line.productEur)} + монтаж ${price(line.installationEur)} / бр.`:`Без монтаж · ${price(line.productEur)} / бр.`}</p><strong>{price(line.totalEur)}</strong></article>)}</div>:<CartLines/>}{changed&&<p role="alert" className="r16-submit-error">Количката е променена. Върнете се към данните и проверете заявката отново.</p>}<div className="r16-review-actions"><button className="rt-btn" disabled={busy} onClick={()=>{setReview(false);setQuote(null);}}>Редактирайте данните</button>{runtime.live&&!runtime.readOnly&&<button className="rt-btn rt-btn-primary" disabled={busy||changed} onClick={send}>{busy?<Loader2 size={18}/>:<ArrowRight size={18}/>}Изпратете заявката</button>}</div>{runtime.readOnly&&<p className="rt-demo-note">Изпращането е изключено в този преглед. Данните за контакт остават само в отворената страница.</p>}<p className="rt-demo-note">Информация за обработването на данните: <a href={runtime.live ? "/bg/privacy" : "https://pesnopoets-clima.com/bg/privacy"} target="_blank" rel="noreferrer">Политика за поверителност</a>.</p></div>:<form className="r14-enquiry-form" onSubmit={submit} noValidate><div className="r14-form-intro"><h2>Как да се свържем с Вас?</h2><p>Без регистрация и онлайн плащане. На следващата стъпка проверявате продуктите и общата сума.</p></div><div className="r14-form-grid">{(['name','phone','city'] as const).map(key=><label key={key} className={key==='city'?'r14-wide-field':undefined}>{({name:'Име и фамилия',phone:'Телефон',city:'Населено място'})[key]} <span>*</span><input name={key} type={key==='phone'?'tel':'text'} autoComplete={({name:'name',phone:'tel',city:'address-level2'})[key]} maxLength={key==='phone'?24:100} placeholder={key==='phone'?'+359':undefined} value={form[key]} onChange={e=>field(key,e.target.value)} required aria-invalid={!!errors[key]} aria-describedby={errors[key]?`${key}-error`:undefined}/>{errors[key]&&<small id={`${key}-error`} role="alert">{errors[key]}</small>}</label>)}<label className="r14-wide-field">Допълнителна информация<textarea name="comment" rows={3} maxLength={1000} placeholder="Помещение, условия за монтаж или Ваш въпрос" value={form.comment} onChange={e=>field('comment',e.target.value)}/></label></div><fieldset><legend>Предпочитано плащане</legend>{['При получаване / монтаж','По банков път','С карта на място'].map(value=><label key={value}><input type="radio" name="payment" checked={form.payment===value} onChange={()=>field('payment',value)}/>{value}</label>)}</fieldset>{runtime.readOnly&&<div className="r14-preview-notice"><strong>Работен преглед</strong><p>Данните за контакт не се изпращат. Проверяват се само цените на избраните продукти.</p></div>}<button className="rt-btn rt-btn-primary" type="submit" disabled={busy}>{busy?<Loader2 size={18}/>:<ArrowRight size={18}/>}Преглед на заявката</button></form>}</div><OrderSummary checkout quote={quote}/></div>}</>}
 </div></main>;
}
