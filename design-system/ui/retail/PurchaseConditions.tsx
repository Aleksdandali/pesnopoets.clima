import { Banknote, ChevronDown, ShieldCheck, Truck } from "lucide-react";

export default function PurchaseConditions({ installed, isAiry, warranty }: { installed: boolean; isAiry: boolean; warranty?: number }) {
  return <div className="pd-conditions" aria-label="Условия за покупка">
    <details><summary><Truck size={20} /><span><strong>{installed ? "Безплатна доставка с монтаж" : "Доставка във Варна и областта"}</strong><small>{installed ? "За Варна и областта" : "Условията се уточняват при потвърждение"}</small></span><ChevronDown size={16} /></summary><p>{installed ? "Доставката е безплатна при покупка на климатик с монтаж във Варна и областта." : "При покупка без монтаж уточняваме цената и начина на доставка преди потвърждение."} Наличността и датата за доставка се потвърждават по телефона.</p></details>
    <details><summary><ShieldCheck size={20} /><span><strong>{warranty ? `${warranty} месеца гаранция на уреда` : isAiry ? "24 месеца гаранция на уреда" : "Гаранция и сервиз"}</strong><small>{installed ? "12 месеца гаранция на монтажа" : "Съгласно гаранционната карта"}</small></span><ChevronDown size={16} /></summary><p>{isAiry ? "Гаранцията на Gree Airy 12 е 24 месеца при спазване на условията в гаранционната карта." : "Срокът и условията за конкретния модел се потвърждават преди покупка и се описват в гаранционната карта."} {installed && "За монтажа от нашия екип предоставяме 12 месеца гаранция."}</p></details>
    <details><summary><Banknote size={20} /><span><strong>В брой, с карта или по банков път</strong><small>Плащане с карта на място</small></span><ChevronDown size={16} /></summary><p>Можете да платите в брой при доставка или монтаж, по банков път или с карта на място. Онлайн плащане и покупка на изплащане не се предлагат.</p></details>
  </div>;
}
