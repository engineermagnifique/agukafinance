import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";
import { getLeadAttachment } from "@/lib/leads";

export async function GET(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const attachment = await getLeadAttachment(Number(id));
  if (!attachment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(attachment.data, {
    headers: {
      "Content-Type": attachment.type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${(attachment.name || "attachment").replace(/"/g, "")}"`,
    },
  });
}
