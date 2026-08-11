export type SavedAnswer = { questionId: string; optionId: string };

export type SavedProgress = {
  savedAt: number;
  startedAt: number;
  index: number;
  answers: SavedAnswer[];
  questionIds: string[];
};

const STORAGE_KEY = "delco-challenge-progress";

// Long enough to survive a phone call, a conversation, or Safari evicting
// the tab mid-event — short enough that a stale session from an earlier
// day never resumes into a set of questions that has since been edited.
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function saveProgress(progress: Omit<SavedProgress, "savedAt">): void {
  try {
    const payload: SavedProgress = { ...progress, savedAt: Date.now() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Private mode / quota — progress saving is a nice-to-have, never fatal.
  }
}

export function loadProgress(): SavedProgress | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SavedProgress;
    if (
      typeof parsed?.savedAt !== "number" ||
      typeof parsed?.startedAt !== "number" ||
      typeof parsed?.index !== "number" ||
      !Array.isArray(parsed?.answers) ||
      !Array.isArray(parsed?.questionIds)
    ) {
      return null;
    }
    if (Date.now() - parsed.savedAt > MAX_AGE_MS) return null;

    return parsed;
  } catch {
    return null;
  }
}

export function clearProgress(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — see saveProgress.
  }
}

/**
 * A saved session is only safe to resume against the exact question set it
 * was started on. If the cases were edited in Admin mid-event, the saved
 * index and answers no longer line up, so we start clean instead.
 */
export function matchesQuestionSet(progress: SavedProgress, questionIds: string[]): boolean {
  if (progress.questionIds.length !== questionIds.length) return false;
  return progress.questionIds.every((id, i) => id === questionIds[i]);
}
