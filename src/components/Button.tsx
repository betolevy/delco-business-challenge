"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: "md" | "lg";
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-white text-black hover:bg-white/90",
  secondary: "bg-surface text-fg border border-teal/40 hover:border-teal",
  ghost: "bg-transparent text-white border border-border-strong hover:bg-white/5",
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-[17px]",
};

export function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
