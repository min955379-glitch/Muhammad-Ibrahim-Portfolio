"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section, SectionShell } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { useApp } from "@/components/providers/app-providers";
import { useToast } from "@/components/providers/toast-provider";
import { usePktClock } from "@/hooks/use-pkt-clock";
import { getDictionary } from "@/lib/i18n";
import { budgetRanges, projectTypes } from "@/lib/content";
import { siteConfig, whatsappMessages } from "@/lib/site";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FieldErrors = Partial<Record<string, string>>;

const fieldClass =
  "min-h-[48px] w-full rounded-[13px] border border-[var(--glass-border)] bg-[var(--bg-deep)] px-4 text-[14.5px] text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--sky)]";

export function Contact() {
  const { locale } = useApp();
  const dict = getDictionary(locale);
  const { toast } = useToast();
  const clock = usePktClock();

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: projectTypes[0],
    budget: budgetRanges[1],
    message: "",
    company: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, locale }),
      });
      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (!response.ok || !data.ok) {
        setErrors(data.fieldErrors ?? {});
        setStatus("error");
        toast(data.error ?? dict.contact.error, "download");
        return;
      }

      setStatus("success");
      toast(dict.contact.success);
      setForm({
        name: "",
        email: "",
        projectType: projectTypes[0],
        budget: budgetRanges[1],
        message: "",
        company: "",
      });
    } catch {
      setStatus("error");
      toast(dict.contact.error, "download");
    }
  }

  const whatsappHref = `https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessages.general}`;
  const mailHref = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    "Project brief",
  )}&body=${encodeURIComponent(form.message || "Hi Muhammad Ibrahim,")}`;

  return (
    <Section id="contact" tone="deep">
      <SectionShell>
        <Reveal>
          <SectionHeading
            index="09 // DIRECT CONTACT · ABBOTTABAD, PK"
            label="Contact"
            title={dict.contact.title}
            subtitle={dict.contact.subtitle}
            accent="sky"
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* Quick actions */}
          <Reveal>
            <div className="glass flex h-full flex-col gap-3 rounded-[24px] p-5 sm:p-6">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-[16px] border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3.5 transition-colors hover:border-[var(--sky)]"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] text-[var(--text-3)]">
                    WhatsApp Business: {siteConfig.phoneDisplay}
                  </span>
                  <span className="mt-0.5 block text-[14px] font-semibold text-[var(--text)]">
                    Chat ↗
                  </span>
                </span>
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: "var(--brand-grad)" }}
                >
                  W
                </span>
              </a>

              <a
                href={`tel:${siteConfig.phoneIntl}`}
                className="group flex items-center justify-between gap-3 rounded-[16px] border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3.5 transition-colors hover:border-[var(--sky)]"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] text-[var(--text-3)]">
                    Tap to Call: +92 348 5581969
                  </span>
                  <span className="mt-0.5 block text-[14px] font-semibold text-[var(--text)]">
                    Call ↗
                  </span>
                </span>
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: "var(--brand-grad)" }}
                >
                  C
                </span>
              </a>

              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard
                    ?.writeText(siteConfig.email)
                    .then(() => toast(dict.common.copied))
                    .catch(() => toast(siteConfig.email));
                }}
                className="group flex items-center justify-between gap-3 rounded-[16px] border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3.5 text-left transition-colors hover:border-[var(--sky)]"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] text-[var(--text-3)]">
                    Email: {siteConfig.email}
                  </span>
                  <span className="mt-0.5 block text-[14px] font-semibold text-[var(--text)]">
                    {dict.common.copy}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: "var(--brand-grad)" }}
                >
                  E
                </span>
              </button>

              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-3 rounded-[16px] border border-[var(--glass-border)] bg-[var(--glass)] px-4 py-3.5 transition-colors hover:border-[var(--sky)]"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] text-[var(--text-3)]">
                    GitHub: {siteConfig.githubHandle}
                  </span>
                  <span className="mt-0.5 block text-[14px] font-semibold text-[var(--text)]">
                    Open ↗
                  </span>
                </span>
                <span
                  aria-hidden
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: "var(--brand-grad)" }}
                >
                  G
                </span>
              </a>

              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-[var(--glass-border)] pt-4">
                <div>
                  <p className="eyebrow text-[var(--text-3)]">Location</p>
                  <p className="mt-1.5 text-[14px] font-semibold text-[var(--text)]">
                    {siteConfig.location}
                  </p>
                </div>
                <div>
                  <p className="eyebrow text-[var(--text-3)]">
                    Local time (PKT)
                  </p>
                  <p className="mt-1.5 font-mono text-[14px] tnum text-[var(--text)]">
                    {clock.time}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--text-3)]">
                    {clock.date}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={1}>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="glass relative overflow-hidden rounded-[24px] p-5 sm:p-6"
            >
              <p className="eyebrow text-[var(--sky)]">Send project brief</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="cName"
                    className="mb-1.5 block text-[12.5px] font-semibold text-[var(--text-2)]"
                  >
                    {dict.contact.name}
                  </label>
                  <input
                    id="cName"
                    name="name"
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="e.g. Ahmed Khan"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "cName-error" : undefined}
                    className={cn(fieldClass, errors.name && "border-[var(--rose)]")}
                  />
                  {errors.name ? (
                    <p id="cName-error" className="mt-1.5 text-[12px] text-[var(--rose)]">
                      {errors.name}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="cInfo"
                    className="mb-1.5 block text-[12.5px] font-semibold text-[var(--text-2)]"
                  >
                    {dict.contact.email}
                  </label>
                  <input
                    id="cInfo"
                    name="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="you@company.com or 03xx…"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "cInfo-error" : undefined}
                    className={cn(fieldClass, errors.email && "border-[var(--rose)]")}
                  />
                  {errors.email ? (
                    <p id="cInfo-error" className="mt-1.5 text-[12px] text-[var(--rose)]">
                      {errors.email}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="cType"
                    className="mb-1.5 block text-[12.5px] font-semibold text-[var(--text-2)]"
                  >
                    {dict.contact.projectType}
                  </label>
                  <select
                    id="cType"
                    name="projectType"
                    value={form.projectType}
                    onChange={(event) => update("projectType", event.target.value)}
                    className={fieldClass}
                  >
                    {projectTypes.map((type) => (
                      <option key={type} value={type} className="bg-[var(--surface)]">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="cBudget"
                    className="mb-1.5 block text-[12.5px] font-semibold text-[var(--text-2)]"
                  >
                    {dict.contact.budget}
                  </label>
                  <select
                    id="cBudget"
                    name="budget"
                    value={form.budget}
                    onChange={(event) => update("budget", event.target.value)}
                    className={fieldClass}
                  >
                    {budgetRanges.map((range) => (
                      <option key={range} value={range} className="bg-[var(--surface)]">
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="cMsg"
                    className="mb-1.5 block text-[12.5px] font-semibold text-[var(--text-2)]"
                  >
                    {dict.contact.message}
                  </label>
                  <textarea
                    id="cMsg"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={(event) => update("message", event.target.value)}
                    placeholder="What are you building, who is it for, and when do you need it live?"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "cMsg-error" : undefined}
                    className={cn(
                      fieldClass,
                      "min-h-[130px] resize-y py-3",
                      errors.message && "border-[var(--rose)]",
                    )}
                  />
                  {errors.message ? (
                    <p id="cMsg-error" className="mt-1.5 text-[12px] text-[var(--rose)]">
                      {errors.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Honeypot — hidden from users, catches bots */}
              <div className="absolute left-[-9999px] top-0" aria-hidden>
                <label htmlFor="cCompany">Company</label>
                <input
                  id="cCompany"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(event) => update("company", event.target.value)}
                />
              </div>

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn btn-primary min-h-[48px] flex-1 justify-center rounded-[14px] text-[14px] disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : dict.contact.submit}
                  <span aria-hidden>↗</span>
                </button>
                <a
                  href={mailHref}
                  className="btn btn-ghost min-h-[48px] justify-center rounded-[14px] text-[14px]"
                >
                  Send Email ↗
                </a>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost min-h-[48px] justify-center rounded-[14px] text-[14px]"
                >
                  Send WhatsApp ↗
                </a>
              </div>

              <AnimatePresence>
                {status === "success" ? (
                  <motion.p
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    role="status"
                    className="mt-4 flex items-center gap-2 rounded-xl border border-[color:var(--sky)] bg-[var(--sky-soft)] px-4 py-3 text-[13px] text-[var(--sky)]"
                  >
                    <span
                      aria-hidden
                      className="grid h-5 w-5 place-items-center rounded-full"
                      style={{ background: "var(--sky)" }}
                    >
                      ✓
                    </span>
                    {dict.contact.success}
                  </motion.p>
                ) : null}
                {status === "error" ? (
                  <motion.p
                    key="error"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    role="alert"
                    className="mt-4 flex items-center gap-2 rounded-xl border border-[color:var(--rose)] bg-[var(--rose-soft)] px-4 py-3 text-[13px] text-[var(--rose)]"
                  >
                    {dict.contact.error}
                  </motion.p>
                ) : null}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </SectionShell>
    </Section>
  );
}
