import { NextResponse } from "next/server";
import { verifyAltchaPayload } from "@/lib/altcha";
import { createLead } from "@/lib/leads";
import { sendMail } from "@/lib/mailer";
import { buildLeadEmailHtml, buildLeadEmailText } from "@/lib/lead-email";
import { attachmentMaxBytes, siteConfig } from "@/lib/site-config";
import { getRequestLocale } from "@/lib/i18n/server";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "service",
  "preferredContact",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ATTACHMENT_TYPES = new Set(["application/pdf", "image/png", "image/jpeg"]);

function clean(value, limit = 1000) {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, limit);
}

async function readAttachment(file, t) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return { data: null, name: null, type: null };
  }

  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
    throw new Error(t.form.attachmentType);
  }
  if (file.size > attachmentMaxBytes) {
    throw new Error(t.form.attachmentSize);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return { data: buffer, name: clean(file.name, 200), type: file.type };
}

export async function POST(request) {
  const locale = getRequestLocale(request);
  const t = getDictionaryFor(locale);

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: t.api.invalidBody }, { status: 400 });
  }

  const get = (key, limit) => clean(form.get(key)?.toString() ?? "", limit);

  // Honeypot: bots fill hidden fields, humans never see them.
  if (get("website", 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const captchaPayload = get("altcha", 2000);
  const captchaOk = await verifyAltchaPayload(captchaPayload);
  if (!captchaOk) {
    return NextResponse.json(
      { error: t.api.captcha },
      { status: 400 }
    );
  }

  const data = {
    firstName: get("firstName", 80),
    lastName: get("lastName", 80),
    email: get("email", 160),
    phone: get("phone", 40),
    service: get("service", 200),
    preferredContact: get("preferredContact", 40),
    coverageNeeds: get("coverageNeeds", 1000),
    taxSupport: get("taxSupport", 160),
    message: get("message", 1000) || null,
    consent: form.get("consent") === "true",
    // Status-update emails to this client go out in the language they used.
    locale,
  };

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      return NextResponse.json(
        { error: t.api.required },
        { status: 400 }
      );
    }
  }

  if (!data.consent) {
    return NextResponse.json(
      { error: t.api.consent },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    return NextResponse.json(
      { error: t.api.invalidEmail },
      { status: 400 }
    );
  }

  try {
    const attachment = await readAttachment(form.get("attachment"), t);
    data.attachmentData = attachment.data;
    data.attachmentName = attachment.name;
    data.attachmentType = attachment.type;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const saved = await createLead(data)
    .then(() => true)
    .catch((error) => {
      console.error("[consultation-request] failed to save lead", error);
      return false;
    });

  const emailed = await sendMail({
    to: siteConfig.email,
    replyTo: data.email,
    subject: `New consultation request — ${data.service}`,
    text: buildLeadEmailText(data),
    html: buildLeadEmailHtml(data),
    attachments: data.attachmentData
      ? [{ filename: data.attachmentName, content: data.attachmentData, contentType: data.attachmentType }]
      : undefined,
  });

  // The lead only needs to reach us through one working channel — fail the
  // request only if it made it through neither the database nor email.
  if (!saved && !emailed) {
    return NextResponse.json(
      { error: t.api.sendFailed },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
