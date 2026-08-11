"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import type { PublicLeaderboardEntry } from "@/lib/types";

function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function LeaderboardTable({ entries }: { entries: PublicLeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <p className="text-[15px] text-fg-muted">No scores yet.</p>
        <p className="text-[13px] text-fg-subtle">Be the first to take the challenge.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      {entries.map((entry, i) => {
        const rank = i + 1;
        return (
          <motion.div
            key={`${entry.name}-${entry.createdAt}-${i}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(i, 10) * 0.03, duration: 0.35 }}
            className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-3.5"
          >
            <span
              className={clsx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold",
                rank === 1 && "bg-teal text-black",
                rank === 2 && "bg-white/80 text-black",
                rank === 3 && "bg-white/20 text-white",
                rank > 3 && "bg-white/5 text-fg-subtle"
              )}
            >
              {rank}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-medium text-white">{entry.name}</p>
              {entry.company && (
                <p className="truncate text-[13px] text-fg-subtle">{entry.company}</p>
              )}
            </div>

            <div className="flex shrink-0 items-center gap-4 text-right">
              <span className="text-[15px] font-semibold tabular-nums">
                {entry.score}
                <span className="text-fg-subtle">/{entry.totalQuestions}</span>
              </span>
              <span className="w-12 text-[13px] tabular-nums text-fg-subtle">
                {formatTime(entry.timeMs)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
