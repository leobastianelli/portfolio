/**
 * Shared shapes for `content/projects/*` and `ui/*.json`. `ProjectMeta` is the
 * hard data (one copy, shared across locales); `ProjectLocaleContent` is the
 * prose that gets translated per locale.
 */

export type ProjectStatus = "live" | "building" | "archived" | "experimental";

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectScreenshot {
  title: string;
  cover: string;
  coverAspect?: number;
  blurred?: boolean;
}

export interface ProjectMeta {
  slug: string;
  org?: string;
  /** Free-form: a single year or a range like "2024–2025". "TODO" when Leo hasn't confirmed it yet. */
  year: string;
  status: ProjectStatus;
  stack: string[];
  links: ProjectLink[];
  featured: boolean;
  cover?: string;
  /** Applies a visual blur without altering the original source asset. */
  coverBlurred?: boolean;
  /** Optional focal point for screenshots whose useful information is off-center. */
  coverPosition?: string;
  screenshots?: ProjectScreenshot[];
  /**
   * width/height of `cover`, e.g. `586 / 675` for a mobile-app screenshot.
   * Defaults to 16/9 (a desktop screenshot's real shape) when omitted —
   * only set this when the source image itself isn't 16:9. See
   * direccion-visual-v3: covers render at their real aspect ratio and full
   * color, uncropped-to-fit and untreated, on purpose.
   */
  coverAspect?: number;
  /** True for personal side projects, rendered in their own section, apart from client work. */
  personal?: boolean;
}

export interface ProjectLocaleContent {
  title: string;
  role: string;
  summary: string;
  technical: string;
}

export interface Project extends ProjectMeta, ProjectLocaleContent {}

/**
 * Shared shapes for `content/notes/*`. Same split as projects: `NoteMeta` is
 * locale-agnostic (a date or a tag list doesn't get translated), the title
 * lives in each locale's `.mdx` (`export const metadata = { title }`) since
 * that's what actually changes per language.
 */
export type NoteKind = "note" | "post";

export interface NoteMeta {
  slug: string;
  /** ISO "YYYY-MM-DD" — sorts the chronological listing. */
  date: string;
  /** Short note vs. long post — drives the listing's visual treatment. */
  kind: NoteKind;
  /** Not used to filter yet, just displayed. */
  tags?: string[];
}

export interface NoteLocaleContent {
  title: string;
}

export interface Note extends NoteMeta, NoteLocaleContent {}
