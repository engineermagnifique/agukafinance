"use server";

import { redirect } from "next/navigation";
import { removeSubscriber, verifyUnsubscribeToken } from "@/lib/newsletter";

export async function unsubscribeAction(formData) {
  const email = String(formData.get("email") || "");
  const token = String(formData.get("token") || "");

  if (!verifyUnsubscribeToken(email, token)) {
    redirect("/unsubscribe?status=invalid");
  }

  try {
    await removeSubscriber(email);
  } catch (error) {
    console.error("[newsletter] unsubscribe failed:", error.message);
    redirect("/unsubscribe?status=invalid");
  }
  redirect("/unsubscribe?status=done");
}
