import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Accent = "indigo" | "violet" | "sky" | "rose" | "amber";

export const accentVar: Record<Accent, string> = {
  indigo: "var(--indigo)",
  violet: "var(--violet)",
  sky: "var(--sky)",
  rose: "var(--rose)",
  amber: "var(--amber)",
};

export const accentSoftVar: Record<Accent, string> = {
  indigo: "var(--indigo-soft)",
  violet: "var(--violet-soft)",
  sky: "var(--sky-soft)",
  rose: "var(--rose-soft)",
  amber: "var(--amber-soft)",
};

type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
  accent?: Accent;
  align?: "left" | "center";
  children?: ReactNode;
  className?: string;
};

export function SectionHeading({
  index,
  label,
  title,
  subtitle,
  accent = "indigo",
  align = "left",
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <div
        className="flex items-center gap-3"
        style={{ color: accentVar[accent] }}
      >
        <span className="eyebrow">{index}</span>
        <span
          aria-hidden
          className="h-px w-10"
          style={{ background: accentVar[accent] }}
        />
        <span className="eyebrow text-[var(--text-2)]">{label}</span>
      </div>
      <h2 className="max-w-3xl text-[clamp(1.75rem,5vw,2.75rem)] font-bold leading-[1.08] text-[var(--text)]">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-[15px] leading-relaxed text-[var(--text-2)] sm:text-base">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );
}
