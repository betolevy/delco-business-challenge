import { NextResponse } from "next/server";
import { getQuestions, addLeaderboardEntry, computePercentile } from "@/lib/store";
import { scoreAnswers, type AnswerInput } from "@/lib/scoring";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubmitBody = {
  name?: string;
  company?: string;
  email?: string;
  answers?: AnswerInput[];
  timeMs?: number;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitBody;
  const name = body.name?.trim().slice(0, 100) ?? "";
  const company = body.company?.trim().slice(0, 100) ?? "";
  const email = body.email?.trim().slice(0, 200) ?? "";
  const answers = Array.isArray(body.answers) ? body.answers : [];
  const timeMs = typeof body.timeMs === "number" && body.timeMs >= 0 ? body.timeMs : 0;

  if (!name || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  }

  const questions = await getQuestions();
  const score = scoreAnswers(questions, answers);
  const totalQuestions = questions.length;

  const percentile = await computePercentile(score);

  const entry = await addLeaderboardEntry({
    name,
    company,
    email,
    score,
    totalQuestions,
    timeMs,
  });

  return NextResponse.json({
    score,
    totalQuestions,
    percentile,
    entryId: entry.id,
  });
}
