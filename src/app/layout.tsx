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
  title: "Leo Bastianelli — Full-Stack Developer",
  description:
    "Full-Stack Developer based in Córdoba, Argentina. 5+ years building production-ready web applications for international clients across e-commerce, SaaS, and content platforms.",
  openGraph: {
    title: "Leo Bastianelli — Full-Stack Developer",
    description:
      "Full-Stack Developer based in Córdoba, Argentina. 5+ years building production-ready web apps.",
    url: "https://leo-portfolio.vercel.app",
    siteName: "lb.dev",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmMono.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
