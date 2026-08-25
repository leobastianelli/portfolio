import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import { getProjects } from "@/lib/content/projects";
import Portfolio from "@/components/Portfolio";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const ui = getUi(locale);
  const projects = getProjects(locale);

  return <Portfolio locale={locale} ui={ui} projects={projects} />;
}
