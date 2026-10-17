"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "download" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  download: "btn-download",
  ghost: "btn-ghost",
  outline:
    "border border-[var(--glass-border)] bg-transparent text-[var(--text)] hover:bg-[var(--glass)]",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-[40px] rounded-[12px] px-3.5 text-[13px]",
  md: "min-h-[48px] rounded-[14px] px-5 text-[15px]",
  lg: "min-h-[54px] rounded-[16px] px-6 text-[16px]",
};

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "btn",
        variantClass[variant],
        sizeClass[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "btn",
        variantClass[variant],
        sizeClass[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** Anchor that behaves like a button but works for external URLs. */
export function ButtonAnchor({
  variant = "ghost",
  size = "md",
  className,
  children,
  fullWidth,
  ...rest
}: BaseProps & ComponentProps<"a">) {
  return (
    <a
      className={cn(
        "btn",
        variantClass[variant],
        sizeClass[size],
        fullWidth && "w-full",
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
