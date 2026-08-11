"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { QrCode } from "@/components/QrCode";

// Placeholder tagline — swap for whatever line delco wants to lead with.
const TAGLINE = "Can you make the right business decisions?";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Home() {
  const router = useRouter();
  const [origin] = useState(() => (typeof window !== "undefined" ? window.location.origin : ""));

  return (
    <motion.button
      type="button"
      onClick={() => router.push("/challenge")}
      whileTap={{ scale: 0.99 }}
      className="relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-left cursor-pointer"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 30%, rgba(0,188,180,0.10) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative flex w-full max-w-md flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <Logo variant="light" className="h-14 w-auto md:h-16" />
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-9 text-[40px] font-bold leading-[1.05] tracking-tight md:text-[48px]"
        >
          Business Challenge
        </motion.h1>

        <motion.p variants={item} className="mt-4 max-w-xs text-[18px] font-medium text-fg-muted">
          {TAGLINE}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-16 animate-pulse text-[13px] font-medium uppercase tracking-wide text-fg-subtle"
        >
          Tap anywhere to begin
        </motion.div>

        {origin && (
          <motion.div
            variants={item}
            className="mt-16 hidden flex-col items-center gap-3 md:flex"
          >
            <QrCode url={`${origin}/challenge`} size={112} />
            <span className="text-xs text-fg-subtle">Scan to play on your phone</span>
          </motion.div>
        )}
      </motion.div>
    </motion.button>
  );
}
