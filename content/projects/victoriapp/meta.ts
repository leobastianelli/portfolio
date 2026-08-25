import type { ProjectMeta } from "@/lib/content/types";

// TODO: confirmar org/institución — el propio repo tiene una inconsistencia
// entre "UNC" y "UBA" en distintos textos (metadata vs. home). Preguntarle a
// Leo antes de nombrar la facultad en la copia.
const meta: ProjectMeta = {
  slug: "victoriapp",
  year: "2026",
  status: "live",
  stack: ["Next.js", "Firebase", "TypeScript", "Tailwind CSS"],
  links: [{ label: "victoriapp.vercel.app", url: "https://victoriapp.vercel.app" }],
  featured: false,
};

export default meta;
