# Analytics Ops

This directory defines the private analytics pipeline for the portfolio. The
public application only emits browser signals; ingestion credentials and raw
analytics data must never be committed to this repository.

## Outcome

The pipeline produces one weekly decision packet with at most three supported
recommendations. A recommendation is a draft, not permission to change the
site. Accepted recommendations are copied into `analytics/specs/` and measured
against their declared success metric and guardrails.

## Data flow

1. A daily Vercel Cron job fetches Clarity, plus rolling 28-day windows from
   PostHog and Search Console so late data and historical events are reconciled.
2. Source rows are upserted into the private Postgres tables in `schema.sql`.
3. A weekly job compares the latest 28 complete days with the previous 28.
4. Deterministic rules produce candidates and an evidence payload.
5. A language model may summarize that payload and fill `spec-template.md`; it
   must not calculate metrics or invent missing evidence.
6. The report is opened as a GitHub issue and deduplicated by fingerprint.

Clarity must run daily because its export API only exposes the previous one to
three days. Search Console collection should re-fetch recent finalized dates so
late corrections are handled through idempotent upserts.

## Shared page contract

All browser events contain:

| Field | Example | Meaning |
| --- | --- | --- |
| `page_key` | `/es/notes/mi-nota` | Normalized path without query parameters |
| `locale` | `es` | `en`, `es`, or `unknown` |
| `content_type` | `note` | `home`, `notes_index`, `note`, or `unknown` |
| `content_slug` | `mi-nota` | Present for individually addressable content |
| `environment` | `production` | Production, preview, or development |

The canonical join key for all three sources is `page_key`. Collectors must
convert absolute URLs to this path, remove query strings, remove trailing
slashes, and preserve the locale segment.

## Initial recommendation rules

- `seo_ctr_gap`: enough impressions, average position 4–15, and CTR below the
  page's four-week baseline.
- `intent_mismatch`: organic clicks rise while meaningful engagement falls.
- `ux_friction`: rage/dead clicks per 100 sessions exceed the threshold and the
  sample minimum is met.
- `conversion_gap`: enough unique visitors but qualified-intent rate is below
  baseline.
- `indexing_gap`: a sitemap URL is not indexed or Google selected a different
  canonical.

Candidates need at least 50 sessions or 200 Search Console impressions. A rule
must say `insufficient_data` instead of recommending a change below its sample
floor. Corroboration by a second source raises confidence; it is not mandatory.

## Private configuration

Store these as sensitive Production environment variables in Vercel and,
optionally, local shell variables:

| Variable | Purpose |
| --- | --- |
| `ANALYTICS_DATABASE_URL` | Private Postgres connection string |
| `CLARITY_API_TOKEN` | Read-only export token |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Service-account JSON with Search Console access |
| `GSC_SITE_URL` | Exact property name, e.g. `sc-domain:leobastianelli.dev` |
| `POSTHOG_PERSONAL_API_KEY` | Read-only personal API key |
| `POSTHOG_PROJECT_ID` | PostHog project id |
| `POSTHOG_HOST` | Optional API host; defaults to PostHog EU |
| `CRON_SECRET` | Protects the daily ingestion endpoint |

Run `npm run analytics:check` in the configured environment before enabling a
schedule. The check prints variable names only and never secret values.

## Activation order

1. Create the private Postgres database and apply `schema.sql`.
2. Grant the Google service account read access to the Search Console property.
3. Add the six secrets and pass `npm run analytics:check`.
4. Implement and run each collector manually against a one-day window.
5. Reconcile totals with each source dashboard.
6. Deploy `vercel.json` to enable the daily ingestion at 06:15 UTC, then add
   the weekly recommendation job.
