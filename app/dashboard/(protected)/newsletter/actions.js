"use server";

import { revalidatePath } from "next/cache";
import { getAdminSession } from "@/lib/session";
import { listSubscribers, recordCampaign, unsubscribeUrl } from "@/lib/newsletter";
import { buildNewsletterEmail } from "@/lib/newsletter-email";
import { mailerEnabled, sendMail } from "@/lib/mailer";
import { siteConfig } from "@/lib/site-config";

function field(formData, name, limit) {
  return String(formData.get(name) || "").trim().slice(0, limit);
}

// Sends the newsletter to every subscriber, one email each (so addresses
// aren't exposed to each other and each gets their own unsubscribe link).
// Kinyarwanda subscribers get the Kinyarwanda version when one is provided.
export async function sendNewsletterAction(prevState, formData) {
  if (!(await getAdminSession())) {
    return { ok: false, message: "Your session has expired. Please log in again." };
  }

  const subject = field(formData, "subject", 200);
  const body = field(formData, "body", 20000);
  const subjectRw = field(formData, "subjectRw", 200);
  const bodyRw = field(formData, "bodyRw", 20000);
  // Returned with errors so the form can keep the admin's draft.
  const fail = (message) => ({
    ok: false,
    message,
    values: { subject, body, subjectRw, bodyRw },
    at: Date.now(),
  });

  if (!subject || !body) {
    return fail("Please add a subject and a message.");
  }
  if (Boolean(subjectRw) !== Boolean(bodyRw)) {
    return fail(
      "For the Kinyarwanda version, fill in both the subject and the message (or leave both empty)."
    );
  }
  if (!mailerEnabled) {
    return fail("Email sending is not configured (SMTP_USER / SMTP_APP_PASSWORD), so nothing was sent.");
  }

  const subscribers = await listSubscribers();
  if (subscribers.length === 0) {
    return fail("There are no subscribers to send to yet.");
  }

  let sentCount = 0;
  let failedCount = 0;

  for (const subscriber of subscribers) {
    const useRw = subscriber.locale === "rw" && subjectRw && bodyRw;
    const email = buildNewsletterEmail({
      subject: useRw ? subjectRw : subject,
      body: useRw ? bodyRw : body,
      locale: useRw ? "rw" : "en",
      unsubscribeUrl: unsubscribeUrl(subscriber.email),
    });

    const sent = await sendMail({
      to: subscriber.email,
      replyTo: siteConfig.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
      headers: email.headers,
    });
    if (sent) sentCount += 1;
    else failedCount += 1;
  }

  await recordCampaign({
    subject,
    body,
    subjectRw,
    bodyRw,
    recipientCount: subscribers.length,
    sentCount,
    failedCount,
  }).catch((error) => console.error("[newsletter] failed to record campaign:", error.message));

  revalidatePath("/dashboard/newsletter");

  return {
    ok: failedCount === 0,
    message:
      failedCount === 0
        ? `Newsletter sent to ${sentCount} ${sentCount === 1 ? "subscriber" : "subscribers"}.`
        : `Sent to ${sentCount}, but ${failedCount} could not be delivered. Check the server logs for details.`,
    at: Date.now(),
  };
}
