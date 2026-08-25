import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Playfair_Display, DM_Mono, DM_Sans } from "next/font/google";
import { SITE } from "@/lib/site";
import { isLocale, locales, localizedUrl, type Locale } from "@/lib/i18n";
import "../globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal", "italic"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

// TODO(stage 2): move to `ui/{en,es}.json` along with the rest of the copy.
const meta: Record<Locale, { title: string; description: string }> = {
  en: {
    title: "Leo Bastianelli — Full-stack developer",
    description:
      "Full-stack developer. Online stores, custom systems and automation for businesses that want to grow with the same technology large companies use.",
  },
  es: {
    title: "Leo Bastianelli — Desarrollador full-stack",
    description:
      "Desarrollador full-stack. Tiendas online, sistemas a medida y automatización para negocios que quieren crecer con la misma tecnología que usan las empresas grandes.",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { title, description } = meta[locale];

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
    description: meta[locale].description,
    url: localizedUrl(SITE.url, "/", locale),
    email: SITE.email,
    sameAs: [SITE.social.linkedin, SITE.social.github].filter(Boolean),
  };

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${dmMono.variable} ${dmSans.variable}`}
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
