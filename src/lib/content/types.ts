/**
 * Shared shapes for `content/projects/*` and `ui/*.json`. `ProjectMeta` is the
 * hard data (one copy, shared across locales); `ProjectLocaleContent` is the
 * prose that gets translated per locale.
 */

export type ProjectStatus = "live" | "building" | "archived";

export interface ProjectLink {
  label: string;
  url: string;
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
}

export interface ProjectLocaleContent {
  title: string;
  role: string;
  summary: string;
  technical: string;
}

export interface Project extends ProjectMeta, ProjectLocaleContent {}
