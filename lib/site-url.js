import { siteConfig } from "@/lib/site-config";

// The public address of this deployment. Social networks fetch the share
// image from this URL, so it must point at wherever the site is actually
// live — set SITE_URL (e.g. https://www.agukafinancial.com) in production.
// On Vercel, the project's production domain is used when SITE_URL is unset.
export function getSiteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return siteConfig.url;
}
