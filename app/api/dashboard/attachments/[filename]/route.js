import path from "node:path";
import fs from "node:fs/promises";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/session";

const uploadsDir = path.join(process.cwd(), "data", "uploads");
const CONTENT_TYPES = { ".pdf": "application/pdf", ".png": "image/png", ".jpg": "image/jpeg" };

export async function GET(request, { params }) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename } = await params;
  // Reject path traversal — filenames are server-generated and never nested.
  if (!filename || filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const extension = path.extname(filename).toLowerCase();
  const contentType = CONTENT_TYPES[extension];
  if (!contentType) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const buffer = await fs.readFile(path.join(uploadsDir, filename));
    return new NextResponse(buffer, { headers: { "Content-Type": contentType } });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
