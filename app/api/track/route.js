import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { recordPageView } from "@/lib/visitors";

const VISITOR_COOKIE = "aguka_vid";
const VISITOR_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 300) : "/";
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 500) : "";

  let visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  let isNewVisitor = false;
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    isNewVisitor = true;
  }

  try {
    recordPageView({
      path,
      referrer,
      visitorId,
      userAgent: request.headers.get("user-agent") || "",
    });
  } catch (error) {
    console.error("[track] failed to record page view", error);
  }

  const response = NextResponse.json({ ok: true });
  if (isNewVisitor) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: VISITOR_MAX_AGE,
    });
  }
  return response;
}
