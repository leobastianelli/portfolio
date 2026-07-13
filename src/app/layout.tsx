import type { Metadata } from "next";
import { Playfair_Display, DM_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Leo Bastianelli — Desarrollo web para pymes argentinas",
  description:
    "Desarrollador full-stack en Córdoba, Argentina. Tiendas online, sistemas a medida y automatización para pequeños y medianos negocios que quieren crecer con la misma tecnología que usan las empresas grandes.",
  openGraph: {
    title: "Leo Bastianelli — Desarrollo web para pymes argentinas",
    description:
      "Desarrollador full-stack en Córdoba, Argentina. Tiendas online, sistemas a medida y automatización para pymes.",
    url: "https://leo-portfolio-liard.vercel.app",
    siteName: "lb.dev",
    locale: "es_AR",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Leo Bastianelli",
  jobTitle: "Full-Stack Developer",
  description:
    "Desarrollador full-stack en Córdoba, Argentina. Tiendas online, sistemas a medida y automatización para pequeños y medianos negocios que quieren crecer con la misma tecnología que usan las empresas grandes.",
  url: "https://leo-portfolio-liard.vercel.app",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Córdoba",
    addressCountry: "AR",
  },
  areaServed: "AR",
  sameAs: [
    "https://linkedin.com/in/leonelbstein",
    "https://www.freelancer.com/u/leonelbstein",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
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
