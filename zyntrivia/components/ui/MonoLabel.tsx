import type { ReactNode } from "react";

/** Monospaced metadata label — everything the *system* says is mono. */
export function MonoLabel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`font-mono text-[12px] uppercase tracking-[0.08em] text-outline ${className}`}
    >
      {children}
    </span>
  );
}
