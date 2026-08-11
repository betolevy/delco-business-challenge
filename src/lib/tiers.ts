export type Tier = {
  label: string;
  emoji: string;
};

// Ratio thresholds tuned for a 12-question challenge (10–12, 7–9, 4–6,
// 2–3, 0–1) but expressed as fractions so they scale if the question
// count ever changes.
const TIERS: (Tier & { minRatio: number })[] = [
  { label: "Boardroom Master", emoji: "🏆", minRatio: 10 / 12 },
  { label: "Deal Maker", emoji: "🥇", minRatio: 7 / 12 },
  { label: "Business Builder", emoji: "🚀", minRatio: 4 / 12 },
  { label: "Future Founder", emoji: "💼", minRatio: 2 / 12 },
  { label: "Getting Started", emoji: "🌱", minRatio: 0 },
];

export function getTier(score: number, total: number): Tier {
  const ratio = total > 0 ? score / total : 0;
  const tier = TIERS.find((t) => ratio >= t.minRatio - 1e-9);
  return tier ?? TIERS[TIERS.length - 1];
}
