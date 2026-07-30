"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";

type Props = {
  onSubmit: (data: { name: string; company: string; email: string }) => Promise<void>;
};

const fieldClass =
  "w-full rounded-2xl border border-border bg-surface px-5 py-4 text-[16px] text-white placeholder:text-fg-subtle outline-none transition-colors focus:border-teal";

export function JoinLeaderboardForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = name.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), company: company.trim(), email: email.trim() });
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex w-full max-w-sm flex-col gap-3"
    >
      <h2 className="mb-2 text-center text-[22px] font-semibold tracking-tight">
        Join the leaderboard
      </h2>

      <input
        className={fieldClass}
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
      />
      <input
        className={fieldClass}
        placeholder="Company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        autoComplete="organization"
      />
      <input
        className={fieldClass}
        placeholder="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />

      {error && <p className="text-center text-[13px] text-error">{error}</p>}

      <Button type="submit" disabled={!canSubmit || submitting} className="mt-3 w-full">
        {submitting ? "Joining…" : "Join Leaderboard"}
      </Button>
    </motion.form>
  );
}
