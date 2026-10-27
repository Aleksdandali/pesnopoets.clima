"use client";
/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import Link from "./RetailLink";
import { ArrowRight, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import { retailProducts } from "../../data/storefront-products";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
} from "../../../lib/constants";
import { emptyFilters, productUrl, useStore } from "./StoreProvider";

const airy = retailProducts[0];
const mitsubishi = retailProducts[1];
const maxcool = retailProducts.find((p) => p.id === "maxcool")!;
const entryPrice = Math.min(
  ...retailProducts.map((p) => p.price + p.installation),
);
const assets = "/design-system/campaign-07/";

function Artwork({
  name,
  alt,
  priority = false,
}: {
  name: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <img
      className="pc-art"
      src={`${assets}${name}.webp`}
      alt={alt}
      width="1920"
      height="1080"
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
    />
  );
}
function Action({
  children,
  phone = false,
}: {
  children: React.ReactNode;
  phone?: boolean;
}) {
  return (
    <span className="pc-action">
      {children}
      {phone ? <Phone size={16} /> : <ArrowRight size={18} />}
    </span>
  );
}
function Price({ value, from = false }: { value: number; from?: boolean }) {
  return (
    <strong className="pc-price">
      {from && <small>от </small>}
      {value.toLocaleString("bg-BG")}
      <small> €</small>
    </strong>
  );
}

export function CampaignHero({
  initialSlide = 0,
  controls = true,
  onCatalogChoose,
}: {
  initialSlide?: number;
  controls?: boolean;
  onCatalogChoose?: () => void;
}) {
  const [slide, setSlide] = useState(initialSlide);
  const { setFilters, setInstalled } = useStore();
  const quiet = slide === 1;
  return (
    <div
      className={`pc-campaign ${quiet ? "pc-campaign-quiet" : "pc-campaign-home"}`}
      data-campaign={quiet ? "02-mitsubishi" : "01-home"}
    >
      <Artwork
        name={quiet ? "02-mitsubishi" : "01-home"}
        alt={
          quiet
            ? "Рекламна композиция с Mitsubishi Heavy в спалня"
            : "Рекламна композиция: топъл дом в есенна вечер"
        }
        priority
      />
      <div className="pc-hero-copy" aria-live="polite">
        <span className="pc-eyebrow">
          {quiet
            ? "MITSUBISHI HEAVY INDUSTRIES"
            : "КЛИМАТИЦИ · ВАРНА И РЕГИОНА"}
        </span>
        <h2>
          {quiet ? (
            <>
              ТИХА РАБОТА{" "}
              <br />
              <em>ОТ 19 dB.</em>
            </>
          ) : (
            <>
              КЛИМАТИЦИ
              <br />
              <em>С МОНТАЖ</em>
            </>
          )}
        </h2>
        <p>
          {quiet
            ? "SRK20ZS-W · 7 000 BTU · минимално ниво на шум"
            : "Климатик със стандартен монтаж във Варна и региона."}
        </p>
        <div className="pc-hero-footer">
          <Link
            className="pc-action"
            href={quiet ? productUrl(mitsubishi) : "/storefront/catalog"}
            onClick={() => {
              setInstalled(true);
              if (!quiet) {
                setFilters(emptyFilters);
                onCatalogChoose?.();
              }
            }}
          >
            {quiet ? "Към модела" : "Към каталога"}
            <ArrowRight size={18} />
          </Link>
          <div className="pc-hero-offer">
            <span>{quiet ? "MITSUBISHI HEAVY" : "КЛИМАТИК + МОНТАЖ"}</span>
            <Price
              value={
                quiet ? mitsubishi.price + mitsubishi.installation : entryPrice
              }
              from={!quiet}
            />
            <small>със стандартен монтаж</small>
            {quiet && (
              <small>
                {mitsubishi.price} € уред + {mitsubishi.installation} € монтаж
              </small>
            )}
          </div>
        </div>
      </div>
      {controls && (
        <div className="pc-campaign-pagination" aria-label="Смяна на баннера">
          <button
            type="button"
            aria-label="Предишно предложение"
            onClick={() => setSlide(slide ? 0 : 1)}
          >
            <ChevronLeft size={18} />
          </button>
          <span aria-live="polite">{slide + 1} / 2</span>
          <button
            type="button"
            aria-label="Следващо предложение"
            onClick={() => setSlide(slide ? 0 : 1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}

export function CampaignPromos() {
  const { setInstalled } = useStore();
  return (
    <section className="pc-campaign-grid" aria-label="Климатици и монтаж">
      <Link
        href="/storefront#installation"
        className="pc-ad pc-ad-install"
        data-campaign="03-installation"
      >
        <Artwork
          name="03-installation"
          alt="Рекламна композиция на монтаж на домашен климатик"
        />
        <div className="pc-ad-heading">
          <span className="pc-eyebrow">ВАРНА И РЕГИОНА</span>
          <h2>
            СТАНДАРТЕН
            <br />
            <em>МОНТАЖ</em>
          </h2>
        </div>
        <div className="pc-ad-bottom">
          <Price value={airy.installation} />
          <span className="pc-terms">стандартен монтаж</span>
          <Action>Какво включва</Action>
        </div>
      </Link>
      <Link
        href={productUrl(airy)}
        onClick={() => setInstalled(true)}
        className="pc-ad pc-ad-airy"
        data-campaign="04-gree-airy"
      >
        <Artwork
          name="04-gree-airy"
          alt="Рекламна композиция с Gree Airy 12 в син интериор"
        />
        <div className="pc-ad-heading">
          <span className="pc-eyebrow">GREE · 12 000 BTU</span>
          <h2>
            AIRY <em>12</em>
          </h2>
        </div>
        <div className="pc-energy">
          <strong>A+++</strong>
          <span>при охлаждане</span>
        </div>
        <div className="pc-ad-bottom">
          <Price value={airy.price + airy.installation} />
          <span className="pc-terms">със стандартен монтаж</span>
          <small className="pc-breakdown">
            {airy.price} € уред + {airy.installation} € монтаж
          </small>
          <Action>Към модела</Action>
        </div>
      </Link>
      <Link
        href={productUrl(maxcool)}
        onClick={() => setInstalled(true)}
        className="pc-ad pc-ad-budget"
        data-campaign="05-techpoint"
      >
        <Artwork
          name="05-techpoint"
          alt="Рекламна композиция с TechPoint MAXCOOL 12"
        />
        <div className="pc-ad-heading">
          <span className="pc-eyebrow">TECHPOINT MAXCOOL 12</span>
          <h2>
            КЛИМАТИК
            <br />
            <em>+ МОНТАЖ</em>
          </h2>
        </div>
        <div className="pc-ad-bottom">
          <Price value={maxcool.price + maxcool.installation} />
          <span className="pc-terms">със стандартен монтаж</span>
          <small className="pc-breakdown">
            {maxcool.price} € уред + {maxcool.installation} € монтаж
          </small>
          <Action>Към модела</Action>
        </div>
      </Link>
    </section>
  );
}

export function CampaignServices() {
  return (
    <section
      className="pc-service-campaigns"
      aria-label="Профилактика и избор на климатик"
    >
      <a
        href={`tel:${BUSINESS_PHONE_TEL}`}
        className="pc-ad pc-ad-maintenance"
        data-campaign="06-maintenance"
      >
        <Artwork
          name="06-maintenance"
          alt="Рекламна композиция с почистване на филтър на климатик"
        />
        <div className="pc-service-copy">
          <span className="pc-eyebrow">ПРОФИЛАКТИКА НА КЛИМАТИЦИ</span>
          <h2>
            ПОДГОТОВКА<br />
            <em>ЗА СЕЗОНА</em>
          </h2>
          <p>Свържете се с нас за профилактика на климатика.</p>
          <Action phone>Обадете се</Action>
          <span className="pc-service-phone">{BUSINESS_PHONE_DISPLAY}</span>
        </div>
      </a>
      <Link
        href="/storefront#help"
        className="pc-ad pc-ad-guidance"
        data-campaign="07-guidance"
      >
        <Artwork
          name="07-guidance"
          alt="Рекламна композиция: избор на климатик според дома"
        />
        <div className="pc-service-copy">
          <span className="pc-eyebrow">ПОМОЩ ПРИ ИЗБОРА</span>
          <h2>
            КАК ДА ИЗБЕРЕТЕ
            <br />
            <em>КЛИМАТИК?</em>
          </h2>
          <p>
            Мощност, площ и изолация.
            <br />
            Основните насоки при избора.
          </p>
          <Action>Към насоките</Action>
        </div>
      </Link>
    </section>
  );
}
