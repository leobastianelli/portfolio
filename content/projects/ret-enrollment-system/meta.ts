import type { ProjectMeta } from "@/lib/content/types";

const meta: ProjectMeta = {
  slug: "ret-enrollment-system",
  org: "Facultad de Ciencias Sociales, UNC",
  year: "2026",
  status: "live",
  stack: ["Next.js", "Firebase", "shadcn/ui", "Recharts"],
  links: [{ label: "ret-fcs-unc.vercel.app", url: "https://ret-fcs-unc.vercel.app/" }],
  featured: true,
  cover: "/covers/ret-enrollment-system-form-startup.webp",
  coverAspect: 16 / 10,
  screenshots: [
    {
      title: "Historial de inscripciones",
      cover: "/covers/ret-enrollment-system-history-startup.webp",
      coverAspect: 16 / 10,
    },
  ],
};

export default meta;
