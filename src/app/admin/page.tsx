"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { QuestionsEditor } from "@/components/admin/QuestionsEditor";
import { ResultsTable } from "@/components/admin/ResultsTable";

type Tab = "questions" | "results";

export default function AdminPage() {
  const [checked, setChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [tab, setTab] = useState<Tab>("questions");

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data: { authenticated: boolean }) => {
        setAuthenticated(data.authenticated);
        setChecked(true);
      });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
    } else {
      setError("Incorrect password");
    }
    setSubmitting(false);
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPassword("");
  }

  if (!checked) {
    return null;
  }

  if (!authenticated) {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center px-6">
        <motion.form
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex w-full max-w-xs flex-col items-center gap-6"
        >
          <Logo variant="light" className="h-6 w-auto" />
          <input
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin password"
            className="w-full rounded-2xl border border-border bg-surface px-5 py-3.5 text-center text-[15px] text-white outline-none focus:border-teal"
          />
          {error && <p className="text-[13px] text-error">{error}</p>}
          <Button type="submit" disabled={submitting || !password} className="w-full">
            {submitting ? "Checking…" : "Enter"}
          </Button>
        </motion.form>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo variant="light" className="h-6 w-auto" />
          <span className="text-[13px] text-fg-subtle">Admin</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-[13px] text-fg-muted hover:text-white cursor-pointer"
        >
          Log out
        </button>
      </div>

      <div className="mb-8 flex gap-1 rounded-full border border-border p-1 w-fit">
        {(["questions", "results"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-[13px] font-medium capitalize transition-colors cursor-pointer",
              tab === t ? "bg-white text-black" : "text-fg-muted hover:text-white"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "questions" ? <QuestionsEditor /> : <ResultsTable />}
    </main>
  );
}
