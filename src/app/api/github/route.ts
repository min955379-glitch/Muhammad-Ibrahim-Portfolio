import { getGithubSummary } from "@/lib/live-data";

export const revalidate = 3600;

export async function GET() {
  const summary = await getGithubSummary();
  return Response.json(summary, {
    headers: { "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
  });
}
