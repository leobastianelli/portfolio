import { pageContextFromUrl } from "@/lib/analytics-ops/page-context";
import type { ClarityRow } from "@/lib/analytics-ops/types";

type ClarityMetric = {
  metricName?: string;
  information?: Array<Record<string, unknown>>;
};

function normalizedKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function readValue(record: Record<string, unknown>, names: string[]): unknown {
  const entries = new Map(Object.entries(record).map(([key, value]) => [normalizedKey(key), value]));
  for (const name of names) {
    const value = entries.get(normalizedKey(name));
    if (value !== undefined) return value;
  }
}

function readNumber(record: Record<string, unknown>, names: string[]): number | null {
  const parsed = Number(readValue(record, names));
  return Number.isFinite(parsed) ? parsed : null;
}

export async function fetchClarity(token: string, date: string): Promise<ClarityRow[]> {
  const endpoint = new URL("https://www.clarity.ms/export-data/api/v1/project-live-insights");
  endpoint.searchParams.set("numOfDays", "1");
  endpoint.searchParams.set("dimension1", "URL");
  const response = await fetch(endpoint, {
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`Clarity returned ${response.status}`);
  const metrics = (await response.json()) as ClarityMetric[];
  const rows = new Map<string, ClarityRow>();

  for (const metric of metrics) {
    for (const info of metric.information ?? []) {
      const url = readValue(info, ["URL", "url"]);
      const context = typeof url === "string" ? pageContextFromUrl(url) : null;
      if (!context) continue;
      const row = rows.get(context.pageKey) ?? {
        date,
        ...context,
        sessions: 0,
        engagementSeconds: null,
        scrollDepth: null,
        deadClicks: 0,
        rageClicks: 0,
        quickbacks: 0,
        scriptErrors: 0,
      };
      const metricName = normalizedKey(metric.metricName ?? "");

      if (metricName === "traffic") {
        row.sessions = readNumber(info, ["totalSessionCount", "sessionCount", "sessions"]) ?? row.sessions;
      } else if (metricName === "engagementtime") {
        row.engagementSeconds = readNumber(info, ["engagementTime", "activeTime", "value"]);
      } else if (metricName === "scrolldepth") {
        row.scrollDepth = readNumber(info, ["scrollDepth", "averageScrollDepth", "value"]);
      } else if (metricName === "deadclickcount") {
        row.deadClicks = readNumber(info, ["deadClickCount", "count", "value"]) ?? 0;
      } else if (metricName === "rageclickcount") {
        row.rageClicks = readNumber(info, ["rageClickCount", "count", "value"]) ?? 0;
      } else if (metricName === "quickbackclick") {
        row.quickbacks = readNumber(info, ["quickbackClick", "quickbackCount", "count", "value"]) ?? 0;
      } else if (metricName === "scripterrorcount") {
        row.scriptErrors = readNumber(info, ["scriptErrorCount", "count", "value"]) ?? 0;
      }

      rows.set(context.pageKey, row);
    }
  }

  return [...rows.values()];
}
