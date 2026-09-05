import type { ComponentType } from "react";
import { noteMetas } from "../../../content/notes";
import { defaultLocale, type Locale } from "@/lib/i18n";
import type { Note } from "./types";

type NoteModule = { default?: ComponentType; metadata?: { title?: string } };

async function importNoteLocale(slug: string, locale: Locale): Promise<NoteModule | null> {
  try {
    return (await import(`../../../content/notes/${slug}/${locale}.mdx`)) as NoteModule;
  } catch {
    return null;
  }
}

/** Resolves a note's `.mdx` module, falling back to `defaultLocale` and warning when a translation is missing. */
async function resolveNoteModule(slug: string, locale: Locale): Promise<NoteModule | null> {
  let mod = await importNoteLocale(slug, locale);

  if (!mod?.metadata?.title && locale !== defaultLocale) {
    console.warn(`[content] note "${slug}" has no ${locale}.mdx — falling back to ${defaultLocale}.`);
    mod = await importNoteLocale(slug, defaultLocale);
  }

  return mod ?? null;
}

/** Server-only: imports `content/notes/*` MDX, so call it from a Server Component. */
export async function getNotes(locale: Locale): Promise<Note[]> {
  const notes = await Promise.all(
    noteMetas.map(async (meta) => {
      const mod = await resolveNoteModule(meta.slug, locale);

      if (!mod?.metadata?.title) {
        throw new Error(
          `[content] note "${meta.slug}" is missing both ${locale}.mdx and ${defaultLocale}.mdx (or their metadata.title).`
        );
      }

      return { ...meta, title: mod.metadata.title };
    })
  );

  return notes.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Server-only: a single note with its compiled MDX body, for the detail page. */
export async function getNote(locale: Locale, slug: string): Promise<(Note & { Body: ComponentType }) | null> {
  const meta = noteMetas.find((m) => m.slug === slug);
  if (!meta) return null;

  const mod = await resolveNoteModule(slug, locale);
  if (!mod?.metadata?.title || !mod.default) return null;

  return { ...meta, title: mod.metadata.title, Body: mod.default };
}

/** "September 5, 2026" / "5 de septiembre de 2026". */
export function formatNoteDate(dateIso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "es" ? "es-AR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(dateIso));
}
