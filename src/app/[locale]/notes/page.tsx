import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { isLocale, locales, localizedUrl } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import { getNotes, formatNoteDate } from "@/lib/content/notes";
import { collectionPageNode } from "@/lib/jsonld";
import { LanguageProvider } from "@/context/LanguageContext";
import Nav from "@/components/Nav";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/notes">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const ui = getUi(locale);
  const title = `${ui.notes.sectionTitle} — ${SITE.author}`;

  return {
    title,
    description: ui.meta.description,
    alternates: {
      canonical: localizedUrl(SITE.url, "/notes", locale),
      languages: {
        en: localizedUrl(SITE.url, "/notes", "en"),
        es: localizedUrl(SITE.url, "/notes", "es"),
        "x-default": localizedUrl(SITE.url, "/notes", "en"),
      },
    },
  };
}

export default async function NotesPage({ params }: PageProps<"/[locale]/notes">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const ui = getUi(locale);
  const notes = await getNotes(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    ...collectionPageNode(locale, ui.notes.sectionTitle, ui.meta.description, notes),
  };

  return (
    <LanguageProvider locale={locale} ui={ui}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main className="site-section px-5 md:px-6">
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-9">
            <Link href={`/${locale}`} className="label-engraved">
              {ui.notes.backHome}
            </Link>
          </div>

          <div className="mb-7">
            <p className="section-label font-mono mb-3">{ui.notes.sectionLabel}</p>
            <h1
              className="editorial-type"
              style={{ fontSize: "var(--text-title)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}
            >
              {ui.notes.sectionTitle}
            </h1>
          </div>

          {notes.length === 0 ? (
            <p
              className="editorial-type"
              style={{ fontSize: "var(--text-base)", color: "var(--color-ink-faded)" }}
            >
              {ui.notes.empty}
            </p>
          ) : (
            <ul className="notes-list">
              {notes.map((note) => (
                <li key={note.slug} className="notes-row">
                  <div className="notes-row__meta">
                    <span
                      className="font-mono"
                      style={{ fontSize: "var(--text-2xs)", letterSpacing: "0.1em", color: "var(--color-ink-faded)" }}
                    >
                      {formatNoteDate(note.date, locale)}
                    </span>
                    <span className={`status-label status-label--${note.kind}`}>
                      {ui.notes.kind[note.kind]}
                    </span>
                  </div>
                  <h2
                    className="editorial-type"
                    style={{ fontSize: "var(--text-xl)", fontWeight: 500, color: "var(--color-ink)" }}
                  >
                    <Link href={`/${locale}/notes/${note.slug}`} className="notes-row__title-link">
                      {note.title}
                    </Link>
                  </h2>
                  {note.tags && note.tags.length > 0 && (
                    <div className="notes-row__tags">
                      {note.tags.map((tag) => (
                        <span key={tag} className="label-engraved" style={{ opacity: 0.65 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </LanguageProvider>
  );
}
