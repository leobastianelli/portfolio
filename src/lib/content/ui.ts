import fs from "node:fs";
import path from "node:path";
import { defaultLocale, type Locale } from "@/lib/i18n";

export interface UiContent {
  meta: { title: string; description: string };
  nav: {
    home: string;
    work: string;
    stack: string;
    contact: string;
    hire: string;
    language: string;
    sections: string;
    localeNames: Record<Locale, string>;
    contentMode: { label: string; overview: string; technical: string };
    menu: { open: string; close: string; title: string; label: string };
  };
  hero: {
    labelRole: string;
    labelCity: string;
    intro: string;
    introSecondary: string;
    cta: string;
    moreLabel: string;
    bioMore: { p1: string; p2pre: string; p2post: string };
    table: { label: string; value: string }[];
  };
  about: {
    label: string;
    /* Rótulo de la columna izquierda cuando hay una etapa activa: "Qué hice
       en {org}", salvo Onefam ("Qué hago en …") y Freelance ("Qué hice
       como freelance"). Ver AboutMe.tsx. */
    activeLabel: {
      past: string;
      present: string;
      as: string;
      freelanceName: string;
    };
    intro: string[];
    introBandPre: string;
    introBandPost: string;
    timeline: {
      id: string;
      period: string;
      role: string;
      org: string;
      /* Forma corta del nombre para el rótulo de la columna izquierda cuando
         `org` es muy largo (ej. "SAE (FCS-UNC)"). Ver AboutMe.tsx. */
      shortOrg?: string;
      detail: string;
      links?: { label: string; href: string }[];
    }[];
  };
  work: {
    sectionLabel: string;
    sectionTitle: string;
    moreLabel: string;
    moreTitle: string;
    status: { live: string; building: string; archived: string; experimental: string };
  };
  personal: {
    sectionLabel: string;
    sectionTitle: string;
    subtitle: string;
  };
  stack: {
    sectionLabel: string;
    sectionTitleItalic: string;
    groups: { category: string; items: string[] }[];
  };
  contact: {
    sectionLabel: string;
    headlineMain: string;
    headlineItalic: string;
    subtitle: string;
    links: { key: string; label: string }[];
  };
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
