'use client';
import {useEffect} from 'react';
import {trackCartSubmit,trackAddToCart,trackPhoneClick} from '@/lib/gtag';
export default function RetailAnalytics(){useEffect(()=>{
 const sent=(event:Event)=>{const {count}=(event as CustomEvent<{count:number}>).detail;if(Number.isSafeInteger(count)&&count>0)trackCartSubmit(count);};
 const add=(event:Event)=>{const {id,title,price}=(event as CustomEvent<{id:number;title:string;price:number}>).detail;if(Number.isSafeInteger(id))trackAddToCart(id,title,price);};
 const contact=(event:MouseEvent)=>{const target=event.target;if(target instanceof Element&&target.closest('a[href^="tel:"]'))trackPhoneClick();};
 window.addEventListener('pc:enquiry-saved',sent);window.addEventListener('pc:add-to-cart',add);
 document.addEventListener('click',contact);
 return()=>{window.removeEventListener('pc:enquiry-saved',sent);window.removeEventListener('pc:add-to-cart',add);document.removeEventListener('click',contact);};
},[]);return null;}
