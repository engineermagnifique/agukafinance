import LegalPage from "@/components/ui/legal-page";
import { siteConfig } from "@/lib/site-config";
import { getDictionary } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const { locale, t } = await getDictionary();
  return pageMetadata({
    title: t.meta.accessibilityTitle,
    description: format(t.meta.accessibilityDescription, { name: siteConfig.name }),
    path: "/accessibility",
    locale,
  });
}

export default async function AccessibilityPage() {
  const { t } = await getDictionary();
  return (
    <LegalPage
      t={t}
      content={t.accessibility}
      contactHeading={t.accessibility.contactHeading}
    />
  );
}
