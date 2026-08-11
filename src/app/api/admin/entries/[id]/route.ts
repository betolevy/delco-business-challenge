import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/require-admin";
import { deleteLeaderboardEntry } from "@/lib/store";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = await deleteLeaderboardEntry(id);

  if (!deleted) {
    return NextResponse.json({ error: "Entry not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
