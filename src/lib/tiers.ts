export type Tier = {
  label: string;
  emoji: string;
};

// Ratio thresholds tuned for a 15-question challenge (14–15, 11–13, 8–10,
// 5–7, 0–4) but expressed as fractions so they scale if the question
// count ever changes.
const TIERS: (Tier & { minRatio: number })[] = [
  { label: "Boardroom Master", emoji: "🏆", minRatio: 14 / 15 },
  { label: "Deal Maker", emoji: "🥇", minRatio: 11 / 15 },
  { label: "Business Builder", emoji: "🚀", minRatio: 8 / 15 },
  { label: "Future Founder", emoji: "💼", minRatio: 5 / 15 },
  { label: "Getting Started", emoji: "🌱", minRatio: 0 },
];

export function getTier(score: number, total: number): Tier {
  const ratio = total > 0 ? score / total : 0;
  const tier = TIERS.find((t) => ratio >= t.minRatio - 1e-9);
  return tier ?? TIERS[TIERS.length - 1];
}
