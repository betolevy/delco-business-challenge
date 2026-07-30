import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/require-admin";
import { getQuestions, saveQuestions } from "@/lib/store";
import type { Question } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const questions = await getQuestions();
  return NextResponse.json({ questions: [...questions].sort((a, b) => a.order - b.order) });
}

function validate(questions: Question[]): string | null {
  if (!Array.isArray(questions) || questions.length === 0) return "At least one question is required.";
  for (const q of questions) {
    if (!q.id || !q.prompt?.trim()) return "Every case needs an id and a question.";
    if (!q.caseTitle?.trim()) return "Every case needs a case title.";
    if (!q.scenario?.trim()) return `"${q.caseTitle}" needs a scenario.`;
    if (!q.section?.trim()) return `"${q.caseTitle}" needs a section.`;
    if (!Array.isArray(q.options) || q.options.length < 2) return `"${q.caseTitle}" needs at least 2 options.`;
    if (q.options.some((o) => !o.id || !o.label?.trim())) return `"${q.caseTitle}" has an empty option.`;
    if (!q.options.some((o) => o.id === q.correctOptionId)) {
      return `"${q.caseTitle}" has no matching correct option.`;
    }
  }
  return null;
}

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { questions } = (await request.json()) as { questions?: Question[] };
  const error = validate(questions ?? []);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const ordered = (questions as Question[]).map((q, i) => ({ ...q, order: i + 1 }));
  await saveQuestions(ordered);
  return NextResponse.json({ ok: true });
}
