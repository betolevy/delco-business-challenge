"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import type { PublicLeaderboardEntry } from "@/lib/types";

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<PublicLeaderboardEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await fetch("/api/leaderboard", { cache: "no-store" });
      const data: { entries: PublicLeaderboardEntry[] } = await res.json();
      if (!cancelled) setEntries(data.entries);
    }
    load();
    const interval = setInterval(load, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex items-center justify-between"
      >
        <Logo variant="light" className="h-6 w-auto" />
        <button
          onClick={() => router.push("/")}
          className="text-[13px] font-medium text-fg-muted transition-colors hover:text-white cursor-pointer"
        >
          Close
        </button>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.5 }}
        className="text-[30px] font-bold tracking-tight"
      >
        Leaderboard
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mt-1 text-[14px] text-fg-muted"
      >
        Top 20 founders
      </motion.p>

      <div className="mt-8 flex-1">
        {entries === null ? (
          <div className="flex justify-center py-16">
            <Logo variant="light" className="h-6 w-auto animate-pulse opacity-50" />
          </div>
        ) : (
          <LeaderboardTable entries={entries} />
        )}
      </div>

      <Button className="mt-8 w-full" onClick={() => router.push("/challenge")}>
        Take the Challenge
      </Button>
    </main>
  );
}
