"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

type Node = { label: string; detail: string };

/**
 * Animated architecture diagram derived from the project's published
 * stack. The connectors draw themselves, then each layer fades up.
 */
export function ArchitectureDiagram({
  nodes,
  accent = "var(--indigo)",
}: {
  nodes: Node[];
  accent?: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full flex-col gap-0">
        {nodes.map((node, index) => (
          <div key={node.label} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, ease: EASE, delay: index * 0.12 }}
              className="w-full rounded-[16px] border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3"
            >
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ background: accent }}
                />
                <p className="text-[13.5px] font-semibold text-[var(--text)]">
                  {node.label}
                </p>
              </div>
              <p className="mt-1 pl-[18px] text-[12.5px] leading-relaxed text-[var(--text-2)]">
                {node.detail}
              </p>
            </motion.div>

            {index < nodes.length - 1 ? (
              <motion.svg
                width="16"
                height="30"
                viewBox="0 0 16 30"
                fill="none"
                aria-hidden
                className="my-1 shrink-0"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.45, ease: EASE, delay: index * 0.12 + 0.18 }}
              >
                <motion.path
                  d="M8 0 V22"
                  stroke={accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
                <motion.path
                  d="M4 22 L8 29 L12 22"
                  stroke={accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
                />
              </motion.svg>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
