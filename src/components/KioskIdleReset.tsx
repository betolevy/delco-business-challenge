"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const IDLE_TIMEOUT_MS = 90_000;
const EXCLUDED_PREFIXES = ["/admin"];

/**
 * Kiosk safeguard: if the iPad sits idle mid-challenge (attendee walked away),
 * bounce back to the home screen so the next person gets a fresh start.
 */
export function KioskIdleReset() {
  const pathname = usePathname();
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const excluded = EXCLUDED_PREFIXES.some((p) => pathname.startsWith(p));
    if (excluded || pathname === "/") return;

    function reset() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => router.push("/"), IDLE_TIMEOUT_MS);
    }

    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, reset));
    reset();

    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname, router]);

  return null;
}
