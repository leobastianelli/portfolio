import { SITE } from "./site";
import { localizedUrl, type Locale } from "./i18n";
import type { Note, Project } from "./content/types";

/**
 * Stable `@id`s so Person/WebSite are defined once (on the home page) and
 * every other page's structured data references them instead of repeating
 * the full entity. Framed as a personal portfolio (Person is the anchor
 * entity), not a content blog — see [[portfolio-jsonld]] decisions:
 * `/notes` is `CollectionPage` (not `Blog`), entries are `Article` (not
 * `BlogPosting`), projects are `SoftwareApplication` unless they're purely
 * a content/marketing site (`CreativeWork`).
 */
export const PERSON_ID = `${SITE.url}/#person`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function bcp47(locale: Locale): string {
  return locale === "es" ? "es-ES" : "en-US";
}

/**
 * Per-project schema.org classification. Kept here (not on `ProjectMeta`)
 * because it's JSON-LD-specific, not general content data — see the
 * classification Leo approved: 8/9 projects are real software with
 * functionality behind them; Púrpura Ceniza is a band's marketing site.
 */
const PROJECT_SCHEMA: Record<
  string,
  { type: "SoftwareApplication" | "CreativeWork"; applicationCategory?: string }
> = {
  "greens-club": { type: "SoftwareApplication", applicationCategory: "SportsApplication" },
  "onefam-community-portal": { type: "SoftwareApplication", applicationCategory: "BusinessApplication" },
  "golf-membership-platform": { type: "SoftwareApplication", applicationCategory: "BusinessApplication" },
  "ret-enrollment-system": { type: "SoftwareApplication", applicationCategory: "EducationalApplication" },
  "onefam-platform": { type: "SoftwareApplication", applicationCategory: "BusinessApplication" },
  "purpura-ceniza": { type: "CreativeWork" },
  victoriapp: { type: "SoftwareApplication", applicationCategory: "EducationalApplication" },
  "pit-engineer": { type: "SoftwareApplication", applicationCategory: "UtilitiesApplication" },
  "ac-head-tracking": { type: "SoftwareApplication", applicationCategory: "UtilitiesApplication" },
};

/** `"2024–present"` / `"2024–2026"` / `"2026"` -> `"2024"` / `"2026"`. The earliest year mentioned, not a fabricated full date. */
function firstYear(value: string): string | undefined {
  return value.match(/\d{4}/)?.[0];
}

export function personNode(locale: Locale, description: string) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE.author,
    jobTitle: "Full-Stack Developer",
    description,
    url: localizedUrl(SITE.url, "/", locale),
    email: `mailto:${SITE.email}`,
    sameAs: [SITE.social.linkedin, SITE.social.github].filter(Boolean),
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE.url,
    name: SITE.name,
    inLanguage: ["en-US", "es-ES"],
    author: { "@id": PERSON_ID },
  };
}

/**
 * One node per project, anchored at its `#project-<slug>` fragment on the
 * home page (projects don't have a route of their own). Only 4 projects
 * have a public `links[0]` — the rest omit `url` on purpose rather than
 * pointing it at the portfolio anchor (that's the page describing the
 * project, not the project itself); `mainEntityOfPage` carries that
 * "described here" relationship instead.
 */
export function projectNode(project: Project, locale: Locale) {
  const schema = PROJECT_SCHEMA[project.slug] ?? { type: "SoftwareApplication" as const };
  const homeUrl = localizedUrl(SITE.url, "/", locale);
  const anchorId = `${homeUrl}#project-${project.slug}`;
  const link = project.links[0];
  const datePublished = firstYear(project.year);

  return {
    "@type": schema.type,
    "@id": anchorId,
    name: project.title,
    description: project.summary,
    creator: { "@id": PERSON_ID },
    ...(datePublished ? { datePublished } : {}),
    ...(link ? { url: link.url } : { mainEntityOfPage: { "@id": homeUrl } }),
    ...(schema.type === "SoftwareApplication" && schema.applicationCategory
      ? { applicationCategory: schema.applicationCategory }
      : {}),
  };
}

export function notesCollectionId(locale: Locale): string {
  return `${localizedUrl(SITE.url, "/notes", locale)}#collection`;
}

/**
 * `CollectionPage`, not `Blog` — a portfolio listing, not a content
 * publication. `hasPart` stubs each entry so the listing itself carries
 * some structure even before a crawler follows through to each `Article`.
 */
export function collectionPageNode(locale: Locale, name: string, description: string, notes: Note[]) {
  return {
    "@type": "CollectionPage",
    "@id": notesCollectionId(locale),
    url: localizedUrl(SITE.url, "/notes", locale),
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": PERSON_ID },
    hasPart: notes.map((note) => ({
      "@type": "Article",
      "@id": localizedUrl(SITE.url, `/notes/${note.slug}`, locale),
      headline: note.title,
      datePublished: note.date,
    })),
  };
}

/** `Article`, not `BlogPosting` — see the module doc comment. */
export function articleNode(locale: Locale, note: Note) {
  const url = localizedUrl(SITE.url, `/notes/${note.slug}`, locale);

  return {
    "@type": "Article",
    "@id": url,
    url,
    headline: note.title,
    datePublished: note.date,
    inLanguage: bcp47(locale),
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    isPartOf: { "@id": notesCollectionId(locale) },
    ...(note.tags && note.tags.length > 0 ? { keywords: note.tags.join(", ") } : {}),
  };
}
