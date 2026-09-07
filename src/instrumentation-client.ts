/**
 * Client-side instrumentation — runs once, after the HTML loads and before
 * React hydrates (Next.js `instrumentation-client` convention).
 *
 * Boots the two third-party analytics scripts:
 *   - PostHog  — custom events + session replay, via the `/ingest` reverse
 *                proxy (next.config.ts). Pageviews are captured manually in
 *                `components/analytics/PostHogPageview.tsx`.
 *   - Clarity  — heatmaps + scroll maps, no custom events.
 *
 * Both are enabled only on the canonical production hostname. Local builds,
 * Vercel previews, and browsers opted out with `?internal=1` send no data.
 */
import posthog from "posthog-js";
import Clarity from "@microsoft/clarity";
import { shouldCollectAnalytics } from "@/lib/analytics-context";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const shouldCollect = shouldCollectAnalytics();

if (shouldCollect && posthogKey) {
  posthog.init(posthogKey, {
    // Served from our own domain — see the `/ingest` rewrites in next.config.ts.
    api_host: "/ingest",
    // Where "open in PostHog" links (toolbar, replay) should point. EU app.
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    // Don't create a person profile for anonymous visitors — keeps the event
    // allowance for people we actually identify.
    person_profiles: "identified_only",
    // App Router client-side navigations don't trigger a full load, so the
    // automatic pageview misses them. Captured by hand instead.
    capture_pageview: false,
    capture_pageleave: true,
    session_recording: {
      // Session replay is enabled from the dashboard; mask every input value.
      maskAllInputs: true,
    },
  });
}

if (shouldCollect && clarityProjectId) {
  try {
    Clarity.init(clarityProjectId);
  } catch {
    // A failed Clarity boot must never break the page.
  }
}
