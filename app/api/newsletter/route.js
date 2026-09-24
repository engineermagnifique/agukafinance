import { NextResponse } from "next/server";
import { verifyAltchaPayload } from "@/lib/altcha";
import { subscribeEmail } from "@/lib/newsletter";
import { getRequestLocale } from "@/lib/i18n/server";
import { getDictionaryFor } from "@/lib/i18n/dictionaries";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, limit = 200) {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, limit);
}

export async function POST(request) {
  const locale = getRequestLocale(request);
  const t = getDictionaryFor(locale);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: t.api.invalidBody }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, humans never see them.
  if (clean(body.website, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const captchaOk = await verifyAltchaPayload(clean(body.altcha, 2000));
  if (!captchaOk) {
    return NextResponse.json(
      { error: t.api.captcha },
      { status: 400 }
    );
  }

  const email = clean(body.email, 160);

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      { error: t.api.invalidEmail },
      { status: 400 }
    );
  }

  try {
    await subscribeEmail(email, locale);
  } catch (error) {
    console.error("[newsletter] failed to save subscriber", error);
    return NextResponse.json(
      { error: t.api.subscribeFailed },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
