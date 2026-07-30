import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/store";
import { toPublicEntry } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const entries = await getLeaderboard(20);
  return NextResponse.json({ entries: entries.map(toPublicEntry) });
}
