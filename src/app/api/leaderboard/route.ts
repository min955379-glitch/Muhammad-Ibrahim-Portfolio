import { db } from "@/db";
import { arcadeScores } from "@/db/schema";
import { arcadeScoreSchema } from "@/lib/validation";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await db
      .select({
        id: arcadeScores.id,
        nickname: arcadeScores.nickname,
        score: arcadeScores.score,
        cores: arcadeScores.cores,
        createdAt: arcadeScores.createdAt,
      })
      .from(arcadeScores)
      .orderBy(desc(arcadeScores.score))
      .limit(10);

    return Response.json({ scores: rows });
  } catch {
    return Response.json({ scores: [] });
  }
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid body." }, { status: 400 });
  }

  const parsed = arcadeScoreSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Invalid score payload." },
      { status: 422 },
    );
  }

  const limit = rateLimit(clientKey(request, "arcade"), 20, 60 * 1000);
  if (!limit.ok) {
    return Response.json(
      { ok: false, error: "Too many submissions." },
      { status: 429 },
    );
  }

  try {
    const [inserted] = await db
      .insert(arcadeScores)
      .values(parsed.data)
      .returning({ id: arcadeScores.id });
    return Response.json({ ok: true, id: inserted?.id ?? null }, { status: 201 });
  } catch {
    return Response.json(
      { ok: false, error: "Could not save the score." },
      { status: 500 },
    );
  }
}
