import { siteConfig } from "@/lib/site-config";
import { format, normalizeLocale } from "@/lib/i18n/config";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";
import { escapeHtml, renderEmailLayout, textToHtmlParagraphs } from "@/lib/email-layout";

// Statuses that trigger an email to the client when a lead is moved to them.
export const NOTIFIABLE_STATUSES = ["contacted", "in_progress", "done"];

const copy = {
  en: {
    eyebrow: "REQUEST UPDATE",
    statusLabel: "Current status",
    noteLabel: "Message from our team",
    signoff: "— The {name} team",
    footer: "You're receiving this email because you requested a consultation on agukafinancial.com.",
    statuses: { new: "Received", contacted: "Reviewed", in_progress: "In progress", done: "Completed" },
    contacted: {
      subject: "We've received your request — {name}",
      heading: "We've received your request",
      body: "Hi {firstName}, thank you for reaching out about {service}. A member of our team has reviewed your request and will be in touch with you shortly.",
    },
    in_progress: {
      subject: "Your request is in progress — {name}",
      heading: "Your request is in progress",
      body: "Hi {firstName}, good news — we've started working on your {service} request. We'll keep you updated and reach out if we need anything else from you.",
    },
    done: {
      subject: "Your request is complete — {name}",
      heading: "Your request is complete",
      body: "Hi {firstName}, your {service} request has been completed. Thank you for choosing {name}. If you have any questions, simply reply to this email or call us at {phone}.",
    },
  },
  rw: {
    eyebrow: "AMAKURU KU BUSABE BWAWE",
    statusLabel: "Aho bigeze",
    noteLabel: "Ubutumwa buturutse ku itsinda ryacu",
    signoff: "— Itsinda rya {name}",
    footer: "Mwakiriye iyi imeri kubera ko mwasabye inama ku rubuga agukafinancial.com.",
    statuses: { new: "Bwakiriwe", contacted: "Bwasuzumwe", in_progress: "Burimo gukorwaho", done: "Bwarangiye" },
    contacted: {
      subject: "Twakiriye ubusabe bwanyu — {name}",
      heading: "Twakiriye ubusabe bwanyu",
      body: "Muraho {firstName}, murakoze kutwandikira ku bijyanye na {service}. Umwe mu bagize itsinda ryacu yasuzumye ubusabe bwanyu kandi azabavugisha vuba.",
    },
    in_progress: {
      subject: "Ubusabe bwanyu burimo gukorwaho — {name}",
      heading: "Ubusabe bwanyu burimo gukorwaho",
      body: "Muraho {firstName}, inkuru nziza — twatangiye gukora ku busabe bwanyu bwa {service}. Tuzakomeza kubamenyesha aho bigeze, kandi tuzabavugisha niba hari ikindi dukeneye.",
    },
    done: {
      subject: "Ubusabe bwanyu bwarangiye — {name}",
      heading: "Ubusabe bwanyu bwarangiye",
      body: "Muraho {firstName}, ubusabe bwanyu bwa {service} bwarangiye. Murakoze guhitamo {name}. Niba mufite ikibazo, musubize iyi imeri cyangwa muduhamagare kuri {phone}.",
    },
  },
};

// Lead services are stored as English option values ("Auto, Home"), so
// translate each part for the client's language.
function localizeServiceList(service, locale) {
  const options = getDictionaryFor(locale).options;
  return String(service || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => options[part] || part)
    .join(", ");
}

export function buildStatusEmail(lead, status, note) {
  const locale = normalizeLocale(lead.locale);
  const c = copy[locale];
  const template = c[status];
  if (!template) return null;

  const vars = {
    name: siteConfig.name,
    phone: siteConfig.phone,
    firstName: lead.first_name,
    service: localizeServiceList(lead.service, locale),
  };
  const subject = format(template.subject, vars);
  const heading = format(template.heading, vars);
  const body = format(template.body, vars);
  const statusName = c.statuses[status];
  const signoff = format(c.signoff, vars);
  const cleanNote = String(note || "").trim();

  const text = [
    body,
    "",
    `${c.statusLabel}: ${statusName}`,
    ...(cleanNote ? ["", `${c.noteLabel}:`, cleanNote] : []),
    "",
    signoff,
  ].join("\n");

  const html = renderEmailLayout({
    lang: locale,
    eyebrow: c.eyebrow,
    heading,
    bodyHtml: `
                ${textToHtmlParagraphs(body)}
                <p style="margin:18px 0;font:600 13px/1.4 Arial,Helvetica,sans-serif;color:#6b7280;">
                  ${escapeHtml(c.statusLabel)}:
                  <span style="display:inline-block;margin-left:6px;padding:4px 10px;border-radius:999px;background:#fff3e8;color:#a94608;">${escapeHtml(statusName)}</span>
                </p>
                ${
                  cleanNote
                    ? `<div style="margin:0 0 18px;padding:16px 18px;border-left:3px solid #f07d1a;background:#f8f9fb;">
                  <p style="margin:0 0 8px;font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;">${escapeHtml(c.noteLabel)}</p>
                  ${textToHtmlParagraphs(cleanNote)}
                </div>`
                    : ""
                }
                <p style="margin:0;font:600 14px/1.6 Arial,Helvetica,sans-serif;color:#011f48;">${escapeHtml(signoff)}</p>`,
    footerHtml: escapeHtml(c.footer),
  });

  return { subject, text, html };
}
