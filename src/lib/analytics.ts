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
import Clarity from "@microsoft/clarity";
import {
  currentAnalyticsContext,
  shouldCollectAnalytics,
  type AnalyticsPageContext,
} from "@/lib/analytics-context";

type ContactChannel = "email" | "linkedin" | "github" | "whatsapp";
type ProjectLinkType = "repo" | "live";
type FormStatus = "success" | "error";
type ContactPlacement = "contact_section" | "navigation_panel";
type ProjectPlacement = "featured_card" | "more_project_list" | "more_project_grid";

/** Event name → payload. Keys are the exact snake_case strings PostHog stores. */
type AnalyticsEvents = {
  contact_click: { channel: ContactChannel; placement: ContactPlacement };
  cv_download: { locale: string };
  language_switch: { from: string; to: string };
  project_card_click: { project_slug: string; placement: "screenshot_deck" };
  project_link_click: {
    project_slug: string;
    link_type: ProjectLinkType;
    placement: ProjectPlacement;
  };
  note_read: { note_slug: string };
  hero_cta_click: { cta_label: string };
  contact_form_submit: { status: FormStatus };
};

function track<E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E],
): void {
  if (!shouldCollectAnalytics()) return;
  const context = currentAnalyticsContext();
  if (!context) return;

  if (posthog.__loaded) posthog.capture(event, { ...context, ...properties });

  try {
    Clarity.event(event);
  } catch {
    // Analytics failures must never affect a user interaction.
  }
}

function syncPageContext(context: AnalyticsPageContext): void {
  if (!shouldCollectAnalytics()) return;

  if (posthog.__loaded) posthog.register(context);

  try {
    for (const [key, value] of Object.entries(context)) {
      Clarity.setTag(key, value);
    }
  } catch {
    // Analytics failures must never affect navigation.
  }
}

/** Repo hosts count as `repo`; anything else is treated as a live/demo link. */
export function linkTypeFromUrl(url: string): ProjectLinkType {
  return /(?:github|gitlab|bitbucket)\.com/i.test(url) ? "repo" : "live";
}

export const analytics = {
  pageView: (url: string) => {
    if (!shouldCollectAnalytics()) return;
    const context = currentAnalyticsContext();
    if (!context) return;
    syncPageContext(context);
    if (posthog.__loaded) posthog.capture("$pageview", { ...context, $current_url: url });
  },
  contactClick: (channel: ContactChannel, placement: ContactPlacement) =>
    track("contact_click", { channel, placement }),
  cvDownload: (locale: string) => track("cv_download", { locale }),
  languageSwitch: (from: string, to: string) =>
    track("language_switch", { from, to }),
  projectCardClick: (projectSlug: string) =>
    track("project_card_click", { project_slug: projectSlug, placement: "screenshot_deck" }),
  projectLinkClick: (projectSlug: string, url: string, placement: ProjectPlacement) =>
    track("project_link_click", {
      project_slug: projectSlug,
      link_type: linkTypeFromUrl(url),
      placement,
    }),
  noteRead: (noteSlug: string) => track("note_read", { note_slug: noteSlug }),
  heroCtaClick: (ctaLabel: string) =>
    track("hero_cta_click", { cta_label: ctaLabel }),
  contactFormSubmit: (status: FormStatus) =>
    track("contact_form_submit", { status }),
};
