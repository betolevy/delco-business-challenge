"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/Button";
import type { LeaderboardEntry } from "@/lib/types";

export function ResultsTable() {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/entries", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { entries: LeaderboardEntry[] }) => setEntries(data.entries));
  }, []);

  async function removeEntry(entry: LeaderboardEntry) {
    if (busyId) return;
    if (!window.confirm(`Remove "${entry.name}" from the leaderboard? This can't be undone.`)) {
      return;
    }

    setBusyId(entry.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/entries/${entry.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEntries((prev) => prev?.filter((e) => e.id !== entry.id) ?? null);
    } catch {
      setError("Couldn't remove that entry. Try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function clearAll() {
    setClearing(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/entries", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: "DELETE ALL" }),
      });
      if (!res.ok) throw new Error();
      setEntries([]);
      setConfirmingClear(false);
    } catch {
      setError("Couldn't clear the leaderboard. Try again.");
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13px] text-fg-muted">
          {entries ? `${entries.length} responses` : "Loading…"}
        </span>
        <div className="flex items-center gap-2">
          <a href="/api/admin/export">
            <Button size="md" variant="secondary">
              Export CSV
            </Button>
          </a>
          <button
            onClick={() => setConfirmingClear(true)}
            disabled={!entries || entries.length === 0}
            className="rounded-full border border-error/40 px-4 py-2 text-[13px] font-medium text-error transition-colors hover:bg-error/10 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
          >
            Clear leaderboard
          </button>
        </div>
      </div>

      {confirmingClear && (
        <div className="rounded-2xl border border-error/40 bg-error/10 p-4">
          <p className="text-[14px] font-semibold">
            Delete all {entries?.length ?? 0} responses?
          </p>
          <p className="mt-1 text-[13px] text-fg-muted">
            This wipes every score and email permanently. Export the CSV first if you might
            need the data.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={clearAll}
              disabled={clearing}
              className="rounded-full bg-error px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-50 cursor-pointer"
            >
              {clearing ? "Deleting…" : "Yes, delete everything"}
            </button>
            <button
              onClick={() => setConfirmingClear(false)}
              className="rounded-full border border-border-strong px-4 py-2 text-[13px] font-medium text-fg-muted hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-[13px] text-error">{error}</p>}

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
              <th className="px-4 py-3 font-medium"></th>
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
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeEntry(e)}
                    disabled={busyId === e.id}
                    title="Remove from leaderboard"
                    aria-label={`Remove ${e.name} from leaderboard`}
                    className="text-fg-subtle transition-colors hover:text-error disabled:opacity-40 cursor-pointer"
                  >
                    {busyId === e.id ? "…" : "✕"}
                  </button>
                </td>
              </tr>
            ))}
            {entries?.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-fg-subtle">
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
