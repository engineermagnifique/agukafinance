"use server";

import { redirect } from "next/navigation";
import { updateLeadStatus, addLeadNote, LEAD_STATUSES } from "@/lib/leads";

export async function updateLeadStatusAction(formData) {
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!LEAD_STATUSES.includes(status)) {
    throw new Error("Invalid status.");
  }
  updateLeadStatus(id, status);
  redirect(`/dashboard/clients/${id}`);
}

export async function addLeadNoteAction(formData) {
  const id = Number(formData.get("id"));
  const note = String(formData.get("note") || "").trim();
  const nextFollowUpAt = String(formData.get("nextFollowUpAt") || "").trim() || null;
  if (!note) {
    throw new Error("Note is required.");
  }
  addLeadNote(id, note, nextFollowUpAt);
  redirect(`/dashboard/clients/${id}`);
}
