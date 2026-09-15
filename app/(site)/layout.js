import SiteHeader from "@/components/layout/site-header";
import SiteFooter from "@/components/layout/site-footer";
import VisitTracker from "@/components/analytics/visit-tracker";
import ScrollProgress from "@/components/ui/scroll-progress";
import CookieConsent from "@/components/ui/cookie-consent";

export default function SiteLayout({ children }) {
  return (
    <>
      <VisitTracker />
      <ScrollProgress />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
      <CookieConsent />
    </>
  );
}
