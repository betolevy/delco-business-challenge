import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/require-admin";
import { getAllEntries } from "@/lib/store";

export const runtime = "nodejs";

function csvEscape(value: string | number): string {
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const entries = await getAllEntries();
  const header = ["Rank", "Name", "Company", "Email", "Score", "Total", "Time (s)", "Submitted at"];
  const rows = entries.map((e, i) => [
    i + 1,
    e.name,
    e.company,
    e.email,
    e.score,
    e.totalQuestions,
    (e.timeMs / 1000).toFixed(1),
    e.createdAt,
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\r\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="legal-challenge-results-${Date.now()}.csv"`,
    },
  });
}
