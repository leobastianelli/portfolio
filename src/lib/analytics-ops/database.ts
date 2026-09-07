import postgres from "postgres";
import type { ClarityRow, GscPageRow, GscQueryRow, PostHogRow } from "@/lib/analytics-ops/types";

export async function persistAnalytics(
  databaseUrl: string,
  input: {
    gsc?: { pages: GscPageRow[]; queries: GscQueryRow[] };
    posthog?: PostHogRow[];
    clarity?: ClarityRow[];
  },
): Promise<void> {
  const sql = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    ssl: "require",
    connect_timeout: 10,
    idle_timeout: 5,
  });

  try {
    await sql.begin(async (tx) => {
      for (const row of input.gsc?.pages ?? []) {
        await tx`
          insert into analytics_page_day (
            date, page_key, locale, content_type, content_slug,
            gsc_impressions, gsc_clicks, gsc_ctr, gsc_position, updated_at
          ) values (
            ${row.date}, ${row.pageKey}, ${row.locale}, ${row.contentType}, ${row.contentSlug},
            ${row.impressions}, ${row.clicks}, ${row.ctr}, ${row.position}, now()
          )
          on conflict (date, page_key) do update set
            locale = excluded.locale,
            content_type = excluded.content_type,
            content_slug = excluded.content_slug,
            gsc_impressions = excluded.gsc_impressions,
            gsc_clicks = excluded.gsc_clicks,
            gsc_ctr = excluded.gsc_ctr,
            gsc_position = excluded.gsc_position,
            updated_at = now()
        `;
      }

      for (const row of input.gsc?.queries ?? []) {
        await tx`
          insert into analytics_gsc_query_page_day (
            date, page_key, query, device, country,
            impressions, clicks, ctr, position, updated_at
          ) values (
            ${row.date}, ${row.pageKey}, ${row.query}, ${row.device}, ${row.country},
            ${row.impressions}, ${row.clicks}, ${row.ctr}, ${row.position}, now()
          )
          on conflict (date, page_key, query, device, country) do update set
            impressions = excluded.impressions,
            clicks = excluded.clicks,
            ctr = excluded.ctr,
            position = excluded.position,
            updated_at = now()
        `;
      }

      for (const row of input.posthog ?? []) {
        await tx`
          insert into analytics_page_day (
            date, page_key, locale, content_type, content_slug,
            posthog_pageviews, posthog_visitors, posthog_contact_clicks,
            posthog_project_link_clicks, posthog_note_reads, updated_at
          ) values (
            ${row.date}, ${row.pageKey}, ${row.locale}, ${row.contentType}, ${row.contentSlug},
            ${row.pageviews}, ${row.visitors}, ${row.contactClicks},
            ${row.projectLinkClicks}, ${row.noteReads}, now()
          )
          on conflict (date, page_key) do update set
            locale = excluded.locale,
            content_type = excluded.content_type,
            content_slug = excluded.content_slug,
            posthog_pageviews = excluded.posthog_pageviews,
            posthog_visitors = excluded.posthog_visitors,
            posthog_contact_clicks = excluded.posthog_contact_clicks,
            posthog_project_link_clicks = excluded.posthog_project_link_clicks,
            posthog_note_reads = excluded.posthog_note_reads,
            updated_at = now()
        `;
      }

      for (const row of input.clarity ?? []) {
        await tx`
          insert into analytics_page_day (
            date, page_key, locale, content_type, content_slug,
            clarity_sessions, clarity_engagement_seconds, clarity_scroll_depth,
            clarity_dead_clicks, clarity_rage_clicks, clarity_quickbacks,
            clarity_script_errors, updated_at
          ) values (
            ${row.date}, ${row.pageKey}, ${row.locale}, ${row.contentType}, ${row.contentSlug},
            ${row.sessions}, ${row.engagementSeconds}, ${row.scrollDepth},
            ${row.deadClicks}, ${row.rageClicks}, ${row.quickbacks},
            ${row.scriptErrors}, now()
          )
          on conflict (date, page_key) do update set
            locale = excluded.locale,
            content_type = excluded.content_type,
            content_slug = excluded.content_slug,
            clarity_sessions = excluded.clarity_sessions,
            clarity_engagement_seconds = excluded.clarity_engagement_seconds,
            clarity_scroll_depth = excluded.clarity_scroll_depth,
            clarity_dead_clicks = excluded.clarity_dead_clicks,
            clarity_rage_clicks = excluded.clarity_rage_clicks,
            clarity_quickbacks = excluded.clarity_quickbacks,
            clarity_script_errors = excluded.clarity_script_errors,
            updated_at = now()
        `;
      }
    });
  } finally {
    await sql.end({ timeout: 2 });
  }
}
