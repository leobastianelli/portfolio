import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { defaultLocale, locales, localizedUrl } from "@/lib/i18n";
import { noteMetas } from "../../content/notes";

/** Locale-less paths. Every one of them is emitted once per locale. */
const paths = ["/", "/notes"];

function entriesFor(path: string, priority: number, lastModified: Date): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: localizedUrl(SITE.url, path, locale),
    lastModified,
    changeFrequency: "monthly" as const,
    priority,
    alternates: {
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, localizedUrl(SITE.url, path, l)])),
        "x-default": localizedUrl(SITE.url, path, defaultLocale),
      },
    },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticEntries = paths.flatMap((path) =>
    entriesFor(path, path === "/" ? 1 : 0.7, lastModified)
  );

  // One entry per slug from `generateStaticParams` in `notes/[slug]/page.tsx`.
  const noteEntries = noteMetas.flatMap((meta) =>
    entriesFor(`/notes/${meta.slug}`, 0.5, new Date(meta.date))
  );

  return [...staticEntries, ...noteEntries];
}
