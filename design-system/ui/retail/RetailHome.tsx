"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Check, ChevronRight, Headphones, MapPin, Phone, ShieldCheck, Wrench } from "lucide-react";
import { buttonVariants } from "../../../components/ui/button";
import { Switch } from "../../../components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from "../../../lib/constants";
import { emptyFilters, useStore } from "./StoreProvider";
import { useRetailRuntime, cataloguePath } from "./RetailRuntime";
import { price } from "../../data/products";
import ProductCard from "./ProductCard";
import { WinterCampaign, SupportingCampaigns } from "./Campaign15";
import Link from "./RetailLink";
import styles from "./RetailHome.module.css";

const questions = [
  ["Каква мощност ми е необходима?", "Препоръчителната площ е ориентировъчна. Изборът зависи и от изолацията, изложението, височината и нуждата от отопление. Свържете се с нас, за да обсъдим Вашето помещение."],
  ["Мога ли да поръчам без монтаж?", "Да. Изберете „Само климатик“ на страницата на модела. Условията и цената на доставката без монтаж се уточняват предварително."],
  ["Как се уговаря датата за монтаж?", "Потвърждаваме наличността и уточняваме адреса, необходимите дейности и удобна дата. При необходимост обсъждаме предварителен оглед."],
  ["Предлагате ли профилактика и сервиз?", "Да, във Варна и региона. Обсъдете с нас модела, състоянието му и необходимото обслужване."],
];
const brandOptions = [
  {name:"Gree",image:"/brands/gree.svg"}, {name:"Daikin",image:"/brands/daikin.svg"},
  {name:"Mitsubishi Heavy",image:"/brands/mitsubishi-heavy.svg"}, {name:"Toshiba",image:"/brands/toshiba.svg"},
  {name:"LG",image:"/brands/lg.svg"}, {name:"Auratsu",image:"/brands/auratsu.png"},
];

export default function RetailHome() {
  const runtime = useRetailRuntime();
  const store = useStore();
  const featured = ["gree-airy","gree-clivia","gree-pular","maxcool"].flatMap(key => {
    const product=runtime.products.find(p=>(p.campaignKey ?? p.id)===key);
    return product ? [product] : [];
  });
  const installationPrices = runtime.products.filter(p=>p.installation>0).map(p=>p.installation);
  const installationFrom = installationPrices.length ? Math.min(...installationPrices) : null;
  const brands = brandOptions.flatMap(brand => {
    const found = runtime.products.find(p=>p.brand.toLowerCase()===brand.name.toLowerCase());
    return found ? [{...brand,name:found.brand}] : [];
  });
  return <main id="rt-content" className={styles.home}>
    <div className="rt-container">
      <WinterCampaign />
      <section className={styles.selection} id="catalog" aria-labelledby="selection-title">
        <div className={styles.selectionHeading}><h2 id="selection-title">Намерете Вашия климатик</h2><Link href="/storefront/catalog">Всички модели <ArrowRight size={18} aria-hidden="true" /></Link></div>
        <div className={styles.categories}>
          {[{capacity:9000,image:"/design-system/gree-pular-09.png",title:"9 000 BTU"},{capacity:12000,image:"/design-system/gree-clivia-12.png",title:"12 000 BTU"},{capacity:18000,image:"/design-system/gree-clivia-12.png",title:"18 000 BTU"}].map(item=><Link key={item.capacity} href={cataloguePath({capacity:item.capacity},runtime)} onClick={()=>store.setFilters({...emptyFilters,capacity:item.capacity})}><img src={item.image} alt="" width="100" height="70" /><span>{item.title}</span><ChevronRight size={17} aria-hidden="true" /></Link>)}
          <Link href={cataloguePath({quiet:true},runtime)} onClick={()=>store.setFilters({...emptyFilters,quiet:true})}><Headphones size={29} aria-hidden="true" /><span>Тихи модели<small>Мин. шум до 22 dB(A)</small></span><ChevronRight size={17} aria-hidden="true" /></Link>
        </div>
      </section>
      <section className={styles.featured} aria-labelledby="featured-title">
        <div className={styles.sectionHeading}><div><h2 id="featured-title">Климатици за Вашия дом</h2><p>Сравнете моделите. Добавете монтаж по желание.</p></div><label id="home-installation-label" className={styles.installSwitch} htmlFor="home-installation"><Switch id="home-installation" checked={store.installed} onCheckedChange={store.setInstalled} />Цени с монтаж</label></div>
        <div className={styles.products} aria-label="Подбрани модели">{featured.map(p=><ProductCard key={p.id} product={p} />)}</div>
        <div className={styles.catalogLink}><Link href="/storefront/catalog" className={buttonVariants({variant:"outline"})}>Разгледайте целия каталог <ArrowRight data-icon="inline-end" /></Link></div>
      </section>
      <div className={styles.campaigns}><SupportingCampaigns /></div>
      <section className={styles.benefits} aria-label="Покупка и обслужване">
        <a href="#help"><Headphones aria-hidden="true" /><span><strong>Помагаме с избора</strong><small>Според помещението и бюджета</small></span></a>
        <Link href="/storefront/installation"><Wrench aria-hidden="true" /><span><strong>Монтаж с ясна цена</strong><small>Уредът и работата са посочени отделно</small></span></Link>
        <a href="#contacts"><MapPin aria-hidden="true" /><span><strong>Близо до Вас</strong><small>Монтаж и сервиз във Варна и областта</small></span></a>
      </section>
      <section className={styles.brands} id="brands" aria-labelledby="brands-title"><h2 id="brands-title">Изберете марка</h2><div>{brands.map(brand=><Link key={brand.name} href={cataloguePath({brand:brand.name},runtime)} onClick={()=>store.setFilters({...emptyFilters,brand:brand.name})}><img src={brand.image} alt={brand.name} width="180" height="44" loading="lazy" /></Link>)}</div></section>
      <section className={styles.installation} id="installation">
        <div className={styles.installPhoto}><img src="/portfolio/01-hero-install-wood-wall.jpg" alt="Монтиран климатик от портфолиото на Песнопоец Клима" width="1200" height="1600" loading="lazy" /><span>От нашето портфолио</span></div>
        <div className={styles.installCopy}><h2>Добрият климатик започва с добър монтаж.</h2><p>Уточняваме помещението, местата за двете тела и условията на обекта. Получавате цена за необходимата работа преди монтажа.</p>
          <div className={styles.included}><div><h3>Стандартен монтаж</h3>{installationFrom !== null && <strong>от {price(installationFrom)}</strong>}<span>отделно от цената на климатика</span></div><ul><li><Check aria-hidden="true" />До 3 m меден тръбен път</li><li><Check aria-hidden="true" />Монтажни материали</li><li><Check aria-hidden="true" />Вакуумиране и пускане</li><li><ShieldCheck aria-hidden="true" />12 месеца гаранция на монтажа</li></ul></div>
          <p className={styles.fineprint}>Допълнителните дейности и датата се уточняват според обекта. Доставката е безплатна при монтаж във Варна и областта.</p>
          <Link className={buttonVariants()} href="/storefront/installation">Вижте условията за монтаж <ArrowRight data-icon="inline-end" /></Link>
        </div>
      </section>
      <section className={styles.help} id="help">
        <div><h2>Нека изберем <br />заедно.</h2><p>Разкажете ни за помещението. Ще обсъдим площта, изолацията и дали климатикът ще бъде основен източник на отопление.</p><a className={styles.phone} href={`tel:${BUSINESS_PHONE_TEL}`}><Phone size={22} aria-hidden="true" />{BUSINESS_PHONE_DISPLAY}</a></div>
        <Accordion>{questions.map(([question,answer],i)=><AccordionItem key={question} value={String(i)}><AccordionTrigger>{question}</AccordionTrigger><AccordionContent>{answer}</AccordionContent></AccordionItem>)}</Accordion>
      </section>
    </div>
  </main>;
}
