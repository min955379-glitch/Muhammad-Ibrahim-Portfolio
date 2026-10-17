"use client";

import { useEffect, useState } from "react";
import { getPktParts, MONTH_LABELS, WEEKDAY_LABELS } from "@/lib/utils";

export type PktClock = {
  time: string;
  date: string;
  ready: boolean;
};

/**
 * Pakistan Standard Time clock. The first client render emits a stable
 * placeholder so React never reports a hydration mismatch; the real
 * value starts ticking one second after mount.
 */
export function usePktClock(): PktClock {
  const [clock, setClock] = useState<PktClock>({
    time: "--:--:--",
    date: "—",
    ready: false,
  });

  useEffect(() => {
    const update = () => {
      const parts = getPktParts(new Date());
      setClock({
        time: [parts.hours, parts.minutes, parts.seconds]
          .map((value) => String(value).padStart(2, "0"))
          .join(":"),
        date: `${WEEKDAY_LABELS[parts.weekday]}, ${parts.day} ${
          MONTH_LABELS[parts.month - 1]
        } ${parts.year}`,
        ready: true,
      });
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return clock;
}
