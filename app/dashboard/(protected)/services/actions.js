"use server";

import { redirect } from "next/navigation";
import { createService, updateService, deleteService, getService, moveService } from "@/lib/services";
import { serviceIconNames } from "@/lib/service-icons";

const CTA_TYPES = ["info", "apply", "accordion", "none"];

function parseForm(formData) {
  const icon = String(formData.get("icon") || "Shield");
  const ctaType = String(formData.get("ctaType") || "info");
  const accordionItems = String(formData.get("accordionItems") || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    icon: serviceIconNames.includes(icon) ? icon : "Shield",
    ctaType: CTA_TYPES.includes(ctaType) ? ctaType : "info",
    ctaLabel: String(formData.get("ctaLabel") || "").trim() || null,
    ctaHref: String(formData.get("ctaHref") || "").trim() || null,
    accordionItems,
    isActive: formData.get("isActive") === "on",
    sortOrder: Number(formData.get("sortOrder")) || 0,
  };
}

export async function createServiceAction(formData) {
  const data = parseForm(formData);
  if (!data.title || !data.description) {
    throw new Error("Title and description are required.");
  }
  await createService(data);
  redirect("/dashboard/services");
}

export async function updateServiceAction(formData) {
  const id = Number(formData.get("id"));
  const data = parseForm(formData);
  if (!data.title || !data.description) {
    throw new Error("Title and description are required.");
  }
  await updateService(id, data);
  redirect("/dashboard/services");
}

export async function deleteServiceAction(formData) {
  const id = Number(formData.get("id"));
  await deleteService(id);
}

export async function toggleServiceActiveAction(formData) {
  const id = Number(formData.get("id"));
  const isActive = formData.get("isActive") === "1";
  const service = await getService(id);
  if (!service) return;
  await updateService(id, { ...service, isActive });
}

export async function moveServiceAction(formData) {
  const id = Number(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  await moveService(id, direction);
}
