import { NextResponse } from "next/server";
import { getQuestions, computePercentile } from "@/lib/store";
import { scoreAnswers, buildRecap, type AnswerInput } from "@/lib/scoring";
import { getTier } from "@/lib/tiers";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { answers?: AnswerInput[] };
  const answers = Array.isArray(body.answers) ? body.answers : [];

  const questions = await getQuestions();
  const score = scoreAnswers(questions, answers);
  const percentile = await computePercentile(score);
  const tier = getTier(score, questions.length);
  const recap = buildRecap(questions, answers);

  return NextResponse.json({
    score,
    totalQuestions: questions.length,
    percentile,
    tier,
    recap,
  });
}
