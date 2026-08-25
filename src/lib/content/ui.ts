import fs from "node:fs";
import path from "node:path";
import { defaultLocale, type Locale } from "@/lib/i18n";

export interface UiContent {
  meta: { title: string; description: string };
  nav: {
    work: string;
    stack: string;
    about: string;
    contact: string;
    hire: string;
    language: string;
    localeNames: Record<Locale, string>;
  };
  hero: { labelRole: string; labelCity: string; bio: string; cta: string };
  work: { sectionLabel: string; sectionTitle: string };
  stack: {
    sectionLabel: string;
    sectionTitleItalic: string;
    groups: { category: string; items: string[] }[];
  };
  about: {
    sectionLabel: string;
    sectionTitleMain: string;
    sectionTitleItalic: string;
    p1: string;
    p2: string;
    p3pre: string;
    p3post: string;
    table: { label: string; value: string }[];
  };
  contact: {
    sectionLabel: string;
    headlineMain: string;
    headlineItalic: string;
    subtitle: string;
    links: { key: string; label: string }[];
  };
  footer: { copyright: string };
}

const UI_DIR = path.join(process.cwd(), "ui");

function readUiFile(locale: Locale): Record<string, unknown> | null {
  const file = path.join(UI_DIR, `${locale}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Deep-merges `locale` over `base`, falling back key-by-key and warning about
 * anything missing so a partial translation never breaks the build.
 */
function mergeWithFallback(
  base: Record<string, unknown>,
  locale: Record<string, unknown>,
  missing: string[],
  keyPath = ""
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const key of Object.keys(base)) {
    const path = keyPath ? `${keyPath}.${key}` : key;
    const baseValue = base[key];
    const localeValue = locale[key];

    if (localeValue === undefined) {
      missing.push(path);
      result[key] = baseValue;
    } else if (isPlainObject(baseValue) && isPlainObject(localeValue)) {
      result[key] = mergeWithFallback(baseValue, localeValue, missing, path);
    } else {
      result[key] = localeValue;
    }
  }

  return result;
}

/** Server-only: reads `ui/*.json` from disk, so call it from a Server Component. */
export function getUi(locale: Locale): UiContent {
  const base = readUiFile(defaultLocale);
  if (!base) {
    throw new Error(`[content] ui/${defaultLocale}.json is missing.`);
  }

  if (locale === defaultLocale) return base as unknown as UiContent;

  const localeContent = readUiFile(locale);
  if (!localeContent) {
    console.warn(`[content] ui/${locale}.json is missing — falling back to ${defaultLocale}.`);
    return base as unknown as UiContent;
  }

  const missing: string[] = [];
  const merged = mergeWithFallback(base, localeContent, missing);

  if (missing.length > 0) {
    console.warn(
      `[content] ui/${locale}.json is missing keys, falling back to ${defaultLocale}: ${missing.join(", ")}`
    );
  }

  return merged as unknown as UiContent;
}
