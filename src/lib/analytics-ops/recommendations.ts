import { createHash } from "node:crypto";
import postgres from "postgres";
import { isoDateDaysAgo } from "@/lib/analytics-ops/page-context";

type AggregateRow = Record<string, unknown> & { page_key: string };
type Evidence = Record<string, string | number | boolean>;
type Candidate = {
  fingerprint: string;
  rule: "seo_ctr_gap" | "intent_mismatch" | "ux_friction" | "conversion_gap";
  pageKey: string;
  score: number;
  confidence: "medium" | "high";
  evidence: Evidence;
  specMarkdown: string;
};

function number(row: AggregateRow, key: string): number {
  const value = Number(row[key]);
  return Number.isFinite(value) ? value : 0;
}

function ratio(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

function fingerprint(rule: string, pageKey: string): string {
  return createHash("sha256").update(`${rule}:${pageKey}`).digest("hex").slice(0, 24);
}

function spec(
  title: string,
  rule: Candidate["rule"],
  pageKey: string,
  evidence: Evidence,
  action: string,
  successMetric: string,
): string {
  return `# ${title}

Status: Draft — requires human approval
Rule: \`${rule}\`
Page: \`${pageKey}\`

## Evidence

\`\`\`json
${JSON.stringify(evidence, null, 2)}
\`\`\`

## Proposed change

${action}

## Success metric

${successMetric}

## Guardrails

- Do not reduce qualified-intent clicks or note reads.
- Preserve accessibility, localization, metadata, and canonical URLs.
- Ship one material hypothesis at a time and measure for at least 14 complete days.
`;
}

function buildCandidates(rows: AggregateRow[]): Candidate[] {
  const candidates: Candidate[] = [];

  for (const row of rows) {
    const pageKey = row.page_key;
    const curImpressions = number(row, "cur_impressions");
    const curClicks = number(row, "cur_clicks");
    const curPosition = number(row, "cur_position");
    const prevImpressions = number(row, "prev_impressions");
    const prevClicks = number(row, "prev_clicks");
    const curCtr = ratio(curClicks, curImpressions);
    const prevCtr = ratio(prevClicks, prevImpressions);
    const curPageviews = number(row, "cur_pageviews");
    const prevPageviews = number(row, "prev_pageviews");
    const curVisitors = number(row, "cur_visitors");
    const prevVisitors = number(row, "prev_visitors");
    const curIntentClicks = number(row, "cur_contact_clicks") + number(row, "cur_project_clicks");
    const prevIntentClicks = number(row, "prev_contact_clicks") + number(row, "prev_project_clicks");
    const curNoteRate = ratio(number(row, "cur_note_reads"), curPageviews);
    const prevNoteRate = ratio(number(row, "prev_note_reads"), prevPageviews);
    const claritySessions = number(row, "cur_clarity_sessions");
    const frictionClicks = number(row, "cur_dead_clicks") + number(row, "cur_rage_clicks");
    const frictionRate = ratio(frictionClicks * 100, claritySessions);

    if (
      curImpressions >= 200 &&
      prevImpressions >= 200 &&
      curPosition >= 4 &&
      curPosition <= 15 &&
      prevCtr > 0 &&
      curCtr < prevCtr * 0.8
    ) {
      const evidence = {
        current_impressions: curImpressions,
        current_clicks: curClicks,
        current_ctr: curCtr,
        previous_ctr: prevCtr,
        current_position: curPosition,
      };
      candidates.push({
        fingerprint: fingerprint("seo_ctr_gap", pageKey),
        rule: "seo_ctr_gap",
        pageKey,
        score: (prevCtr - curCtr) * curImpressions,
        confidence: curPageviews >= 50 ? "high" : "medium",
        evidence,
        specMarkdown: spec(
          "Close the organic CTR gap",
          "seo_ctr_gap",
          pageKey,
          evidence,
          "Review the query mix, title, description, and search intent. Draft one metadata/content hypothesis; do not change ranking-critical structure without review.",
          "Raise Search Console CTR toward the previous 28-day baseline without worsening average position.",
        ),
      });
    }

    if (
      curClicks >= 20 &&
      prevClicks >= 10 &&
      curClicks >= prevClicks * 1.25 &&
      curPageviews >= 50 &&
      prevPageviews >= 50 &&
      prevNoteRate > 0 &&
      curNoteRate < prevNoteRate * 0.8
    ) {
      const evidence = {
        current_organic_clicks: curClicks,
        previous_organic_clicks: prevClicks,
        current_note_read_rate: curNoteRate,
        previous_note_read_rate: prevNoteRate,
      };
      candidates.push({
        fingerprint: fingerprint("intent_mismatch", pageKey),
        rule: "intent_mismatch",
        pageKey,
        score: ratio(curClicks, Math.max(prevClicks, 1)) * (prevNoteRate - curNoteRate) * 100,
        confidence: "high",
        evidence,
        specMarkdown: spec(
          "Align landing content with search intent",
          "intent_mismatch",
          pageKey,
          evidence,
          "Compare rising search queries with the page opening and information hierarchy. Draft a focused change that answers the dominant intent earlier.",
          "Recover note-read rate while retaining the increase in organic clicks.",
        ),
      });
    }

    if (claritySessions >= 50 && frictionRate >= 5) {
      const evidence = {
        clarity_sessions: claritySessions,
        dead_clicks: number(row, "cur_dead_clicks"),
        rage_clicks: number(row, "cur_rage_clicks"),
        friction_clicks_per_100_sessions: frictionRate,
      };
      candidates.push({
        fingerprint: fingerprint("ux_friction", pageKey),
        rule: "ux_friction",
        pageKey,
        score: frictionRate,
        confidence: curVisitors >= 50 ? "high" : "medium",
        evidence,
        specMarkdown: spec(
          "Reduce interaction friction",
          "ux_friction",
          pageKey,
          evidence,
          "Inspect the relevant Clarity recordings and heatmaps to identify the exact control causing repeated or dead clicks before proposing a UI adjustment.",
          "Reduce dead and rage clicks per 100 sessions below 5.",
        ),
      });
    }

    const curIntentRate = ratio(curIntentClicks, curVisitors);
    const prevIntentRate = ratio(prevIntentClicks, prevVisitors);
    if (
      curVisitors >= 50 &&
      curIntentRate < 0.02 &&
      (prevVisitors < 50 || curIntentRate < prevIntentRate * 0.7)
    ) {
      const evidence = {
        current_visitors: curVisitors,
        current_qualified_clicks: curIntentClicks,
        current_qualified_intent_rate: curIntentRate,
        previous_qualified_intent_rate: prevIntentRate,
      };
      candidates.push({
        fingerprint: fingerprint("conversion_gap", pageKey),
        rule: "conversion_gap",
        pageKey,
        score: (0.02 - curIntentRate) * curVisitors,
        confidence: claritySessions >= 50 ? "high" : "medium",
        evidence,
        specMarkdown: spec(
          "Close the qualified-intent gap",
          "conversion_gap",
          pageKey,
          evidence,
          "Review CTA visibility, relevance, wording, and surrounding proof. Draft one change tied to the visitor's likely next step.",
          "Raise qualified-intent clicks per unique visitor above 2% without reducing engagement.",
        ),
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, 3);
}

export async function generateRecommendations(databaseUrl: string) {
  const currentStart = isoDateDaysAgo(30);
  const currentEnd = isoDateDaysAgo(3);
  const previousStart = isoDateDaysAgo(58);
  const previousEnd = isoDateDaysAgo(31);
  const sql = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    ssl: "require",
    connect_timeout: 10,
    idle_timeout: 5,
  });

  try {
    const rows = await sql<AggregateRow[]>`
      select
        page_key,
        coalesce(sum(gsc_impressions) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_impressions,
        coalesce(sum(gsc_clicks) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_clicks,
        coalesce(sum(gsc_position * gsc_impressions) filter (where date between ${currentStart} and ${currentEnd}) /
          nullif(sum(gsc_impressions) filter (where date between ${currentStart} and ${currentEnd}), 0), 0) as cur_position,
        coalesce(sum(gsc_impressions) filter (where date between ${previousStart} and ${previousEnd}), 0) as prev_impressions,
        coalesce(sum(gsc_clicks) filter (where date between ${previousStart} and ${previousEnd}), 0) as prev_clicks,
        coalesce(sum(posthog_pageviews) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_pageviews,
        coalesce(sum(posthog_pageviews) filter (where date between ${previousStart} and ${previousEnd}), 0) as prev_pageviews,
        coalesce(sum(posthog_visitors) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_visitors,
        coalesce(sum(posthog_visitors) filter (where date between ${previousStart} and ${previousEnd}), 0) as prev_visitors,
        coalesce(sum(posthog_contact_clicks) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_contact_clicks,
        coalesce(sum(posthog_project_link_clicks) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_project_clicks,
        coalesce(sum(posthog_contact_clicks) filter (where date between ${previousStart} and ${previousEnd}), 0) as prev_contact_clicks,
        coalesce(sum(posthog_project_link_clicks) filter (where date between ${previousStart} and ${previousEnd}), 0) as prev_project_clicks,
        coalesce(sum(posthog_note_reads) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_note_reads,
        coalesce(sum(posthog_note_reads) filter (where date between ${previousStart} and ${previousEnd}), 0) as prev_note_reads,
        coalesce(sum(clarity_sessions) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_clarity_sessions,
        coalesce(sum(clarity_dead_clicks) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_dead_clicks,
        coalesce(sum(clarity_rage_clicks) filter (where date between ${currentStart} and ${currentEnd}), 0) as cur_rage_clicks
      from analytics_page_day
      where date between ${previousStart} and ${currentEnd}
      group by page_key
    `;
    const candidates = buildCandidates(rows);
    const status = candidates.length > 0 ? "complete" : "insufficient_data";
    const maxima = rows.reduce(
      (result, row) => ({
        impressions: Math.max(result.impressions, number(row, "cur_impressions")),
        visitors: Math.max(result.visitors, number(row, "cur_visitors")),
        claritySessions: Math.max(result.claritySessions, number(row, "cur_clarity_sessions")),
      }),
      { impressions: 0, visitors: 0, claritySessions: 0 },
    );

    const inserted = await sql.begin(async (tx) => {
      const [run] = await tx<{ id: number }[]>`
        insert into analytics_recommendation_run (
          window_start, window_end, status, evidence
        ) values (
          ${currentStart}, ${currentEnd}, ${status},
          ${tx.json({
            pages_evaluated: rows.length,
            candidates_generated: candidates.length,
            sample_maxima: maxima,
            minimums: { gsc_impressions: 200, sessions_or_visitors: 50 },
          })}
        )
        returning id
      `;

      for (const candidate of candidates) {
        await tx`
          insert into analytics_recommendation (
            run_id, fingerprint, rule, page_key, score, confidence,
            evidence, spec_markdown
          ) values (
            ${run.id}, ${candidate.fingerprint}, ${candidate.rule},
            ${candidate.pageKey}, ${candidate.score}, ${candidate.confidence},
            ${tx.json(candidate.evidence)}, ${candidate.specMarkdown}
          )
        `;
      }

      return { runId: run.id, recommendations: candidates.length };
    });

    return {
      ok: true,
      status,
      window: { start: currentStart, end: currentEnd },
      ...inserted,
      sampleMaxima: maxima,
    };
  } finally {
    await sql.end({ timeout: 2 });
  }
}
