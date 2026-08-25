import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import Portfolio from "@/components/Portfolio";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return <Portfolio locale={locale} />;
}
