import { timingSafeEqual } from "node:crypto";
import { ingestDailyAnalytics } from "@/lib/analytics-ops/ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || !authorization) return false;
  const expected = `Bearer ${secret}`;
  const received = Buffer.from(authorization);
  const expectedBuffer = Buffer.from(expected);
  return received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
}

export async function GET(request: Request): Promise<Response> {
  if (!authorized(request)) {
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
