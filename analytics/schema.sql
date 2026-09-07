create table if not exists analytics_page_day (
  date date not null,
  page_key text not null,
  locale text not null check (locale in ('en', 'es', 'unknown')),
  content_type text not null check (content_type in ('home', 'notes_index', 'note', 'unknown')),
  content_slug text,
  gsc_impressions integer not null default 0,
  gsc_clicks integer not null default 0,
  gsc_ctr double precision,
  gsc_position double precision,
  posthog_pageviews integer not null default 0,
  posthog_visitors integer not null default 0,
  posthog_contact_clicks integer not null default 0,
  posthog_project_link_clicks integer not null default 0,
  posthog_note_reads integer not null default 0,
  clarity_sessions integer not null default 0,
  clarity_engagement_seconds double precision,
  clarity_scroll_depth double precision,
  clarity_dead_clicks integer not null default 0,
  clarity_rage_clicks integer not null default 0,
  clarity_quickbacks integer not null default 0,
  clarity_script_errors integer not null default 0,
  updated_at timestamptz not null default now(),
  primary key (date, page_key)
);

create table if not exists analytics_gsc_query_page_day (
  date date not null,
  page_key text not null,
  query text not null,
  device text not null default 'ALL',
  country text not null default 'ALL',
  impressions integer not null default 0,
  clicks integer not null default 0,
  ctr double precision,
  position double precision,
  updated_at timestamptz not null default now(),
  primary key (date, page_key, query, device, country)
);

create table if not exists analytics_recommendation_run (
  id bigint generated always as identity primary key,
  generated_at timestamptz not null default now(),
  window_start date not null,
  window_end date not null,
  status text not null check (status in ('complete', 'insufficient_data', 'failed')),
  evidence jsonb not null default '{}'::jsonb
);

create table if not exists analytics_recommendation (
  id bigint generated always as identity primary key,
  run_id bigint not null references analytics_recommendation_run(id),
  fingerprint text not null,
  rule text not null,
  page_key text,
  score double precision not null,
  confidence text not null check (confidence in ('low', 'medium', 'high')),
  status text not null default 'draft' check (status in ('draft', 'accepted', 'rejected', 'measuring', 'complete')),
  evidence jsonb not null,
  spec_markdown text,
  created_at timestamptz not null default now(),
  unique (run_id, fingerprint)
);

create index if not exists analytics_recommendation_fingerprint_idx
  on analytics_recommendation (fingerprint, created_at desc);
