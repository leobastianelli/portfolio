"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

/**
 * Manual `$pageview` capture for the App Router. PostHog's automatic pageview
 * fires on hard loads only; client-side navigations between `[locale]` routes
 * (and `/notes`, `/notes/[slug]`) change `usePathname()` without one, so we
 * send the event ourselves whenever the path or query string changes.
 *
 * `useSearchParams()` needs a Suspense boundary or it opts the whole tree out
 * of static rendering — hence the split.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded) return;

    // `?internal=1` once, from this browser, flags every later event with the
    // `is_internal` super property (persisted in localStorage by PostHog) so
    // our own traffic can be filtered out. The param doesn't need clearing.
    if (searchParams.get("internal") === "1") {
      posthog.register({ is_internal: true });
    }

    let url = window.origin + pathname;
    const query = searchParams.toString();
    if (query) url += `?${query}`;

    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogPageview() {
  return (
    <Suspense fallback={null}>
      <PageviewTracker />
    </Suspense>
  );
}
