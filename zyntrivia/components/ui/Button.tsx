import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 font-display text-label-sm uppercase tracking-[0.12em] transition-all duration-150 ease-mechanical rounded-none";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white px-8 py-4 hover:brightness-110",
  secondary:
    "border border-outline-variant text-on-surface px-8 py-4 hover:border-outline",
  ghost:
    "text-on-surface-variant border-b border-transparent py-1 px-0 hover:border-on-surface-variant",
};

export function Button({
  href,
  onClick,
  type,
  variant = "primary",
  className = "",
  disabled,
  children,
}: {
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: Variant;
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}) {
  const cls = `${base} ${variants[variant]} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} onClick={onClick} className={cls} disabled={disabled}>
      {children}
    </button>
  );
}
