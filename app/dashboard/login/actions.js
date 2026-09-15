"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  verifyCredentials,
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  REMEMBER_MAX_AGE_SECONDS,
} from "@/lib/auth";

export async function loginAction(prevState, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/dashboard");
  const remember = formData.get("remember") === "on";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  if (!verifyCredentials(email, password)) {
    return { error: "Invalid email or password." };
  }

  const maxAgeSeconds = remember ? REMEMBER_MAX_AGE_SECONDS : SESSION_MAX_AGE_SECONDS;
  const token = createSessionToken(email, maxAgeSeconds * 1000);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSeconds,
  });

  redirect(next.startsWith("/dashboard") ? next : "/dashboard");
}
