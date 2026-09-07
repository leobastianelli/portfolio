"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { analytics } from "@/lib/analytics";

/**
 * Manual `$pageview` capture for the App Router. PostHog's automatic pageview
 * fires on hard loads only; client-side navigations between `[locale]` routes
 * (and `/notes`, `/notes/[slug]`) change `usePathname()` without one, so we
 * send the event ourselves whenever the path or query string changes.
 *
 * Query parameters are preserved except for the analytics opt-out flag.
 * `useSearchParams()` needs a Suspense boundary or it opts the whole tree out
 * of static rendering — hence the split.
 */
function PageviewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = new URL(pathname, window.origin);
    for (const [key, value] of searchParams.entries()) {
      if (key !== "internal") url.searchParams.append(key, value);
    }
    analytics.pageView(url.toString());
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
