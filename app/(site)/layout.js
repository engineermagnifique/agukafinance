import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";

export default function SiteLayout({ children }) {
  return (
    <>
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </>
  );
}
