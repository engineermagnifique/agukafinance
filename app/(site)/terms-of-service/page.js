import LegalPage from "@/components/ui/legal-page";
import { siteConfig } from "@/lib/site-config";
import { getDictionary } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const { locale, t } = await getDictionary();
  return pageMetadata({
    title: t.meta.termsTitle,
    description: format(t.meta.termsDescription, { name: siteConfig.name }),
    path: "/terms-of-service",
    locale,
  });
}

export default async function TermsOfServicePage() {
  const { t } = await getDictionary();
  return <LegalPage t={t} content={t.terms} />;
}
