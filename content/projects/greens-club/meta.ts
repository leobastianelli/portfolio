import type { ProjectMeta } from "@/lib/content/types";

// TODO: year pending — el repo tiene "dubious ownership" para git, no se
// pudo leer `git log` sin tocar la config global de git. Preguntarle a Leo.
const meta: ProjectMeta = {
  slug: "greens-club",
  org: "Mully Group",
  year: "TODO",
  status: "live",
  stack: ["Next.js", "Supabase", "Stripe", "xAI Grok", "Google Gemini", "Vercel"],
  links: [
    { label: "greensclub.ai", url: "https://greensclub.ai" },
    { label: "app.greensclub.ai", url: "https://app.greensclub.ai" },
  ],
  featured: true,
};

export default meta;
