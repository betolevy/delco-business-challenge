export type QuestionOption = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  order: number;
  section: string; // e.g. "BUILD A BUSINESS"
  sectionEmoji: string; // e.g. "🚀"
  caseTitle: string; // e.g. "The Co-Founder"
  scenario: string; // short narrative setup for the case
  prompt: string; // the actual question asked
  options: QuestionOption[];
  correctOptionId: string;
  explanation: string; // "what you should know" — revealed in the end-of-quiz recap
};

export type PublicQuestion = Omit<Question, "correctOptionId" | "explanation">;

export type LeaderboardEntry = {
  id: string;
  name: string;
  company: string;
  email: string;
  score: number;
  totalQuestions: number;
  timeMs: number;
  createdAt: string;
};

export type PublicLeaderboardEntry = Omit<LeaderboardEntry, "email" | "id">;

export function toPublicQuestion(q: Question): PublicQuestion {
  return {
    id: q.id,
    order: q.order,
    section: q.section,
    sectionEmoji: q.sectionEmoji,
    caseTitle: q.caseTitle,
    scenario: q.scenario,
    prompt: q.prompt,
    options: q.options,
  };
}

export function toPublicEntry(e: LeaderboardEntry): PublicLeaderboardEntry {
  return {
    name: e.name,
    company: e.company,
    score: e.score,
    totalQuestions: e.totalQuestions,
    timeMs: e.timeMs,
    createdAt: e.createdAt,
  };
}
