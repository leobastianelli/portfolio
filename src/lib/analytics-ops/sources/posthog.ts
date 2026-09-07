import { nextIsoDate } from "@/lib/analytics-ops/page-context";
import type { PostHogRow } from "@/lib/analytics-ops/types";

type QueryResponse = {
  columns?: string[];
  results?: unknown[][];
};

function number(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function fetchPostHog(
  host: string,
  projectId: string,
  apiKey: string,
  date: string,
): Promise<PostHogRow[]> {
  const endDate = nextIsoDate(date);
  const query = `
    SELECT
      toString(properties.page_key) AS page_key,
      any(toString(properties.locale)) AS locale,
      any(toString(properties.content_type)) AS content_type,
      any(toString(properties.content_slug)) AS content_slug,
      countIf(event = '$pageview') AS pageviews,
      uniqIf(distinct_id, event = '$pageview') AS visitors,
      countIf(event = 'contact_click') AS contact_clicks,
      countIf(event = 'project_link_click') AS project_link_clicks,
      countIf(event = 'note_read') AS note_reads
    FROM events
    WHERE timestamp >= toDateTime('${date} 00:00:00', 'UTC')
      AND timestamp < toDateTime('${endDate} 00:00:00', 'UTC')
      AND toString(properties.environment) = 'production'
      AND notEmpty(toString(properties.page_key))
      AND event IN ('$pageview', 'contact_click', 'project_link_click', 'note_read')
    GROUP BY page_key
  `;

  const response = await fetch(`${host}/api/projects/${encodeURIComponent(projectId)}/query/`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ query: { kind: "HogQLQuery", query } }),
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`PostHog returned ${response.status}`);
  const body = (await response.json()) as QueryResponse;

  return (body.results ?? []).flatMap((row): PostHogRow[] => {
    const pageKey = String(row[0] ?? "");
    if (!pageKey.startsWith("/")) return [];
    const rawLocale = String(row[1] ?? "unknown");
    const rawContentType = String(row[2] ?? "unknown");
    const locale = rawLocale === "en" || rawLocale === "es" ? rawLocale : "unknown";
    const contentType = ["home", "notes_index", "note"].includes(rawContentType)
      ? (rawContentType as PostHogRow["contentType"])
      : "unknown";
    const contentSlug = String(row[3] ?? "") || null;

    return [{
      date,
      pageKey,
      locale,
      contentType,
      contentSlug,
      pageviews: number(row[4]),
      visitors: number(row[5]),
      contactClicks: number(row[6]),
      projectLinkClicks: number(row[7]),
      noteReads: number(row[8]),
    }];
  });
}
