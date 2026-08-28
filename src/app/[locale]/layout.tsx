import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bricolage_Grotesque, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { SITE } from "@/lib/site";
import { isLocale, locales, localizedUrl } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import "../globals.css";

// The sole headline+body voice sitewide (see the note by `.editorial-type`
// in globals.css for why it replaced Newsreader). Bricolage Grotesque has
// no real italic face on Google Fonts (next/font only types "normal" for
// it) — `font-style: italic` still works everywhere it's used (roles,
// accents), the browser synthesizes an oblique, which is normal for a
// grotesque and not a build error.
const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  // 700 added for direccion-visual-v3's grayscale pass: `.status-label--live`
  // needs a real bold face, not the browser faux-bolding 500.
  weight: ["400", "500", "700"],
});

const body = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.author,
    jobTitle: "Full-Stack Developer",
    description: getUi(locale).meta.description,
    url: localizedUrl(SITE.url, "/", locale),
    email: SITE.email,
    sameAs: [SITE.social.linkedin, SITE.social.github].filter(Boolean),
  };

  return (
    <html
      lang={locale}
      className={`${display.variable} ${mono.variable} ${body.variable}`}
    >
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
