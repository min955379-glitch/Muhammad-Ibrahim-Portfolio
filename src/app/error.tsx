"use client";

import { useEffect } from "react";
import { siteConfig } from "@/lib/site";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-[var(--header-h)]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 h-[380px] w-[380px] -translate-x-1/2 rounded-full opacity-40 blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(244,63,94,0.55), transparent 70%)",
        }}
      />
      <div className="w-full max-w-lg text-center">
        <p className="eyebrow" style={{ color: "var(--rose)" }}>
          Runtime error
        </p>
        <h1 className="mt-4 text-[clamp(2rem,8vw,3.25rem)] font-bold leading-[1.05] text-[var(--text)]">
          Something broke on the way down.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--text-2)]">
          The page hit an unexpected error. Reload to try again, or reach out
          directly on WhatsApp.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="btn btn-primary min-h-[48px] justify-center rounded-[14px] px-6 text-[14px]"
          >
            Reload page
          </button>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost min-h-[48px] justify-center rounded-[14px] px-6 text-[14px]"
          >
            WhatsApp ↗
          </a>
        </div>
      </div>
    </div>
  );
}
