import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import { getNote, formatNoteDate } from "@/lib/content/notes";
import { OG_SIZE, OG_CONTENT_TYPE, loadOgFonts, loadOgMark, OgFrame } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Leo Bastianelli";

export default async function Image({ params }: { params: Promise<{ locale: Locale; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const ui = getUi(locale);
  const note = await getNote(locale, slug);

  const [fonts, mark] = await Promise.all([loadOgFonts(), loadOgMark()]);

  const kicker = note
    ? `${formatNoteDate(note.date, locale)} · ${ui.notes.kind[note.kind]}`
    : ui.notes.sectionLabel;
  const title = note?.title ?? ui.notes.sectionTitle;

  return new ImageResponse(
    <OgFrame kicker={kicker} title={title} footer={SITE.url.replace("https://", "")} mark={mark} />,
    { ...size, fonts }
  );
}
