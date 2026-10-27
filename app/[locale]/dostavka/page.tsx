import { notFound } from 'next/navigation';
import RetailService from '@/design-system/ui/retail/RetailService';
import { retailEnabled } from '@/lib/storefront/catalogue';
export function generateMetadata(){const site=process.env.NEXT_PUBLIC_SITE_URL || 'https://pesnopoets-clima.com';return {title:'Доставка и плащане | Песнопоец Клима',description:'Условия за доставка, монтаж и плащане на климатици във Варна и региона.',alternates:{canonical:`${site}/bg/dostavka`},openGraph:{url:`${site}/bg/dostavka`,title:'Доставка и плащане | Песнопоец Клима'}};}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!retailEnabled(locale))notFound();return <RetailService delivery/>;}
