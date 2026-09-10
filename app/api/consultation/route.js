import { NextResponse } from "next/server";

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "service",
  "preferredContact",
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value, limit = 1000) {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, limit);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields, humans never see them.
  if (clean(body.website, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const data = {
    firstName: clean(body.firstName, 80),
    lastName: clean(body.lastName, 80),
    email: clean(body.email, 160),
    phone: clean(body.phone, 40),
    service: clean(body.service, 160),
    preferredContact: clean(body.preferredContact, 40),
    coverageNeeds: clean(body.coverageNeeds, 1000),
    taxSupport: clean(body.taxSupport, 160),
    consent: body.consent === true,
  };

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }
  }

  if (!data.consent) {
    return NextResponse.json(
      { error: "Please agree to be contacted before submitting." },
      { status: 400 }
    );
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 }
    );
  }

  console.info("[consultation-request]", data);

  return NextResponse.json({ ok: true });
}
