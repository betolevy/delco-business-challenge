"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
import { QrCode } from "@/components/QrCode";
import type { PublicLeaderboardEntry } from "@/lib/types";

// Booth screen: read from across the room, no interaction, never sleeps
// on a stale list. Top 10 keeps every row large enough to actually read.
const VISIBLE_ROWS = 10;
const REFRESH_MS = 6000;

function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function DisplayPage() {
  const [entries, setEntries] = useState<PublicLeaderboardEntry[] | null>(null);
  const [origin] = useState(() => (typeof window !== "undefined" ? window.location.origin : ""));

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/leaderboard", { cache: "no-store" });
        const data: { entries: PublicLeaderboardEntry[] } = await res.json();
        if (!cancelled) setEntries(data.entries);
      } catch {
        // Booth wifi hiccup — keep showing the last good list.
      }
    }
    load();
    const interval = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const rows = entries?.slice(0, VISIBLE_ROWS) ?? [];

  return (
    <main className="relative flex h-dvh w-full flex-col overflow-hidden px-[4vw] py-[3vh]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 45% at 70% 20%, rgba(0,188,180,0.10) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <header className="relative flex items-start justify-between">
        <div>
          <Logo variant="light" className="h-[3.5vh] w-auto" />
          <h1 className="mt-[1.5vh] text-[5vh] font-bold leading-none tracking-tight">
            Leaderboard
          </h1>
          <p className="mt-[0.8vh] text-[1.8vh] font-medium uppercase tracking-widest text-teal">
            Business Challenge · Live
          </p>
        </div>

        {origin && (
          <div className="flex flex-col items-center gap-[1vh]">
            <QrCode url={origin} size={130} />
            <span className="text-[1.5vh] font-medium text-fg-muted">Scan to play</span>
          </div>
        )}
      </header>

      <div className="relative mt-[3vh] flex-1 overflow-hidden">
        {entries === null ? (
          <div className="flex h-full items-center justify-center">
            <Logo variant="light" className="h-[4vh] w-auto animate-pulse opacity-40" />
          </div>
        ) : rows.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-[1vh] text-center">
            <p className="text-[3vh] font-semibold">Nobody on the board yet.</p>
            <p className="text-[2vh] text-fg-muted">Scan the code and be the first.</p>
          </div>
        ) : (
          <div className="flex h-full flex-col justify-start gap-[1vh]">
            <AnimatePresence initial={false}>
              {rows.map((entry, i) => {
                const rank = i + 1;
                return (
                  <motion.div
                    key={`${entry.name}-${entry.createdAt}`}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                    className={clsx(
                      "flex items-center gap-[2vw] rounded-[1.5vh] border px-[2vw] py-[1.2vh]",
                      rank === 1
                        ? "border-teal/50 bg-teal/10"
                        : "border-border bg-surface"
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-[5vh] w-[5vh] shrink-0 items-center justify-center rounded-full text-[2.2vh] font-bold tabular-nums",
                        rank === 1 && "bg-teal text-black",
                        rank === 2 && "bg-white/80 text-black",
                        rank === 3 && "bg-white/25 text-white",
                        rank > 3 && "bg-white/5 text-fg-subtle"
                      )}
                    >
                      {rank}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[2.8vh] font-semibold leading-tight">
                        {entry.name}
                      </p>
                      {entry.company && (
                        <p className="truncate text-[1.8vh] text-fg-subtle">{entry.company}</p>
                      )}
                    </div>

                    <span className="shrink-0 text-[3vh] font-bold tabular-nums">
                      {entry.score}
                      <span className="text-[2vh] text-fg-subtle">/{entry.totalQuestions}</span>
                    </span>
                    <span className="w-[8vw] shrink-0 text-right text-[2vh] tabular-nums text-fg-subtle">
                      {formatTime(entry.timeMs)}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
