"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Tier } from "@/lib/tiers";

export function ScoreReveal({
  score,
  total,
  percentile,
  tier,
}: {
  score: number;
  total: number;
  percentile: number;
  tier: Tier;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 700;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(t * score));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [score]);

  return (
    <div className="flex flex-col items-center text-center">
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-[15px] font-medium uppercase tracking-wide text-teal"
      >
        Challenge complete
      </motion.span>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mt-4 text-[88px] font-bold leading-none tracking-tight"
      >
        {display}
        <span className="text-fg-subtle">/{total}</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5, type: "spring", stiffness: 260, damping: 18 }}
        className="mt-5 inline-flex items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-5 py-2 text-[16px] font-semibold"
      >
        <span>{tier.emoji}</span>
        <span>{tier.label}</span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-4 max-w-xs text-balance text-[15px] text-fg-muted"
      >
        You know more than <span className="font-semibold text-white">{percentile}%</span> of
        founders.
      </motion.p>
    </div>
  );
}
