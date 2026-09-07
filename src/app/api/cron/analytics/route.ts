import { isAuthorizedCron } from "@/lib/analytics-ops/cron-auth";
import { ingestDailyAnalytics } from "@/lib/analytics-ops/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request): Promise<Response> {
  if (!isAuthorizedCron(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await ingestDailyAnalytics();
    return Response.json(result, { status: result.ok ? 200 : 500 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected ingestion error";
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
