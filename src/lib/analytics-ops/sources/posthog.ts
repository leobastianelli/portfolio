import { nextIsoDate, pageContextFromUrl } from "@/lib/analytics-ops/page-context";
import type { PostHogRow } from "@/lib/analytics-ops/types";

type QueryResponse = {
  columns?: string[];
  results?: unknown[][];
};

function number(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function fetchPostHogRange(
  host: string,
  projectId: string,
  apiKey: string,
  startDate: string,
  endDateInclusive: string,
): Promise<PostHogRow[]> {
  const endDateExclusive = nextIsoDate(endDateInclusive);
  const query = `
    SELECT
      toString(toDate(timestamp)) AS date,
      if(
        notEmpty(toString(properties.page_key)),
        toString(properties.page_key),
        toString(properties.$pathname)
      ) AS page_key,
      any(toString(properties.locale)) AS locale,
      any(toString(properties.content_type)) AS content_type,
      any(toString(properties.content_slug)) AS content_slug,
      countIf(event = '$pageview') AS pageviews,
      uniqIf(distinct_id, event = '$pageview') AS visitors,
      countIf(event = 'contact_click') AS contact_clicks,
      countIf(event = 'project_link_click') AS project_link_clicks,
      countIf(event = 'note_read') AS note_reads
    FROM events
    WHERE timestamp >= toDateTime('${startDate} 00:00:00', 'UTC')
      AND timestamp < toDateTime('${endDateExclusive} 00:00:00', 'UTC')
      AND (
        toString(properties.environment) = 'production'
        OR (
          empty(toString(properties.environment))
          AND toString(properties.$host) IN ('leobastianelli.dev', 'www.leobastianelli.dev')
        )
      )
      AND notEmpty(page_key)
      AND event IN ('$pageview', 'contact_click', 'project_link_click', 'note_read')
    GROUP BY date, page_key
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
    const date = String(row[0] ?? "");
    const context = pageContextFromUrl(String(row[1] ?? ""));
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !context) return [];
    const rawLocale = String(row[2] ?? "unknown");
    const rawContentType = String(row[3] ?? "unknown");
    const locale = rawLocale === "en" || rawLocale === "es" ? rawLocale : context.locale;
    const contentType = ["home", "notes_index", "note"].includes(rawContentType)
      ? (rawContentType as PostHogRow["contentType"])
      : context.contentType;
    const contentSlug = String(row[4] ?? "") || context.contentSlug;

    return [{
      date,
      pageKey: context.pageKey,
      locale,
      contentType,
      contentSlug,
      pageviews: number(row[5]),
      visitors: number(row[6]),
      contactClicks: number(row[7]),
      projectLinkClicks: number(row[8]),
      noteReads: number(row[9]),
    }];
  });
}
