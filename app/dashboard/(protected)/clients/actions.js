"use server";

import { redirect } from "next/navigation";
import {
  updateLeadStatus,
  addLeadNote,
  addLeadEvent,
  getLead,
  formatStatus,
  LEAD_STATUSES,
} from "@/lib/leads";
import { sendMail } from "@/lib/mailer";
import { buildStatusEmail, NOTIFIABLE_STATUSES } from "@/lib/client-status-email";
import { siteConfig } from "@/lib/site-config";

export async function updateLeadStatusAction(formData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!LEAD_STATUSES.includes(status)) {
    throw new Error("Invalid status.");
  }
  const notifyClient = formData.get("notifyClient") === "on";
  const clientMessage = String(formData.get("clientMessage") || "").trim().slice(0, 2000);

  const lead = await getLead(id);
  if (!lead) throw new Error("Client not found.");

  const statusChanged = lead.status !== status;
  if (statusChanged) {
    await updateLeadStatus(id, status);
  }

  // Email the client when their request moves forward (contacted, in
  // progress, done). The admin can opt out per update with the checkbox.
  if (statusChanged && notifyClient && NOTIFIABLE_STATUSES.includes(status)) {
    const email = buildStatusEmail(lead, status, clientMessage);
    const sent = await sendMail({
      to: lead.email,
      replyTo: siteConfig.email,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    await addLeadEvent(
      id,
      "email",
      sent
        ? `Emailed ${lead.email} about the "${formatStatus(status)}" update.${clientMessage ? ` Message: ${clientMessage}` : ""}`
        : `Could not email ${lead.email} about the "${formatStatus(status)}" update (email is not configured or sending failed).`
    );
  }

  redirect(`/dashboard/clients/${id}`);
}

export async function addLeadNoteAction(formData) {
  const id = Number(formData.get("id"));
  const note = String(formData.get("note") || "").trim();
  const nextFollowUpAt = String(formData.get("nextFollowUpAt") || "").trim() || null;
  if (!note) {
    throw new Error("Note is required.");
  }
  await addLeadNote(id, note, nextFollowUpAt);
  redirect(`/dashboard/clients/${id}`);
}
