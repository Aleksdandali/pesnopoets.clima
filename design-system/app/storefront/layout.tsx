import StoreProvider from "../../ui/retail/StoreProvider";
import { RetailHeader, RetailFooter } from "../../ui/retail/RetailShell";
import "../../ui/retail/retail.css";
import "../../ui/retail/campaign-banners.css";
import "../../ui/retail/retail-refinement.css";
import "../../ui/retail/product-stories.css";
import "../../ui/retail/retail-usability.css";
import "../../ui/retail/product-detail.css";
import "../../ui/retail/retail-14.css";
import "../../ui/retail/campaign-15.css";
import "../../ui/retail/retail-16.css";
import "../../ui/retail/retail-foundation.css";
export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <RetailHeader />
      {children}
      <RetailFooter />
    </StoreProvider>
  );
}
