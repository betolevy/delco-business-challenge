import { NextResponse } from "next/server";
import { getQuestions } from "@/lib/store";
import { toPublicQuestion } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  const questions = await getQuestions();
  const sorted = [...questions].sort((a, b) => a.order - b.order);
  return NextResponse.json({ questions: sorted.map(toPublicQuestion) });
}
