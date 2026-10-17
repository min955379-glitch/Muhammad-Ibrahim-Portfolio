import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  try {
    await db.execute(sql`select 1`);
    return Response.json({
      ok: true,
      database: "reachable",
      latencyMs: Date.now() - startedAt,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        ok: false,
        database: "unreachable",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
