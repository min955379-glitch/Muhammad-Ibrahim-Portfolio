"use client";

import { motion } from "framer-motion";
import type { ElementType } from "react";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type SplitTextProps = {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  /** Highlights the final word with the brand gradient. */
  accentLast?: boolean;
};

/**
 * Word-by-word reveal used for the hero headline. The headline stays a
 * single balanced block so it never exceeds three clean lines, while each
 * word still animates out of its own overflow mask.
 */
export function SplitText({
  text,
  className,
  as = "h1",
  delay = 0,
  stagger = 0.075,
  accentLast = false,
}: SplitTextProps) {
  const words = text.split(" ");
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.h1;

  return (
    <MotionTag
      className={cn("max-w-[15ch] sm:max-w-[20ch] lg:max-w-none", className)}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {words.map((word, index) => {
        const isLast = index === words.length - 1;
        return (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden pb-[0.1em] pr-[0.26em] align-bottom"
            aria-hidden
          >
            <motion.span
              className={cn(
                "inline-block",
                accentLast && isLast && "brand-text",
              )}
              variants={{
                hidden: { y: "110%", rotateX: -55, opacity: 0 },
                show: {
                  y: "0%",
                  rotateX: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.85,
                    ease: EASE,
                    delay: delay + index * stagger,
                  },
                },
              }}
            >
              {word}
            </motion.span>
          </span>
        );
      })}
    </MotionTag>
  );
}
