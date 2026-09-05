import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque } from "next/font/google";
import { SITE } from "@/lib/site";
import { isLocale, locales, localizedUrl } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import "../globals.css";

// The ONLY typeface sitewide (2026-08-31, Leo: "reemplazá todas las fuentes
// por la sans que estamos usando"). Display, body and everything that used
// to be mono (labels, data, tags, CTA) all render in Bricolage Grotesque —
// see the note by `@theme inline` in globals.css. Hierarchy comes from
// weight / case / italic / spacing, never a family switch.
//
// Bricolage Grotesque has no real italic face on Google Fonts (next/font
// only types "normal") — `font-style: italic` still works, the browser
// synthesizes an oblique, which is normal for a grotesque and not an error.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { title, description } = getUi(locale).meta;

  return {
    metadataBase: new URL(SITE.url),
    title,
    description,
    alternates: {
      canonical: localizedUrl(SITE.url, "/", locale),
      languages: {
        en: localizedUrl(SITE.url, "/", "en"),
        es: localizedUrl(SITE.url, "/", "es"),
        "x-default": localizedUrl(SITE.url, "/", "en"),
      },
    },
    openGraph: {
      title,
      description,
      url: localizedUrl(SITE.url, "/", locale),
      siteName: SITE.name,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={locale}
      className={display.variable}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
