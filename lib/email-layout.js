import { siteConfig } from "@/lib/site-config";
import { LOGO_CID } from "@/lib/mailer";

export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
}

// Escapes plain text and turns blank-line-separated blocks into paragraphs,
// keeping single line breaks. Used for admin-written messages.
export function textToHtmlParagraphs(text) {
  return String(text ?? "")
    .trim()
    .split(/\n\s*\n/)
    .map(
      (block) =>
        `<p style="margin:0 0 14px;font:400 14px/1.7 Arial,Helvetica,sans-serif;color:#1a2a4a;">${escapeHtml(block.trim()).replace(/\n/g, "<br>")}</p>`
    )
    .join("");
}

export function emailButton(href, label) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:#f07d1a;color:#ffffff;text-decoration:none;font:600 14px Arial,Helvetica,sans-serif;padding:12px 22px;border-radius:4px;">${escapeHtml(label)}</a>`;
}

// Branded wrapper shared by every email the site sends. `bodyHtml` and
// `footerHtml` must already be escaped.
export function renderEmailLayout({ lang = "en", eyebrow, heading, bodyHtml, footerHtml }) {
  return `<!doctype html>
<html lang="${escapeHtml(lang)}">
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
                ${eyebrow ? `<p style="margin:0 0 4px;font:700 11px/1 Arial,Helvetica,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#f07d1a;">${escapeHtml(eyebrow)}</p>` : ""}
                <h1 style="margin:0 0 20px;font:700 22px/1.3 Arial,Helvetica,sans-serif;color:#011f48;">${escapeHtml(heading)}</h1>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="background:#f8f9fb;padding:20px 32px;border-top:1px solid #eef0f3;">
                <p style="margin:0;font:400 12px/1.6 Arial,Helvetica,sans-serif;color:#6b7280;">
                  ${footerHtml ? `${footerHtml}<br />` : ""}
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
