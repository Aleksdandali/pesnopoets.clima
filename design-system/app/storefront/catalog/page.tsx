import { Suspense } from "react";
import RetailCatalog from "../../../ui/retail/RetailCatalog";
export const metadata = { title: "Климатици | Песнопоец Клима" };
export default function Page() { return <Suspense fallback={null}><RetailCatalog /></Suspense>; }
