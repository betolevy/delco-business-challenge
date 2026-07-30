import type { Question, QuestionOption } from "@/lib/types";

export type AnswerInput = { questionId: string; optionId: string };

export function scoreAnswers(questions: Question[], answers: AnswerInput[]): number {
  const byId = new Map(questions.map((q) => [q.id, q]));
  return answers.filter((a) => byId.get(a.questionId)?.correctOptionId === a.optionId).length;
}

export type RecapItem = {
  id: string;
  section: string;
  sectionEmoji: string;
  caseTitle: string;
  scenario: string;
  prompt: string;
  options: QuestionOption[];
  selectedOptionId: string | null;
  correctOptionId: string;
  correct: boolean;
  explanation: string;
};

export function buildRecap(questions: Question[], answers: AnswerInput[]): RecapItem[] {
  const answerByQuestion = new Map(answers.map((a) => [a.questionId, a.optionId]));
  return [...questions]
    .sort((a, b) => a.order - b.order)
    .map((q) => {
      const selectedOptionId = answerByQuestion.get(q.id) ?? null;
      return {
        id: q.id,
        section: q.section,
        sectionEmoji: q.sectionEmoji,
        caseTitle: q.caseTitle,
        scenario: q.scenario,
        prompt: q.prompt,
        options: q.options,
        selectedOptionId,
        correctOptionId: q.correctOptionId,
        correct: selectedOptionId === q.correctOptionId,
        explanation: q.explanation,
      };
    });
}
