import postgres from "postgres";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 30;

type Summary = {
  pageviews: string;
  visitors: string;
  clarity_sessions: string;
  gsc_impressions: string;
  posthog_latest: string | Date | null;
  clarity_latest: string | Date | null;
  gsc_latest: string | Date | null;
};

type Daily = {
  date: string | Date;
  pageviews: string;
  visitors: string;
  clarity_sessions: string;
  impressions: string;
  clicks: string;
};

type Run = {
  id: string;
  generated_at: string | Date;
  window_start: string | Date;
  window_end: string | Date;
  status: "complete" | "insufficient_data" | "failed";
  evidence: Record<string, unknown>;
};

type Recommendation = {
  id: string;
  rule: string;
  page_key: string | null;
  score: string;
  confidence: string;
  status: string;
  spec_markdown: string | null;
  created_at: string;
};

function integer(value: string | number | null): string {
  return Math.round(Number(value ?? 0)).toLocaleString("es-AR");
}

function date(value: string | Date | null): string {
  if (!value) return "Sin datos";
  const parsed = value instanceof Date
    ? value
    : new Date(`${String(value).slice(0, 10)}T12:00:00Z`);
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(parsed);
}

function dateTime(value: string | Date): string {
  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(value instanceof Date ? value : new Date(value));
}

async function dashboardData() {
  const databaseUrl = process.env.ANALYTICS_DATABASE_URL;
  if (!databaseUrl) throw new Error("Analytics database is not configured");
  const sql = postgres(databaseUrl, {
    max: 1,
    prepare: false,
    ssl: "require",
    connect_timeout: 10,
    idle_timeout: 5,
  });

  try {
    const summaryRows = await sql<Summary[]>`
        select
          coalesce(sum(posthog_pageviews) filter (where date >= current_date - 27), 0) as pageviews,
          coalesce(sum(posthog_visitors) filter (where date >= current_date - 27), 0) as visitors,
          coalesce(sum(clarity_sessions) filter (where date >= current_date - 27), 0) as clarity_sessions,
          coalesce(sum(gsc_impressions) filter (where date >= current_date - 27), 0) as gsc_impressions,
          max(date) filter (where posthog_pageviews > 0 or posthog_visitors > 0) as posthog_latest,
          max(date) filter (where clarity_sessions > 0) as clarity_latest,
          max(date) filter (where gsc_impressions > 0 or gsc_clicks > 0) as gsc_latest
        from analytics_page_day
      `;
    const daily = await sql<Daily[]>`
        select
          date,
          sum(posthog_pageviews) as pageviews,
          sum(posthog_visitors) as visitors,
          sum(clarity_sessions) as clarity_sessions,
          sum(gsc_impressions) as impressions,
          sum(gsc_clicks) as clicks
        from analytics_page_day
        where date >= current_date - 29
        group by date
        order by date desc
      `;
    const runs = await sql<Run[]>`
        select id, generated_at, window_start, window_end, status, evidence
        from analytics_recommendation_run
        order by generated_at desc
        limit 8
      `;
    const recommendations = await sql<Recommendation[]>`
        select id, rule, page_key, score, confidence, status, spec_markdown, created_at
        from analytics_recommendation
        order by score desc, created_at desc
        limit 20
      `;

    return { summary: summaryRows[0], daily, runs, recommendations };
  } finally {
    await sql.end({ timeout: 2 });
  }
}

export default async function AnalyticsDashboard() {
  const { summary, daily, runs, recommendations } = await dashboardData();
  const latestRun = runs[0];

  return (
    <main className="ops-shell">
      <p className="ops-eyebrow">Portfolio · sistema privado</p>
      <h1 className="ops-title">Analytics Ops</h1>
      <p className="ops-lead">
        Una vista unificada de PostHog, Clarity y Search Console. Las recomendaciones son borradores
        basados en evidencia; ningún cambio se publica automáticamente.
      </p>

      <section className="ops-grid" aria-label="Resumen de los últimos 28 días">
        <article className="ops-card">
          <p className="ops-label">Pageviews</p>
          <p className="ops-value">{integer(summary.pageviews)}</p>
          <p className="ops-detail">PostHog · actualizado {date(summary.posthog_latest)}</p>
        </article>
        <article className="ops-card">
          <p className="ops-label">Visitantes</p>
          <p className="ops-value">{integer(summary.visitors)}</p>
          <p className="ops-detail">Suma diaria de visitantes únicos</p>
        </article>
        <article className="ops-card">
          <p className="ops-label">Sesiones UX</p>
          <p className="ops-value">{integer(summary.clarity_sessions)}</p>
          <p className="ops-detail">Clarity · actualizado {date(summary.clarity_latest)}</p>
        </article>
        <article className="ops-card">
          <p className="ops-label">Impresiones orgánicas</p>
          <p className="ops-value">{integer(summary.gsc_impressions)}</p>
          <p className="ops-detail">Search Console · actualizado {date(summary.gsc_latest)}</p>
        </article>
      </section>

      <section className="ops-section">
        <h2>Actividad diaria</h2>
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead><tr><th>Fecha</th><th>Pageviews</th><th>Visitantes</th><th>Clarity</th><th>Impresiones</th><th>Clicks SEO</th></tr></thead>
            <tbody>
              {daily.map((row) => (
                <tr key={String(row.date)}><td>{date(row.date)}</td><td>{integer(row.pageviews)}</td><td>{integer(row.visitors)}</td><td>{integer(row.clarity_sessions)}</td><td>{integer(row.impressions)}</td><td>{integer(row.clicks)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="ops-section">
        <h2>Recomendaciones</h2>
        {recommendations.length ? (
          <div className="ops-list">
            {recommendations.map((item) => (
              <article className="ops-recommendation" key={item.id}>
                <header>
                  <h3>{item.rule} · {item.page_key ?? "sitio"}</h3>
                  <span className="ops-status"><span className="ops-dot" />{item.confidence} · {item.status}</span>
                </header>
                {item.spec_markdown && <pre>{item.spec_markdown}</pre>}
              </article>
            ))}
          </div>
        ) : (
          <div className="ops-empty">
            Todavía no hay una muestra suficiente para recomendar cambios.
            {latestRun && <> Último análisis: {dateTime(latestRun.generated_at)} ({latestRun.status}).</>}
          </div>
        )}
      </section>

      <section className="ops-section">
        <h2>Ejecuciones semanales</h2>
        <div className="ops-table-wrap">
          <table className="ops-table">
            <thead><tr><th>Run</th><th>Generado</th><th>Ventana</th><th>Estado</th></tr></thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}><td>#{run.id}</td><td>{dateTime(run.generated_at)}</td><td>{date(run.window_start)} — {date(run.window_end)}</td><td><span className="ops-status"><span className={`ops-dot ${run.status === "complete" ? "" : "ops-dot--waiting"}`} />{run.status}</span></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="ops-footer">Actualización diaria 06:15 UTC · análisis semanal lunes 07:30 UTC</p>
    </main>
  );
}
