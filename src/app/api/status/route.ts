import { getSiteStatuses } from "@/lib/live-data";

export const revalidate = 300;

export async function GET() {
  const statuses = await getSiteStatuses();
  return Response.json(
    { statuses, checkedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=1800" } },
  );
}
