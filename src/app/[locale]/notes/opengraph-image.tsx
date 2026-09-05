import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import { OG_SIZE, OG_CONTENT_TYPE, loadOgFonts, loadOgMark, OgFrame } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Notes — Leo Bastianelli";

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const ui = getUi(isLocale(locale) ? locale : defaultLocale);

  const [fonts, mark] = await Promise.all([loadOgFonts(), loadOgMark()]);

  return new ImageResponse(
    (
      <OgFrame
        kicker={ui.notes.sectionLabel}
        title={ui.notes.sectionTitle}
        footer={SITE.url.replace("https://", "")}
        mark={mark}
      />
    ),
    { ...size, fonts }
  );
}
