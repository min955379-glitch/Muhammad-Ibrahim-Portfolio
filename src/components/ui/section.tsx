import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  children,
  className,
  tone = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "default" | "raised" | "deep";
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden py-16 sm:py-20 lg:py-24",
        tone === "raised" && "bg-[var(--surface)]/40",
        tone === "deep" && "bg-[var(--bg-deep)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("section-shell relative", className)}>{children}</div>
  );
}
