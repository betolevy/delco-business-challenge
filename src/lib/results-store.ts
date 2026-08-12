import type { RecapItem } from "@/lib/scoring";
import type { Tier } from "@/lib/tiers";

export type StoredResult = {
  savedAt: number;
  score: number;
  totalQuestions: number;
  percentile: number;
  tier: Tier;
  recap: RecapItem[];
};

const STORAGE_KEY = "delco-challenge-result";

// The recap is where the legal content actually lands, and there is no
// results email — so a finished run stays retrievable well past the event
// day rather than disappearing when the tab closes.
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

export function saveResult(result: Omit<StoredResult, "savedAt">): void {
  try {
    const payload: StoredResult = { ...result, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private mode / quota — the on-screen recap still works.
  }
}

export function loadResult(): StoredResult | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredResult;
    if (
      typeof parsed?.savedAt !== "number" ||
      typeof parsed?.score !== "number" ||
      typeof parsed?.totalQuestions !== "number" ||
      !parsed?.tier?.label ||
      !Array.isArray(parsed?.recap)
    ) {
      return null;
    }
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function clearResult(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — see saveResult.
  }
}
