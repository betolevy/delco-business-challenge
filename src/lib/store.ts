import { nanoid } from "nanoid";
import type { Question, LeaderboardEntry } from "@/lib/types";
import { DEFAULT_QUESTIONS } from "@/data/questions.default";
import { kvConfigured, kvGet, kvSet, kvSadd, kvSmembers, kvZadd, kvZrevrange, kvMget } from "@/lib/kv";

const DATA_DIR = `${process.cwd()}/.data`;
const DB_FILE = `${DATA_DIR}/db.json`;

type LocalDb = {
  questions: Question[] | null;
  entries: LeaderboardEntry[];
};

async function readLocalDb(): Promise<LocalDb> {
  const fs = await import("fs/promises");
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(raw) as LocalDb;
  } catch {
    return { questions: null, entries: [] };
  }
}

async function writeLocalDb(db: LocalDb): Promise<void> {
  const fs = await import("fs/promises");
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

// Composite ranking score: higher quiz score wins, faster time breaks ties.
function rankScore(score: number, timeMs: number): number {
  return score * 1_000_000 - timeMs;
}

export async function getQuestions(): Promise<Question[]> {
  if (kvConfigured) {
    const raw = await kvGet("questions");
    if (!raw) return DEFAULT_QUESTIONS;
    return JSON.parse(raw) as Question[];
  }
  const db = await readLocalDb();
  return db.questions ?? DEFAULT_QUESTIONS;
}

export async function saveQuestions(questions: Question[]): Promise<void> {
  if (kvConfigured) {
    await kvSet("questions", JSON.stringify(questions));
    return;
  }
  const db = await readLocalDb();
  db.questions = questions;
  await writeLocalDb(db);
}

export async function addLeaderboardEntry(
  input: Omit<LeaderboardEntry, "id" | "createdAt">
): Promise<LeaderboardEntry> {
  const entry: LeaderboardEntry = {
    ...input,
    id: nanoid(10),
    createdAt: new Date().toISOString(),
  };

  if (kvConfigured) {
    await kvSet(`entry:${entry.id}`, JSON.stringify(entry));
    await kvSadd("entries:ids", entry.id);
    await kvZadd("leaderboard", rankScore(entry.score, entry.timeMs), entry.id);
    return entry;
  }

  const db = await readLocalDb();
  db.entries.push(entry);
  await writeLocalDb(db);
  return entry;
}

export async function getLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  if (kvConfigured) {
    const ids = await kvZrevrange("leaderboard", 0, limit - 1);
    if (ids.length === 0) return [];
    const raw = await kvMget(ids.map((id) => `entry:${id}`));
    return raw.filter((r): r is string => Boolean(r)).map((r) => JSON.parse(r) as LeaderboardEntry);
  }

  const db = await readLocalDb();
  return [...db.entries]
    .sort((a, b) => rankScore(b.score, b.timeMs) - rankScore(a.score, a.timeMs))
    .slice(0, limit);
}

export async function getAllEntries(): Promise<LeaderboardEntry[]> {
  if (kvConfigured) {
    const ids = await kvSmembers("entries:ids");
    if (ids.length === 0) return [];
    const raw = await kvMget(ids.map((id) => `entry:${id}`));
    const entries = raw.filter((r): r is string => Boolean(r)).map((r) => JSON.parse(r) as LeaderboardEntry);
    return entries.sort((a, b) => rankScore(b.score, b.timeMs) - rankScore(a.score, a.timeMs));
  }

  const db = await readLocalDb();
  return [...db.entries].sort(
    (a, b) => rankScore(b.score, b.timeMs) - rankScore(a.score, a.timeMs)
  );
}

export async function computePercentile(score: number): Promise<number> {
  const entries = await getAllEntries();
  if (entries.length === 0) return 50;
  const lower = entries.filter((e) => e.score < score).length;
  return Math.round((lower / entries.length) * 100);
}

export const storageBackend = kvConfigured ? "vercel-kv" : "local-file";
