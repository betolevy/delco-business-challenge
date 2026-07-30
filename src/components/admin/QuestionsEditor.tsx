"use client";

import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { Button } from "@/components/Button";
import type { Question } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] text-white placeholder:text-fg-subtle outline-none focus:border-teal";

const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-wide text-fg-subtle";

function emptyQuestion(order: number): Question {
  return {
    id: nanoid(8),
    order,
    section: "",
    sectionEmoji: "",
    caseTitle: "",
    scenario: "",
    prompt: "",
    options: [
      { id: nanoid(6), label: "" },
      { id: nanoid(6), label: "" },
    ],
    correctOptionId: "",
    explanation: "",
  };
}

export function QuestionsEditor() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "saving" | "saved" | "error"; message?: string }>({
    type: "idle",
  });

  useEffect(() => {
    fetch("/api/admin/questions")
      .then((res) => res.json())
      .then((data: { questions: Question[] }) => setQuestions(data.questions));
  }, []);

  if (!questions) {
    return <p className="py-10 text-center text-[14px] text-fg-muted">Loading questions…</p>;
  }

  function update(id: string, patch: Partial<Question>) {
    setQuestions((qs) => qs!.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  }

  function updateOption(qid: string, oid: string, label: string) {
    setQuestions((qs) =>
      qs!.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, label } : o)) }
          : q
      )
    );
  }

  function addOption(qid: string) {
    setQuestions((qs) =>
      qs!.map((q) => (q.id === qid ? { ...q, options: [...q.options, { id: nanoid(6), label: "" }] } : q))
    );
  }

  function removeOption(qid: string, oid: string) {
    setQuestions((qs) =>
      qs!.map((q) =>
        q.id === qid
          ? {
              ...q,
              options: q.options.filter((o) => o.id !== oid),
              correctOptionId: q.correctOptionId === oid ? "" : q.correctOptionId,
            }
          : q
      )
    );
  }

  function addQuestion() {
    setQuestions((qs) => [...qs!, emptyQuestion(qs!.length + 1)]);
  }

  function removeQuestion(id: string) {
    setQuestions((qs) => qs!.filter((q) => q.id !== id));
  }

  async function save() {
    setStatus({ type: "saving" });
    const res = await fetch("/api/admin/questions", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions }),
    });
    const data = await res.json();
    if (!res.ok) {
      setStatus({ type: "error", message: data.error ?? "Failed to save." });
    } else {
      setStatus({ type: "saved" });
      setTimeout(() => setStatus({ type: "idle" }), 2000);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {questions.map((q, qi) => (
        <div key={q.id} className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-fg-subtle">
              Case {qi + 1}
            </span>
            <button
              onClick={() => removeQuestion(q.id)}
              className="text-[12px] text-error hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>

          <div className="grid grid-cols-[1fr_4fr] gap-2">
            <div>
              <label className={labelClass}>Emoji</label>
              <input
                className={inputClass}
                placeholder="🚀"
                value={q.sectionEmoji}
                onChange={(e) => update(q.id, { sectionEmoji: e.target.value })}
              />
            </div>
            <div>
              <label className={labelClass}>Section</label>
              <input
                className={inputClass}
                placeholder="BUILD A BUSINESS"
                value={q.section}
                onChange={(e) => update(q.id, { section: e.target.value })}
              />
            </div>
          </div>

          <label className={`${labelClass} mt-3`}>Case title</label>
          <input
            className={inputClass}
            placeholder="The Co-Founder"
            value={q.caseTitle}
            onChange={(e) => update(q.id, { caseTitle: e.target.value })}
          />

          <label className={`${labelClass} mt-3`}>Scenario</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="Two friends start a company. One puts in the money, the other builds the tech…"
            value={q.scenario}
            onChange={(e) => update(q.id, { scenario: e.target.value })}
          />

          <label className={`${labelClass} mt-3`}>Question</label>
          <textarea
            className={inputClass}
            rows={2}
            placeholder="What could go wrong if they later decide to split up?"
            value={q.prompt}
            onChange={(e) => update(q.id, { prompt: e.target.value })}
          />

          <div className="mt-3 flex flex-col gap-2">
            {q.options.map((o) => (
              <div key={o.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correctOptionId === o.id}
                  onChange={() => update(q.id, { correctOptionId: o.id })}
                  title="Mark as correct answer"
                  className="h-4 w-4 accent-teal shrink-0"
                />
                <input
                  className={inputClass}
                  placeholder="Option label"
                  value={o.label}
                  onChange={(e) => updateOption(q.id, o.id, e.target.value)}
                />
                <button
                  onClick={() => removeOption(q.id, o.id)}
                  className="shrink-0 text-fg-subtle hover:text-error cursor-pointer"
                  aria-label="Remove option"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={() => addOption(q.id)}
              className="self-start text-[13px] text-teal hover:underline cursor-pointer"
            >
              + Add option
            </button>
          </div>

          <label className={`${labelClass} mt-3`}>
            Explanation (revealed in the end-of-quiz recap — a short paragraph, 2–4 sentences)
          </label>
          <textarea
            className={inputClass}
            rows={4}
            placeholder="Explain why this is the right answer and what it means for a founder's business…"
            value={q.explanation}
            onChange={(e) => update(q.id, { explanation: e.target.value })}
          />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <button onClick={addQuestion} className="text-[14px] text-teal hover:underline cursor-pointer">
          + Add case
        </button>
        <div className="flex items-center gap-3">
          {status.type === "error" && <span className="text-[13px] text-error">{status.message}</span>}
          {status.type === "saved" && <span className="text-[13px] text-success">Saved</span>}
          <Button size="md" onClick={save} disabled={status.type === "saving"}>
            {status.type === "saving" ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
