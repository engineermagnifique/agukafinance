import HeroSection from "@/components/sections/hero-section";
import ServicesSection from "@/components/sections/services-section";
import TrustBand from "@/components/sections/trust-band";
import ContactSection from "@/components/sections/contact-section";
import NewsletterSection from "@/components/sections/newsletter-section";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Insurance, Mortgage & Tax Services in Irving, TX",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

// Services are managed from the dashboard, so this page always reflects the latest data.
export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialService",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: "Irving",
    addressRegion: "TX",
    postalCode: "75062",
    addressCountry: "US",
  },
  areaServed: "US",
  slogan: siteConfig.tagline,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesSection />
      <TrustBand />
      <ContactSection />
      <NewsletterSection />
    </>
  );
}
