"use client";
/* eslint-disable @next/next/no-img-element */
import { ArrowRight, Wrench } from "lucide-react";
import { buttonVariants } from "../../../components/ui/button";
import { price } from "../../data/products";
import Link from "./RetailLink";
import { useRetailRuntime } from "./RetailRuntime";
import { useStore } from "./StoreProvider";
import styles from "./Campaign.module.css";

export function WinterCampaign() {
  const { products } = useRetailRuntime();
  const { installed } = useStore();
  const airy = products.find(p => (p.campaignKey ?? p.id) === "gree-airy");
  if (!airy) return null;
  return <section className={styles.hero} aria-labelledby="campaign-heading">
    <div className={styles.scene}><img src="/design-system/campaign-15/winter-airy-final.webp" alt="Рекламна интериорна композиция с Gree Airy по снимка на производителя" width="1983" height="793" fetchPriority="high" /></div>
    <div className={styles.message}>
      <h1 id="campaign-heading">Посрещнете зимата <em>на топло.</em></h1>
      <p>Gree Airy 12. Отопление до −25 °C<br />и управление с вграден Wi-Fi.</p>
      <div className={styles.facts}><span>A+++ при охлаждане</span><span>19 dB(A) в тих режим</span></div>
    </div>
    <div className={styles.brand} aria-hidden="true"><img src="/brands/gree.svg" alt="" width="100" height="30" /><span>AIRY 12</span></div>
    <div className={styles.offer}>
      <div className={styles.price}><strong>{price(airy.price + (installed ? airy.installation : 0))}</strong><span>{installed ? "със стандартен монтаж" : "само климатик"}</span></div>
      <p className={styles.breakdown}>{installed ? `${price(airy.price)} уред + ${price(airy.installation)} монтаж` : `Монтаж по избор: +${price(airy.installation)}`}</p>
      <div className={styles.actions}>
        <Link className={buttonVariants({ variant: "campaign" })} href="/storefront/gree-airy">Разгледайте Airy <ArrowRight data-icon="inline-end" /></Link>
        <Link data-catalog-link className={buttonVariants({ variant: "inverse" })} href="/storefront/catalog">Всички климатици <ArrowRight data-icon="inline-end" /></Link>
      </div>
    </div>
  </section>;
}

export function SupportingCampaigns() {
  const { products } = useRetailRuntime();
  const mitsubishi = products.find(p => (p.campaignKey ?? p.id) === "mitsubishi-srk20");
  const budget = products.find(p => (p.campaignKey ?? p.id) === "maxcool");
  const prices = products.filter(p => p.installation > 0).map(p => p.installation);
  const installFrom = prices.length ? Math.min(...prices) : null;
  const { setInstalled } = useStore();
  return <section className={styles.promos} aria-label="Още предложения за Вашия дом">
    {mitsubishi && <article className={styles.quiet}>
      <img className={styles.quietScene} src="/design-system/campaign-15/quiet-bedroom.webp" alt="Рекламна интериорна композиция на спалня" width="1635" height="962" loading="lazy" />
      <div className={styles.promoCopy}><h2>Тиха работа.<br />Спокойна вечер.</h2><p>Mitsubishi Heavy SRK20ZS-W<br />От 19 dB(A) · 7 000 BTU</p><strong>{price(mitsubishi.price + mitsubishi.installation)}</strong><span>със стандартен монтаж</span><Link href="/storefront/mitsubishi-srk20" onClick={() => setInstalled(true)}>Разгледайте модела <ArrowRight size={18} aria-hidden="true" /></Link></div>
      <img className={styles.quietProduct} src="/design-system/campaign-15/mitsubishi-cutout.webp" alt="Mitsubishi Heavy SRK20ZS-W" width="2172" height="724" loading="lazy" />
    </article>}
    {budget && <article className={styles.value}>
      <div className={styles.promoCopy}><h2>Климатик със<br />стандартен монтаж.</h2><p>TechPoint MAXCOOL 12<br />12 000 BTU</p><strong>{price(budget.price + budget.installation)}</strong><span>{price(budget.price)} уред + {price(budget.installation)} монтаж</span><Link href="/storefront/maxcool" onClick={() => setInstalled(true)}>Вижте комплекта <ArrowRight size={18} aria-hidden="true" /></Link></div>
      <img className={styles.valueProduct} src={budget.image} alt="Комплект TechPoint MAXCOOL 12" width="800" height="800" loading="lazy" />
    </article>}
    <article className={styles.install}><Wrench size={30} aria-hidden="true" /><div><h2>Монтаж във Варна<br />и областта</h2><p>Тръбен път до 3 m, <br />материали и пускане.</p>{installFrom !== null && <strong>от {price(installFrom)}</strong>}<Link href="/storefront/installation">Какво включва <ArrowRight size={18} aria-hidden="true" /></Link></div></article>
  </section>;
}
