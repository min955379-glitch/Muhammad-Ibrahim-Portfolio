import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  separator = "◆",
}: {
  items: string[];
  className?: string;
  separator?: string;
}) {
  const doubled = [...items, ...items];

  return (
    <div className={cn("marquee-wrap marquee-mask overflow-hidden", className)}>
      <div className="marquee-track" aria-hidden>
        {doubled.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-6 pr-6 font-mono text-[12px] tracking-[0.14em] whitespace-nowrap text-[var(--text-3)]"
          >
            {item}
            <span style={{ color: "var(--sky)" }}>{separator}</span>
          </span>
        ))}
      </div>
      <span className="sr-only">{items.join(", ")}</span>
    </div>
  );
}
