import { siteConfig } from "@/lib/site-config";

// Per-page title/description for search results and link previews (Facebook,
// WhatsApp, LinkedIn, X). Next shallow-merges `openGraph`, so the shared
// fields from app/layout.js are repeated here.

// 1200x630 and ~90KB — WhatsApp skips preview images much larger than 300KB.
export const shareImage = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: `${siteConfig.name} — Building and Protecting What Matters Most`,
};

export function pageMetadata({ title, description, path, locale = "en" }) {
  const shareTitle = `${title} | ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      url: path,
      title: shareTitle,
      description,
      locale: locale === "rw" ? "rw_RW" : "en_US",
      alternateLocale: locale === "rw" ? ["en_US"] : ["rw_RW"],
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [shareImage],
    },
  };
}
