import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/require-admin";
import { getAllEntries, clearLeaderboard } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = await getAllEntries();
  return NextResponse.json({ entries });
}

export async function DELETE(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Deliberately awkward to trigger: this wipes every result at the event,
  // so an accidental request (or a mis-scoped fetch) should never succeed.
  const body = (await request.json().catch(() => ({}))) as { confirm?: string };
  if (body.confirm !== "DELETE ALL") {
    return NextResponse.json(
      { error: 'Confirmation required: send { "confirm": "DELETE ALL" }.' },
      { status: 400 }
    );
  }

  const removed = await clearLeaderboard();
  return NextResponse.json({ ok: true, removed });
}
