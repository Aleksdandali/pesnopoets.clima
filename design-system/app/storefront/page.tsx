import type { Metadata } from "next";
import RetailHome from "../../ui/retail/RetailHome";
export const metadata: Metadata = {
  title: "Климатици и монтаж във Варна | Песнопоец Клима",
  description: "Климатици Gree, Mitsubishi Heavy, TechPoint и Auratsu. Сравнете моделите и изберете вариант със или без стандартен монтаж във Варна и региона.",
};
export default function StorefrontPage() {
  return <RetailHome />;
}
