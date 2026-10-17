import {
  boolean,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

/**
 * Contact form submissions captured on the local Postgres instance.
 * The same payload is mirrored to Supabase (RLS insert-only) when
 * SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are configured.
 */
export const contactSubmissions = pgTable(
  "contact_submissions",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    projectType: text("project_type").notNull(),
    budget: text("budget").notNull(),
    message: text("message").notNull(),
    locale: text("locale").notNull().default("en"),
    source: text("source").notNull().default("web"),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("contact_submissions_created_at_idx").on(table.createdAt)],
);

/**
 * Cyber-Nova arcade leaderboard. Anonymous nicknames only — no accounts,
 * no e-mail, no tracking identifiers.
 */
export const arcadeScores = pgTable(
  "arcade_scores",
  {
    id: serial("id").primaryKey(),
    nickname: text("nickname").notNull(),
    score: integer("score").notNull(),
    cores: integer("cores").notNull().default(0),
    durationSec: integer("duration_sec").notNull().default(0),
    locale: text("locale").notNull().default("en"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("arcade_scores_score_idx").on(table.score)],
);

/**
 * Server-side cache of live deployment probes so the status strip can be
 * rendered without hammering third-party hosts on every request.
 */
export const siteStatusCache = pgTable("site_status_cache", {
  key: text("key").primaryKey(),
  url: text("url").notNull(),
  label: text("label").notNull(),
  online: boolean("online").notNull().default(false),
  statusCode: integer("status_code"),
  latencyMs: integer("latency_ms"),
  checkedAt: timestamp("checked_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
