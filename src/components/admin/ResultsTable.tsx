"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import type { LeaderboardEntry } from "@/lib/types";

export function ResultsTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/entries")
      .then((res) => res.json())
      .then((data: { entries: LeaderboardEntry[] }) => setEntries(data.entries));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-fg-muted">
          {entries ? `${entries.length} responses` : "Loading…"}
        </span>
        <a href="/api/admin/export">
          <Button size="md" variant="secondary">
            Export CSV
          </Button>
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-fg-subtle">
              <th className="px-4 py-3 font-medium">#</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {entries?.map((e, i) => (
              <tr key={e.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-3 text-fg-subtle">{i + 1}</td>
                <td className="px-4 py-3 font-medium">{e.name}</td>
                <td className="px-4 py-3 text-fg-muted">{e.company}</td>
                <td className="px-4 py-3 text-fg-muted">{e.email}</td>
                <td className="px-4 py-3 tabular-nums">
                  {e.score}/{e.totalQuestions}
                </td>
                <td className="px-4 py-3 tabular-nums">{(e.timeMs / 1000).toFixed(1)}s</td>
                <td className="px-4 py-3 text-fg-subtle">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {entries?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-fg-subtle">
                  No responses yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
