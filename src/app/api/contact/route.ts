import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/** Optional Supabase mirror (insert-only, service role key). */
async function mirrorToSupabase(payload: {
  name: string;
  email: string;
  phone: string | null;
  project_type: string;
  budget: string;
  message: string;
  locale: string;
  source: string;
}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const table = process.env.SUPABASE_CONTACT_TABLE ?? "contact_submissions";
  if (!url || !key) return { delivered: false, reason: "not-configured" };

  try {
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(payload),
    });
    return { delivered: res.ok, reason: res.ok ? "ok" : `http-${res.status}` };
  } catch (error) {
    return {
      delivered: false,
      reason: error instanceof Error ? error.message : "unknown",
    };
  }
}

/** Optional transactional e-mail through Resend. */
async function sendEmailNotification(input: {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM ?? "Portfolio <onboarding@resend.dev>";
  const to = process.env.RESEND_TO ?? siteConfig.email;
  if (!apiKey) return { delivered: false, reason: "not-configured" };

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: input.email,
        subject: `New project brief — ${input.projectType} (${input.name})`,
        text: [
          `Name: ${input.name}`,
          `Email / WhatsApp: ${input.email}`,
          `Project type: ${input.projectType}`,
          `Budget: ${input.budget}`,
          "",
          input.message,
        ].join("\n"),
      }),
    });
    return { delivered: res.ok, reason: res.ok ? "ok" : `http-${res.status}` };
  } catch (error) {
    return {
      delivered: false,
      reason: error instanceof Error ? error.message : "unknown",
    };
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return Response.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Honeypot: silently accept, never persist.
  if (data.company && data.company.length > 0) {
    return Response.json({ ok: true, id: null }, { status: 200 });
  }

  const limit = rateLimit(clientKey(request, "contact"), RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    return Response.json(
      {
        ok: false,
        error: "Too many messages sent. Please try again shortly.",
        retryAfterSeconds: limit.retryAfterSeconds,
      },
      { status: 429 },
    );
  }

  const userAgent = request.headers.get("user-agent") ?? null;

  try {
    const [inserted] = await db
      .insert(contactSubmissions)
      .values({
        name: data.name,
        email: data.email,
        phone: /^\+?[\d\s()-]{7,20}$/.test(data.email) ? data.email : null,
        projectType: data.projectType,
        budget: data.budget,
        message: data.message,
        locale: data.locale,
        source: "portfolio-web",
        userAgent,
      })
      .returning({ id: contactSubmissions.id });

    // Fire and forget the optional external channels.
    void mirrorToSupabase({
      name: data.name,
      email: data.email,
      phone: /^\+?[\d\s()-]{7,20}$/.test(data.email) ? data.email : null,
      project_type: data.projectType,
      budget: data.budget,
      message: data.message,
      locale: data.locale,
      source: "portfolio-web",
    });
    void sendEmailNotification(data);

    return Response.json({ ok: true, id: inserted?.id ?? null }, { status: 201 });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: "Could not save the brief. Please use WhatsApp or e-mail.",
        detail: error instanceof Error ? error.message : undefined,
      },
      { status: 500 },
    );
  }
}
