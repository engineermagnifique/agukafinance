import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { getDictionary } from "@/lib/i18n/server";
import { getSiteUrl } from "@/lib/site-url";
import { shareImage } from "@/lib/seo";
import LanguageProvider from "@/components/i18n/language-provider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata() {
  const { locale, t } = await getDictionary();
  return {
    // Makes the share image URL absolute; see lib/site-url.js.
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${siteConfig.name} | ${t.meta.tagline}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: t.meta.description,
    keywords: [
      "insurance Irving TX",
      "life insurance agent",
      "personal lines insurance",
      "commercial insurance",
      "mortgage broker Texas",
      "tax preparation services",
      "AGUKA Financial Group",
    ],
    authors: [{ name: siteConfig.name }],
    openGraph: {
      type: "website",
      url: "/",
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: t.meta.tagline,
      locale: locale === "rw" ? "rw_RW" : "en_US",
      alternateLocale: locale === "rw" ? ["en_US"] : ["rw_RW"],
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: t.meta.tagline,
      images: [shareImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export const viewport = {
  themeColor: "#011f48",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }) {
  const { locale, t } = await getDictionary();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={montserrat.variable}
    >
      <body
        className="flex min-h-full flex-col bg-white font-sans text-ink antialiased"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only fixed left-3 top-3 z-[100] rounded bg-white px-3.5 py-2.5 text-navy focus:not-sr-only"
        >
          {t.common.skipToContent}
        </a>
        <LanguageProvider locale={locale} dictionary={t}>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
