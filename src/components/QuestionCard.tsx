"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { PublicQuestion } from "@/lib/types";

type Props = {
  question: PublicQuestion;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
};

export function QuestionCard({ question, selectedOptionId, onSelect }: Props) {
  const answered = selectedOptionId !== null;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wide text-teal">
        <span>{question.sectionEmoji}</span>
        <span>{question.section}</span>
      </div>

      <div className="text-[13px] font-medium text-fg-subtle">
        Case {question.order} — {question.caseTitle}
      </div>

      <div className="rounded-2xl border border-teal/25 bg-teal/5 px-4 py-3.5">
        <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-teal">
          The situation
        </div>
        <p className="text-[16px] leading-relaxed text-fg">{question.scenario}</p>
      </div>

      <h2 className="mt-1 text-balance text-[20px] font-semibold leading-snug tracking-tight md:text-[24px]">
        {question.prompt}
      </h2>

      <div className="mt-2 flex flex-col gap-3">
        {question.options.map((option, i) => {
          const isSelected = selectedOptionId === option.id;

          return (
            <motion.button
              key={option.id}
              type="button"
              disabled={answered}
              onClick={() => onSelect(option.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4, ease: "easeOut" }}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              className={clsx(
                "flex min-h-14 w-full items-center rounded-2xl border px-5 py-4 text-left text-[16px] font-medium transition-colors",
                !answered && "border-border bg-surface hover:bg-surface-hover cursor-pointer",
                isSelected && "border-teal/60 bg-teal/10 text-white",
                answered && !isSelected && "border-border/50 bg-surface/40 text-fg-subtle"
              )}
            >
              {option.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
