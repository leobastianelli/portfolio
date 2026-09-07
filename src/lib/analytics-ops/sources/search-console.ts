import { getGoogleAccessToken } from "@/lib/analytics-ops/google-auth";
import { pageContextFromUrl } from "@/lib/analytics-ops/page-context";
import type { GscPageRow, GscQueryRow } from "@/lib/analytics-ops/types";

type Account = Parameters<typeof getGoogleAccessToken>[0];
type SearchRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

async function queryRows(
  accessToken: string,
  siteUrl: string,
  startDate: string,
  endDate: string,
  dimensions: string[],
): Promise<SearchRow[]> {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const rows: SearchRow[] = [];

  for (let startRow = 0; startRow < 50_000; startRow += 25_000) {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        authorization: `Bearer ${accessToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions,
        type: "web",
        dataState: "final",
        aggregationType: "auto",
        rowLimit: 25_000,
        startRow,
      }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error(`Search Console returned ${response.status}`);
    const body = (await response.json()) as { rows?: SearchRow[] };
    const page = body.rows ?? [];
    rows.push(...page);
    if (page.length < 25_000) break;
  }

  return rows;
}

export async function fetchSearchConsoleRange(
  account: Account,
  siteUrl: string,
  startDate: string,
  endDate: string,
): Promise<{ pages: GscPageRow[]; queries: GscQueryRow[] }> {
  const accessToken = await getGoogleAccessToken(account);
  const [pageRows, queryRowsResult] = await Promise.all([
    queryRows(accessToken, siteUrl, startDate, endDate, ["date", "page"]),
    queryRows(
      accessToken,
      siteUrl,
      startDate,
      endDate,
      ["date", "page", "query", "device", "country"],
    ),
  ]);

  const pages = pageRows.flatMap((row): GscPageRow[] => {
    const [date, page] = row.keys ?? [];
    const context = page ? pageContextFromUrl(page) : null;
    if (!context || !date) return [];
    return [{
      date,
      ...context,
      impressions: Math.round(row.impressions ?? 0),
      clicks: Math.round(row.clicks ?? 0),
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }];
  });

  const queries = queryRowsResult.flatMap((row): GscQueryRow[] => {
    const [date, page, query, device, country] = row.keys ?? [];
    const context = page ? pageContextFromUrl(page) : null;
    if (!context || !date || !query) return [];
    return [{
      date,
      pageKey: context.pageKey,
      query,
      device: device || "ALL",
      country: country || "ALL",
      impressions: Math.round(row.impressions ?? 0),
      clicks: Math.round(row.clicks ?? 0),
      ctr: row.ctr ?? 0,
      position: row.position ?? 0,
    }];
  });

  return { pages, queries };
}
