/**
 * The one place the app talks to PostHog. Components call the named helpers
 * below instead of reaching for `posthog.capture(...)` directly, so every
 * event name and its payload shape lives here and stays typed.
 *
 * PostHog is initialised in `src/instrumentation-client.ts` (production only).
 * When it isn't loaded — local dev, or the key is missing — every helper is a
 * silent no-op, so call sites never need to guard.
 */
import posthog from "posthog-js";

type ContactChannel = "email" | "linkedin" | "github" | "whatsapp";
type ProjectLinkType = "repo" | "live";
type FormStatus = "success" | "error";

/** Event name → payload. Keys are the exact snake_case strings PostHog stores. */
type AnalyticsEvents = {
  contact_click: { channel: ContactChannel };
  cv_download: { locale: string };
  language_switch: { from: string; to: string };
  project_card_click: { project_slug: string };
  project_link_click: { project_slug: string; link_type: ProjectLinkType };
  note_read: { note_slug: string };
  hero_cta_click: { cta_label: string };
  contact_form_submit: { status: FormStatus };
};

function track<E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E],
): void {
  if (!posthog.__loaded) return;
  posthog.capture(event, properties);
}

/** Repo hosts count as `repo`; anything else is treated as a live/demo link. */
export function linkTypeFromUrl(url: string): ProjectLinkType {
  return /(?:github|gitlab|bitbucket)\.com/i.test(url) ? "repo" : "live";
}

export const analytics = {
  contactClick: (channel: ContactChannel) => track("contact_click", { channel }),
  cvDownload: (locale: string) => track("cv_download", { locale }),
  languageSwitch: (from: string, to: string) =>
    track("language_switch", { from, to }),
  projectCardClick: (projectSlug: string) =>
    track("project_card_click", { project_slug: projectSlug }),
  projectLinkClick: (projectSlug: string, url: string) =>
    track("project_link_click", {
      project_slug: projectSlug,
      link_type: linkTypeFromUrl(url),
    }),
  noteRead: (noteSlug: string) => track("note_read", { note_slug: noteSlug }),
  heroCtaClick: (ctaLabel: string) =>
    track("hero_cta_click", { cta_label: ctaLabel }),
  contactFormSubmit: (status: FormStatus) =>
    track("contact_form_submit", { status }),
};
