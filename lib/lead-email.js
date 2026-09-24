import { escapeHtml, emailButton, renderEmailLayout } from "@/lib/email-layout";
import { localeNames } from "@/lib/i18n/config";

function fields(data) {
  return [
    ["Name", `${data.firstName} ${data.lastName}`],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", data.service],
    ["Preferred contact", data.preferredContact],
    data.locale && data.locale !== "en" && ["Language", localeNames[data.locale] || data.locale],
    data.coverageNeeds && ["Coverage needs", data.coverageNeeds],
    data.taxSupport && ["Tax support", data.taxSupport],
    data.message && ["Message", data.message],
  ].filter(Boolean);
}

export function buildLeadEmailText(data) {
  return fields(data)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");
}

export function buildLeadEmailHtml(data) {
  const rows = fields(data)
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #eef0f3;font:600 11px/1.4 Arial,Helvetica,sans-serif;letter-spacing:.04em;text-transform:uppercase;color:#6b7280;width:150px;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
          <td style="padding:12px 0 12px 16px;border-bottom:1px solid #eef0f3;font:400 14px/1.6 Arial,Helvetica,sans-serif;color:#1a2a4a;vertical-align:top;">${escapeHtml(value).replace(/\n/g, "<br>")}</td>
        </tr>`
    )
    .join("");

  return renderEmailLayout({
    eyebrow: "NEW LEAD",
    heading: "New Consultation Request",
    bodyHtml: `
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
                <div style="margin-top:28px;">
                  ${emailButton(`mailto:${data.email}`, `Reply to ${data.firstName}`)}
                </div>`,
    footerHtml: "Submitted via the consultation form on agukafinancial.com",
  });
}
