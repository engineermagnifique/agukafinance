import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { attachmentMaxBytes } from "@/lib/site-config";

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
const ALLOWED_ATTACHMENT_EXTENSIONS = { "application/pdf": ".pdf", "image/png": ".png", "image/jpeg": ".jpg" };
const uploadsDir = path.join(process.cwd(), "data", "uploads");

function clean(value, limit = 1000) {
  if (typeof value !== "string") return "";
  return value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim().slice(0, limit);
}

async function verifyCaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // No CAPTCHA configured — skip verification.
  if (!token) return false;

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("[consultation-request] captcha verification failed", error);
    return false;
  }
}

async function saveAttachment(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    return { path: null, name: null };
  }

  if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
    throw new Error("Attachments must be a PDF, PNG or JPEG file.");
  }
  if (file.size > attachmentMaxBytes) {
    throw new Error("Attachments must be 5MB or smaller.");
  }

  await fs.mkdir(uploadsDir, { recursive: true });
  const extension = ALLOWED_ATTACHMENT_EXTENSIONS[file.type];
  const storedName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, storedName), buffer);

  return { path: storedName, name: clean(file.name, 200) };
}

export async function POST(request) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const get = (key, limit) => clean(form.get(key)?.toString() ?? "", limit);

  // Honeypot: bots fill hidden fields, humans never see them.
  if (get("website", 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const captchaToken = get("captchaToken", 2000);
  const captchaOk = await verifyCaptcha(captchaToken);
  if (!captchaOk) {
    return NextResponse.json(
      { error: "We could not verify you're human. Please try again." },
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

  try {
    const attachment = await saveAttachment(form.get("attachment"));
    data.attachmentPath = attachment.path;
    data.attachmentName = attachment.name;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  try {
    createLead(data);
  } catch (error) {
    console.error("[consultation-request] failed to save lead", error);
    return NextResponse.json(
      { error: "We could not save your request. Please call us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
