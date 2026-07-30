export type Tier = {
  label: string;
  emoji: string;
};

// Ratio thresholds tuned for a 15-question challenge (12–15, 9–11, 6–8,
// 3–5, 0–2) but expressed as fractions so they scale if the question
// count ever changes. Lowered from the original (14–15, 11–13, 8–10, 5–7)
// after tightening the wrong-answer options made the questions harder.
const TIERS: (Tier & { minRatio: number })[] = [
  { label: "Boardroom Master", emoji: "🏆", minRatio: 12 / 15 },
  { label: "Deal Maker", emoji: "🥇", minRatio: 9 / 15 },
  { label: "Business Builder", emoji: "🚀", minRatio: 6 / 15 },
  { label: "Future Founder", emoji: "💼", minRatio: 3 / 15 },
  { label: "Getting Started", emoji: "🌱", minRatio: 0 },
];

export function getTier(score: number, total: number): Tier {
  const ratio = total > 0 ? score / total : 0;
  const tier = TIERS.find((t) => ratio >= t.minRatio - 1e-9);
  return tier ?? TIERS[TIERS.length - 1];
}
