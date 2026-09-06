import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],

  // PostHog is served from our own domain under `/ingest/*` so ad/tracker
  // blockers (which blocklist `*.i.posthog.com`) don't drop events or session
  // replay. `src/instrumentation-client.ts` points the SDK at `/ingest`, and
  // these rewrites forward to PostHog EU Cloud. Static assets (`array/*`,
  // `static/*`) come from the assets host; everything else from the ingestion
  // host. See https://posthog.com/docs/advanced/proxy/nextjs
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://eu-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
    ];
  },

  // Required by the PostHog proxy: some of its endpoints are sensitive to a
  // trailing-slash redirect and would break event capture / flag polls.
  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
