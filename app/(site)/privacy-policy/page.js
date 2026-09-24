import LegalPage from "@/components/ui/legal-page";
import { siteConfig } from "@/lib/site-config";
import { getDictionary } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const { locale, t } = await getDictionary();
  return pageMetadata({
    title: t.meta.privacyTitle,
    description: format(t.meta.privacyDescription, { name: siteConfig.name }),
    path: "/privacy-policy",
    locale,
  });
}

export default async function PrivacyPolicyPage() {
  const { t } = await getDictionary();
  return <LegalPage t={t} content={t.privacy} />;
}
