import { analyticsConfig } from "@/lib/analytics-ops/config";
import { isAuthorizedCron } from "@/lib/analytics-ops/cron-auth";
import { generateRecommendations } from "@/lib/analytics-ops/recommendations";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request): Promise<Response> {
  if (!isAuthorizedCron(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await generateRecommendations(analyticsConfig().databaseUrl);
    console.info("analytics recommendations", result);
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected recommendation error";
    console.error("analytics recommendations failed", { message });
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}
