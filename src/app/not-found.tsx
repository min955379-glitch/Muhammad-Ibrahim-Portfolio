import Link from "next/link";
import { navItems } from "@/lib/site";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 pt-[var(--header-h)]">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-bg absolute inset-0 opacity-50" />
        <div
          className="absolute left-1/2 top-1/4 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-40 blur-[90px]"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.6), transparent 70%)",
          }}
        />
      </div>

      <div className="w-full max-w-xl text-center">
        <p className="eyebrow text-[var(--sky)]">Error 404</p>
        <h1 className="mt-4 text-[clamp(2.25rem,9vw,4rem)] font-bold leading-[1.02] text-[var(--text)]">
          This page drifted
          <span className="brand-text"> out of orbit.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[var(--text-2)]">
          The URL you requested does not exist on this site. Every section
          below still works.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Link
            href="/"
            className="btn btn-primary min-h-[48px] justify-center rounded-[14px] px-6 text-[14px]"
          >
            Back to home ↗
          </Link>
          <a
            href="#contact"
            className="btn btn-ghost min-h-[48px] justify-center rounded-[14px] px-6 text-[14px]"
          >
            Contact
          </a>
        </div>

        <nav aria-label="Site sections" className="mt-10">
          <ul className="flex flex-wrap justify-center gap-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`/#${item.id}`}
                  className="inline-flex min-h-[40px] items-center rounded-xl border border-[var(--glass-border)] bg-[var(--glass)] px-3.5 text-[12.5px] text-[var(--text-2)] transition-colors hover:text-[var(--sky)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
