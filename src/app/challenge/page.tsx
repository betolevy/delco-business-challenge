"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { QuestionCard } from "@/components/QuestionCard";
import { ScoreReveal } from "@/components/ScoreReveal";
import { RecapList } from "@/components/RecapList";
import { JoinLeaderboardForm } from "@/components/JoinLeaderboardForm";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";
import { StatPill } from "@/components/StatPill";
import type { PublicQuestion } from "@/lib/types";
import type { RecapItem } from "@/lib/scoring";
import type { Tier } from "@/lib/tiers";
import { saveProgress, loadProgress, clearProgress, matchesQuestionSet } from "@/lib/progress";

type Answer = { questionId: string; optionId: string };
type Phase = "cover" | "loading" | "playing" | "scoring" | "result" | "recap" | "join" | "done";

// Brief pause after tapping an answer, purely for tactile feedback — no
// correct/incorrect reveal happens here, that's saved for the recap.
const SELECT_DELAY = 380;

type ScoreResult = {
  score: number;
  totalQuestions: number;
  percentile: number;
  tier: Tier;
  recap: RecapItem[];
};

export default function ChallengePage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("cover");
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [result, setResult] = useState<ScoreResult | null>(null);

  const answersRef = useRef<Answer[]>([]);
  const startedAtRef = useRef<number>(0);

  // Phones drop tabs from memory when backgrounded — resume an in-flight
  // run instead of dumping the player back at the start screen.
  useEffect(() => {
    const saved = loadProgress();
    if (!saved) return;

    let cancelled = false;
    (async () => {
      const res = await fetch("/api/questions");
      const data: { questions: PublicQuestion[] } = await res.json();
      if (cancelled) return;

      const ids = data.questions.map((q) => q.id);
      if (!matchesQuestionSet(saved, ids) || saved.index >= data.questions.length) {
        clearProgress();
        return;
      }

      answersRef.current = saved.answers;
      startedAtRef.current = saved.startedAt;
      setQuestions(data.questions);
      setIndex(saved.index);
      setPhase("playing");
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  async function startChallenge() {
    setPhase("loading");
    const res = await fetch("/api/questions");
    const data: { questions: PublicQuestion[] } = await res.json();
    setQuestions(data.questions);
    startedAtRef.current = Date.now();
    answersRef.current = [];
    clearProgress();
    setIndex(0);
    setPhase("playing");
  }

  const current = questions[index];
  const isLastQuestion = index + 1 >= questions.length;

  function handleSelect(optionId: string) {
    if (!current || selectedOptionId) return;
    setSelectedOptionId(optionId);
    answersRef.current = [...answersRef.current, { questionId: current.id, optionId }];

    if (!isLastQuestion) {
      saveProgress({
        startedAt: startedAtRef.current,
        index: index + 1,
        answers: answersRef.current,
        questionIds: questions.map((q) => q.id),
      });
    }

    setTimeout(() => {
      if (isLastQuestion) {
        void finishQuiz();
      } else {
        setIndex((i) => i + 1);
        setSelectedOptionId(null);
      }
    }, SELECT_DELAY);
  }

  async function finishQuiz() {
    clearProgress();
    setPhase("scoring");
    const res = await fetch("/api/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: answersRef.current }),
    });
    const data: ScoreResult = await res.json();
    setResult(data);
    setPhase("result");
  }

  async function handleJoin({
    name,
    company,
    email,
  }: {
    name: string;
    company: string;
    email: string;
  }) {
    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        company,
        email,
        answers: answersRef.current,
        timeMs: Date.now() - startedAtRef.current,
      }),
    });
    setPhase("done");
  }

  const isFullWidthPhase = phase === "recap";

  return (
    <main className="relative flex min-h-dvh flex-col items-center px-6 py-8">
      {phase === "playing" && current && (
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-4">
            <span className="text-[13px] font-medium text-fg-subtle">
              Case {index + 1} of {questions.length}
            </span>
          </div>
          <ProgressBar value={(index + (selectedOptionId ? 1 : 0)) / questions.length} />
        </div>
      )}

      <div
        className={
          isFullWidthPhase
            ? "flex w-full max-w-md flex-1 flex-col items-center py-6"
            : "flex w-full max-w-md flex-1 flex-col items-center justify-center pb-10"
        }
      >
        <AnimatePresence mode="wait">
          {phase === "cover" && (
            <motion.div
              key="cover"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex w-full flex-col items-center text-center"
            >
              <Logo variant="light" className="h-8 w-auto" />
              <h1 className="mt-8 text-[30px] font-bold tracking-tight">
                Build your business
              </h1>
              <p className="mt-2 max-w-xs text-[15px] text-fg-muted">
                12 real-world cases, one decision at a time. Answer honestly — your score is
                revealed at the end.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <StatPill>12 Cases</StatPill>
                <StatPill>2 Minutes</StatPill>
                <StatPill>One Leaderboard</StatPill>
              </div>
              <Button className="mt-10" onClick={startChallenge}>
                Start Challenge
              </Button>
              <button
                onClick={() => router.push("/leaderboard")}
                className="mt-6 text-[13px] font-medium text-fg-subtle hover:text-white cursor-pointer"
              >
                View Leaderboard
              </button>
            </motion.div>
          )}

          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Logo variant="light" className="h-7 w-auto animate-pulse opacity-60" />
            </motion.div>
          )}

          {phase === "playing" && current && (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full"
            >
              <QuestionCard
                question={current}
                selectedOptionId={selectedOptionId}
                onSelect={handleSelect}
              />
            </motion.div>
          )}

          {phase === "scoring" && (
            <motion.div
              key="scoring"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <Logo variant="light" className="h-7 w-auto animate-pulse opacity-60" />
            </motion.div>
          )}

          {phase === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex w-full flex-col items-center"
            >
              <ScoreReveal
                score={result.score}
                total={result.totalQuestions}
                percentile={result.percentile}
                tier={result.tier}
              />
              <Button className="mt-10" onClick={() => setPhase("recap")}>
                See how you did
              </Button>
            </motion.div>
          )}

          {phase === "recap" && result && (
            <motion.div
              key="recap"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex w-full flex-col items-center"
            >
              <h2 className="mb-5 text-center text-[20px] font-bold tracking-tight">
                Case by case
              </h2>
              <RecapList items={result.recap} />
              <Button className="mt-8 mb-4 w-full" onClick={() => setPhase("join")}>
                Continue
              </Button>
            </motion.div>
          )}

          {phase === "join" && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex w-full flex-col items-center"
            >
              <JoinLeaderboardForm onSubmit={handleJoin} />
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex w-full flex-col items-center text-center"
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-teal text-[28px] text-black"
              >
                ✓
              </motion.span>
              <h2 className="mt-6 text-[24px] font-semibold tracking-tight">You&apos;re on the board</h2>
              <p className="mt-2 max-w-xs text-[15px] text-fg-muted">
                Thanks for playing. Good luck!
              </p>
              <div className="mt-9 flex flex-col gap-3">
                <Button onClick={() => router.push("/leaderboard")}>View Leaderboard</Button>
                <Button variant="ghost" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
