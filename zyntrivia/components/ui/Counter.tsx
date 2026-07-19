"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

/** Animated numeric counter. Tabular numerals; height comes from the parent's font size, so no layout shift. */
export function Counter({
  value,
  format,
  duration = 0.6,
  className = "",
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration,
      ease: [0.2, 0, 0, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, duration, reduced]);

  const fmt = format ?? ((n: number) => Math.round(n).toLocaleString("en-US"));
  return <span className={`tabular-nums ${className}`}>{fmt(display)}</span>;
}
