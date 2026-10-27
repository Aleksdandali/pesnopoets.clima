import Link from "next/link";
import { Brand } from "../ui/components";

export default function NotFound() {
  return <main lang="bg" style={{ maxWidth: 660, margin: "80px auto", padding: 24 }}>
    <Link href="/storefront" aria-label="Песнопоец Клима, начало"><Brand /></Link>
    <p style={{ color: "var(--pc-blue)", marginTop: 40 }}>404</p>
    <h1 style={{ fontSize: 30, lineHeight: 1.2 }}>Страницата не е намерена</h1>
    <p style={{ lineHeight: 1.6, margin: "20px 0 28px" }}>Проверете адреса или разгледайте климатиците в нашия каталог.</p>
    <Link className="pc-button pc-button-primary" href="/storefront#catalog">Към каталога</Link>
  </main>;
}
