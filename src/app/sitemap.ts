import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { defaultLocale, locales, localizedUrl } from "@/lib/i18n";

/** Locale-less paths. Every one of them is emitted once per locale. */
const paths = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: localizedUrl(SITE.url, path, locale),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((l) => [l, localizedUrl(SITE.url, path, l)])
          ),
          "x-default": localizedUrl(SITE.url, path, defaultLocale),
        },
      },
    }))
  );
}
