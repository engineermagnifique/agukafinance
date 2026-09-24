import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHero from "@/components/ui/page-hero";
import ServicesSection from "@/components/sections/services-section";
import Reveal from "@/components/ui/reveal";
import { siteConfig } from "@/lib/site-config";
import { getDictionary } from "@/lib/i18n/server";
import { format } from "@/lib/i18n/config";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const { locale, t } = await getDictionary();
  return pageMetadata({
    title: t.meta.servicesTitle,
    description: format(t.meta.servicesDescription, { name: siteConfig.name }),
    path: "/services",
    locale,
  });
}

// Services are managed from the dashboard, so this page always reflects the latest data.
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { t } = await getDictionary();

  return (
    <>
      <PageHero
        eyebrow={t.servicesPage.eyebrow}
        title={t.servicesPage.title}
        subtitle={t.servicesPage.subtitle}
        breadcrumb={[{ label: t.nav.home, href: "/" }, { label: t.nav.services }]}
      />
      <ServicesSection />

      <section className="bg-white">
        <Reveal
          as="div"
          className="mx-auto flex max-w-3xl flex-col items-center gap-5 border-t border-gray-100 px-6 py-16 text-center sm:py-20 lg:px-10"
        >
          <h2 className="text-[clamp(24px,3.2vw,32px)] font-bold leading-[1.2] text-navy">
            {t.servicesPage.ctaTitle}
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-muted">{t.servicesPage.ctaText}</p>
          <Link
            href="/#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-br from-brand to-brand-dark py-1.5 pl-6 pr-1.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            {t.common.contactUs}
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight size={16} />
            </span>
          </Link>
        </Reveal>
      </section>
    </>
  );
}
