import type { ReactNode } from "react";

/** Tonal surface card — no shadows, hairline outline, generous padding. */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-md border border-outline-variant bg-surface p-8 md:p-10 ${className}`}
    >
      {children}
    </div>
  );
}
