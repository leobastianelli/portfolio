import type { ProjectMeta } from "@/lib/content/types";

const meta: ProjectMeta = {
  slug: "greens-club",
  org: "Mully Group",
  year: "2024–2026",
  status: "live",
  stack: ["Next.js", "Supabase", "Stripe", "Third-party LLM API", "AI vision API", "Vercel"],
  links: [
    { label: "greensclub.ai", url: "https://greensclub.ai" },
    { label: "app.greensclub.ai", url: "https://app.greensclub.ai" },
  ],
  featured: true,
  cover: "/covers/greens-club.webp",
  // Mobile-app screenshot, cropped to its real content (586×675) — see the
  // `coverAspect` doc comment on ProjectMeta.
  coverAspect: 586 / 675,
};

export default meta;
