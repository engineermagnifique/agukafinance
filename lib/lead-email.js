import { siteConfig } from "@/lib/site-config";
import { LOGO_CID } from "@/lib/mailer";

function fields(data) {
  return [
    ["Name", `${data.firstName} ${data.lastName}`],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Service", data.service],
    ["Preferred contact", data.preferredContact],
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

function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
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

  return `<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#f8f9fb;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 1px 3px rgba(15,28,46,0.08);">
            <tr>
              <td style="background:#011f48;padding:28px 32px;">
                <img src="cid:${LOGO_CID}" width="150" alt="${escapeHtml(siteConfig.name)}" style="display:block;border-radius:8px;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 4px;font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#f07d1a;">NEW LEAD</p>
                <h1 style="margin:0 0 20px;font:700 22px/1.3 Arial,Helvetica,sans-serif;color:#011f48;">New Consultation Request</h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
                <div style="margin-top:28px;">
                  <a href="mailto:${escapeHtml(data.email)}" style="display:inline-block;background:#f07d1a;color:#ffffff;text-decoration:none;font:600 14px Arial,Helvetica,sans-serif;padding:12px 22px;border-radius:4px;">Reply to ${escapeHtml(data.firstName)}</a>
                </div>
              </td>
            </tr>
            <tr>
              <td style="background:#f8f9fb;padding:20px 32px;border-top:1px solid #eef0f3;">
                <p style="margin:0;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#6b7280;">
                  Submitted via the consultation form on agukafinancial.com<br />
                  ${escapeHtml(siteConfig.name)} &middot; ${escapeHtml(siteConfig.address.line1)}, ${escapeHtml(siteConfig.address.line2)} &middot; ${escapeHtml(siteConfig.phone)}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
