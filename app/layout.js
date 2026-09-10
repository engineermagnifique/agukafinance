import { Montserrat } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
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
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.tagline,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.tagline,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport = {
  themeColor: "#011f48",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={montserrat.variable}
    >
      <body className="flex min-h-full flex-col bg-white font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only fixed left-3 top-3 z-[100] rounded bg-white px-3.5 py-2.5 text-navy focus:not-sr-only"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
