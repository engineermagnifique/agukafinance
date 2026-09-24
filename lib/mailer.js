import nodemailer from "nodemailer";
import { readFileSync } from "node:fs";
import path from "node:path";
import { siteConfig } from "@/lib/site-config";

const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD || "";

// Referenced as src="cid:<LOGO_CID>" by HTML email templates (see
// lib/lead-email.js) so the logo shows up embedded, not as a broken image
// pointing at a URL that may not be live yet.
export const LOGO_CID = "aguka-logo";

let logoAttachment;
function getLogoAttachment() {
  if (logoAttachment === undefined) {
    try {
      logoAttachment = {
        filename: "logo.png",
        content: readFileSync(path.join(process.cwd(), "public/images/logo.png")),
        cid: LOGO_CID,
      };
    } catch (error) {
      console.error("[mailer] failed to load logo for email:", error.message);
      logoAttachment = null;
    }
  }
  return logoAttachment;
}

// Email notifications (Gmail SMTP via nodemailer, using an App Password —
// https://myaccount.google.com/apppasswords). Leave SMTP_APP_PASSWORD unset
// to skip sending; callers should treat sendMail's return value as
// best-effort and never fail a request just because email didn't go out.
export const mailerEnabled = Boolean(SMTP_USER && SMTP_APP_PASSWORD);

let transporter = null;

function getTransporter() {
  if (!mailerEnabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: SMTP_USER, pass: SMTP_APP_PASSWORD },
    });
  }
  return transporter;
}

export async function sendMail({ to, subject, text, html, replyTo, headers, attachments = [] }) {
  const t = getTransporter();
  if (!t) {
    console.warn("[mailer] SMTP_USER/SMTP_APP_PASSWORD not set — skipping email send.");
    return false;
  }

  const logo = html ? getLogoAttachment() : null;
  const allAttachments = logo ? [logo, ...attachments] : attachments;

  try {
    await t.sendMail({
      from: `"${siteConfig.name}" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
      replyTo,
      headers,
      attachments: allAttachments.length ? allAttachments : undefined,
    });
    return true;
  } catch (error) {
    console.error("[mailer] failed to send email:", error.message);
    return false;
  }
}
