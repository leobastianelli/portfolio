import { analyticsConfig } from "@/lib/analytics-ops/config";
import { persistAnalytics } from "@/lib/analytics-ops/database";
import { isoDateDaysAgo } from "@/lib/analytics-ops/page-context";
import { fetchClarity } from "@/lib/analytics-ops/sources/clarity";
import { fetchPostHogRange } from "@/lib/analytics-ops/sources/posthog";
import { fetchSearchConsoleRange } from "@/lib/analytics-ops/sources/search-console";

type SourceName = "clarity" | "posthog" | "search_console";
type SourceResult = { ok: true; rows: number } | { ok: false; error: string };

function safeFailure(reason: unknown): string {
  return reason instanceof Error ? reason.message : "Unexpected source error";
}

export async function ingestDailyAnalytics(): Promise<{
  ok: boolean;
  dates: {
    clarity: string;
    behaviorStart: string;
    behaviorEnd: string;
    searchConsoleStart: string;
    searchConsoleEnd: string;
  };
  sources: Record<SourceName, SourceResult>;
}> {
  const config = analyticsConfig();
  const clarityDate = isoDateDaysAgo(1);
  const behaviorStart = isoDateDaysAgo(28);
  const behaviorEnd = isoDateDaysAgo(1);
  const searchConsoleStart = isoDateDaysAgo(30);
  const searchConsoleEnd = isoDateDaysAgo(3);
  const [clarity, posthog, searchConsole] = await Promise.allSettled([
    fetchClarity(config.clarityToken, clarityDate),
    fetchPostHogRange(
      config.posthogHost,
      config.posthogProjectId,
      config.posthogApiKey,
      behaviorStart,
      behaviorEnd,
    ),
    fetchSearchConsoleRange(
      config.serviceAccount,
      config.gscSiteUrl,
      searchConsoleStart,
      searchConsoleEnd,
    ),
  ]);

  await persistAnalytics(config.databaseUrl, {
    clarity: clarity.status === "fulfilled" ? clarity.value : undefined,
    posthog: posthog.status === "fulfilled" ? posthog.value : undefined,
    gsc: searchConsole.status === "fulfilled" ? searchConsole.value : undefined,
  });

  const sources: Record<SourceName, SourceResult> = {
    clarity: clarity.status === "fulfilled"
      ? { ok: true, rows: clarity.value.length }
      : { ok: false, error: safeFailure(clarity.reason) },
    posthog: posthog.status === "fulfilled"
      ? { ok: true, rows: posthog.value.length }
      : { ok: false, error: safeFailure(posthog.reason) },
    search_console: searchConsole.status === "fulfilled"
      ? { ok: true, rows: searchConsole.value.pages.length + searchConsole.value.queries.length }
      : { ok: false, error: safeFailure(searchConsole.reason) },
  };

  console.info("analytics ingestion", {
    dates: {
      clarity: clarityDate,
      behaviorStart,
      behaviorEnd,
      searchConsoleStart,
      searchConsoleEnd,
    },
    sources,
  });

  return {
    ok: Object.values(sources).every((source) => source.ok),
    dates: {
      clarity: clarityDate,
      behaviorStart,
      behaviorEnd,
      searchConsoleStart,
      searchConsoleEnd,
    },
    sources,
  };
}
