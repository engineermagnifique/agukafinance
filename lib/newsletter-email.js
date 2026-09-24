import { siteConfig } from "@/lib/site-config";
import { normalizeLocale } from "@/lib/i18n/config";
import { escapeHtml, renderEmailLayout, textToHtmlParagraphs } from "@/lib/email-layout";

const copy = {
  en: {
    eyebrow: "NEWSLETTER",
    footer: "You're receiving this email because you subscribed to updates on agukafinancial.com.",
    unsubscribe: "Unsubscribe",
  },
  rw: {
    eyebrow: "AMAKURU YACU",
    footer: "Mwakiriye iyi imeri kubera ko mwiyandikishije kwakira amakuru ku rubuga agukafinancial.com.",
    unsubscribe: "Kwivana ku rutonde",
  },
};

export function buildNewsletterEmail({ subject, body, locale, unsubscribeUrl }) {
  const c = copy[normalizeLocale(locale)];

  const text = `${body.trim()}\n\n— ${siteConfig.name}\n\n${c.footer}\n${c.unsubscribe}: ${unsubscribeUrl}`;

  const html = renderEmailLayout({
    lang: normalizeLocale(locale),
    eyebrow: c.eyebrow,
    heading: subject,
    bodyHtml: textToHtmlParagraphs(body),
    footerHtml: `${escapeHtml(c.footer)} <a href="${escapeHtml(unsubscribeUrl)}" style="color:#f07d1a;">${escapeHtml(c.unsubscribe)}</a>`,
  });

  return {
    subject,
    text,
    html,
    // Lets mail clients show their own one-click "Unsubscribe" button.
    headers: { "List-Unsubscribe": `<${unsubscribeUrl}>` },
  };
}
