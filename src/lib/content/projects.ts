import fs from "node:fs";
import path from "node:path";
import { projectMetas } from "../../../content/projects";
import { defaultLocale, type Locale } from "@/lib/i18n";
import { parseProjectMd } from "./parseProjectMd";
import type { Project } from "./types";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

function readLocaleContent(slug: string, locale: Locale) {
  const file = path.join(PROJECTS_DIR, slug, `${locale}.md`);
  if (!fs.existsSync(file)) return null;
  return parseProjectMd(fs.readFileSync(file, "utf-8"));
}

/** Server-only: reads `content/projects/*` from disk, so call it from a Server Component. */
export function getProjects(locale: Locale): Project[] {
  return projectMetas.map((meta) => {
    let content = readLocaleContent(meta.slug, locale);

    if (!content && locale !== defaultLocale) {
      console.warn(
        `[content] project "${meta.slug}" has no ${locale}.md — falling back to ${defaultLocale}.`
      );
      content = readLocaleContent(meta.slug, defaultLocale);
    }

    if (!content) {
      throw new Error(
        `[content] project "${meta.slug}" is missing both ${locale}.md and ${defaultLocale}.md.`
      );
    }

    return { ...meta, ...content };
  });
}
