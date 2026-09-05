import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getUi } from "@/lib/content/ui";
import { getProjects } from "@/lib/content/projects";
import { personNode, websiteNode, projectNode } from "@/lib/jsonld";
import Portfolio from "@/components/Portfolio";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const ui = getUi(locale);
  const projects = getProjects(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personNode(locale, ui.meta.description),
      websiteNode(),
      ...projects.map((project) => projectNode(project, locale)),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Portfolio locale={locale} ui={ui} projects={projects} />
    </>
  );
}
