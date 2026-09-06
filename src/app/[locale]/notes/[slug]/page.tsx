import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { isLocale, locales, localizedUrl } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import { getNote, formatNoteDate } from "@/lib/content/notes";
import { articleNode } from "@/lib/jsonld";
import { noteMetas } from "../../../../../content/notes";
import { LanguageProvider } from "@/context/LanguageContext";
import Nav from "@/components/Nav";
import NoteReadTracker from "@/components/analytics/NoteReadTracker";

export function generateStaticParams() {
  return locales.flatMap((locale) => noteMetas.map((meta) => ({ locale, slug: meta.slug })));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/notes/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const note = await getNote(locale, slug);
  if (!note) return {};

  const path = `/notes/${slug}`;

  return {
    title: `${note.title} — ${SITE.author}`,
    description: getUi(locale).meta.description,
    alternates: {
      canonical: localizedUrl(SITE.url, path, locale),
      languages: {
        en: localizedUrl(SITE.url, path, "en"),
        es: localizedUrl(SITE.url, path, "es"),
        "x-default": localizedUrl(SITE.url, path, "en"),
      },
    },
  };
}

export default async function NotePage({ params }: PageProps<"/[locale]/notes/[slug]">) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const ui = getUi(locale);
  const note = await getNote(locale, slug);
  if (!note) notFound();

  const { Body } = note;

  const jsonLd = {
    "@context": "https://schema.org",
    ...articleNode(locale, note),
  };

  return (
    <LanguageProvider locale={locale} ui={ui}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="site-section px-5 md:px-6">
        <div className="max-w-2xl mx-auto w-full">
          <div className="mb-9">
            <Link href={`/${locale}/notes`} className="label-engraved">
              {ui.notes.backToNotes}
            </Link>
          </div>

          <div className="mb-8">
            <div className="notes-row__meta mb-3">
              <span
                className="font-mono"
                style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}
              >
                {formatNoteDate(note.date, locale)}
              </span>
              <span className={`status-label status-label--${note.kind}`}>{ui.notes.kind[note.kind]}</span>
            </div>
            <h1
              className="editorial-type"
              style={{ fontSize: "var(--text-title)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}
            >
              {note.title}
            </h1>
            {note.tags && note.tags.length > 0 && (
              <div className="notes-row__tags mt-4">
                {note.tags.map((tag) => (
                  <span key={tag} className="label-engraved" style={{ opacity: 0.65 }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="note-body">
            <Body />
          </div>
          <NoteReadTracker slug={slug} />
        </div>
      </main>
    </LanguageProvider>
  );
}
