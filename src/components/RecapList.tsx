"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { RecapItem } from "@/lib/scoring";

export function RecapList({ items }: { items: RecapItem[] }) {
  return (
    <div className="flex w-full flex-col gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(i, 8) * 0.04, duration: 0.35 }}
          className="rounded-2xl border border-border bg-surface p-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-teal">
              <span>{item.sectionEmoji}</span>
              <span>{item.section}</span>
            </div>
            <span
              className={clsx(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                item.correct ? "bg-success text-black" : "bg-error text-white"
              )}
            >
              {item.correct ? "✓" : "✕"}
            </span>
          </div>

          <p className="mt-2 text-[12px] font-medium text-fg-subtle">
            Case {i + 1} — {item.caseTitle}
          </p>

          <h3 className="mt-1 text-[16px] font-semibold leading-snug">{item.prompt}</h3>

          <div className="mt-3 flex flex-col gap-1.5">
            {item.options.map((option) => {
              const isCorrect = option.id === item.correctOptionId;
              const isSelectedWrong = option.id === item.selectedOptionId && !isCorrect;
              return (
                <div
                  key={option.id}
                  className={clsx(
                    "rounded-lg border px-3 py-2 text-[13px]",
                    isCorrect && "border-success/50 bg-success/10 text-white",
                    isSelectedWrong && "border-error/50 bg-error/10 text-white",
                    !isCorrect && !isSelectedWrong && "border-border/40 text-fg-subtle"
                  )}
                >
                  {option.label}
                </div>
              );
            })}
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-fg-muted">{item.explanation}</p>
        </motion.div>
      ))}
    </div>
  );
}
