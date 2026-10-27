import RetailAnalytics from "./RetailAnalytics";
import { getRetailCatalogue } from '@/lib/storefront/catalogue';
import { RetailRuntime } from '@/design-system/ui/retail/RetailRuntime';
import StoreProvider from '@/design-system/ui/retail/StoreProvider';
import { RetailHeader, RetailFooter } from '@/design-system/ui/retail/RetailShell';
import '@/design-system/ui/tokens.css';
import '@/design-system/ui/components.css';
import '@/design-system/ui/retail/retail.css';
import '@/design-system/ui/retail/campaign-banners.css';
import '@/design-system/ui/retail/retail-refinement.css';
import '@/design-system/ui/retail/product-stories.css';
import '@/design-system/ui/retail/retail-usability.css';
import '@/design-system/ui/retail/product-detail.css';
import '@/design-system/ui/retail/retail-14.css';
import '@/design-system/ui/retail/campaign-15.css';
import '@/design-system/ui/retail/retail-16.css';
import '@/design-system/ui/retail/retail-foundation.css';

export default async function PublicRetailLayout({children}:{children:React.ReactNode}) {
 const catalogue=await getRetailCatalogue();
 return <div className="pc-theme"><RetailRuntime {...catalogue} live readOnly={process.env.RETAIL_READ_ONLY==='1'}><StoreProvider>{process.env.RETAIL_READ_ONLY!=="1"&&<RetailAnalytics/>}<RetailHeader/><div id="main" tabIndex={-1}>{children}</div><RetailFooter/></StoreProvider></RetailRuntime></div>;
}
