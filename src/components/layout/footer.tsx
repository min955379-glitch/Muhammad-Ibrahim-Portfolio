import Link from "next/link";
import { navItems, siteConfig } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[var(--glass-border)] bg-[var(--bg-deep)]">
      <div className="section-shell py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="grid h-9 w-9 place-items-center rounded-[11px] text-[13px] font-bold text-[#04060e]"
                style={{ background: "var(--brand-grad)" }}
              >
                MI
              </span>
              <span className="font-display text-[15px] font-semibold text-[var(--text)]">
                {siteConfig.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--text-2)]">
              {siteConfig.description}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--sky)]"
              >
                GitHub ↗
              </a>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--sky)]"
              >
                WhatsApp ↗
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-medium text-[var(--text)] transition-colors hover:text-[var(--sky)]"
              >
                Email ↗
              </a>
            </div>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="link-underline inline-flex min-h-[36px] items-center text-sm text-[var(--text-2)] transition-colors hover:text-[var(--text)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[var(--glass-border)] pt-6 text-xs text-[var(--text-3)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name} · {siteConfig.location}. All rights
            reserved.
          </p>
          <p className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--sky)" }}
            />
            {siteConfig.locationShort} · {siteConfig.timezoneLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}
