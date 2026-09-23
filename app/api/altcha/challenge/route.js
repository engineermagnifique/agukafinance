import { NextResponse } from "next/server";
import { altchaChallengeHandler, altchaEnabled } from "@/lib/altcha";

export async function GET(request) {
  if (!altchaEnabled) {
    return NextResponse.json(
      { error: "Captcha is not configured." },
      { status: 503 }
    );
  }

  return altchaChallengeHandler(request);
}
