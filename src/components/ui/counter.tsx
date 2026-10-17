"use client";

import { useInView } from "@/hooks/use-in-view";
import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

type CounterProps = {
  value: number;
  className?: string;
  suffix?: string;
  duration?: number;
};

export function Counter({
  value,
  className,
  suffix,
  duration = 1400,
}: CounterProps) {
  const { ref, inView } = useInView<HTMLSpanElement>({ threshold: 0.4, once: true });
  const current = useCountUp(value, inView, duration);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {current.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}
