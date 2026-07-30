import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/require-admin";
import { getAllEntries } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await getAllEntries();
  return NextResponse.json({ entries });
}
