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
  cover: "/covers/greens-club-home-startup.webp",
  coverAspect: 16 / 10,
  screenshots: [
    {
      title: "Product onboarding",
      cover: "/covers/greens-club-onboarding-01-startup.webp",
      coverAspect: 16 / 10,
    },
    {
      title: "Tempo AI caddie",
      cover: "/covers/greens-club-onboarding-02-startup.webp",
      coverAspect: 16 / 10,
    },
    {
      title: "Course GPS",
      cover: "/covers/greens-club-onboarding-03-startup.webp",
      coverAspect: 16 / 10,
    },
  ],
};

export default meta;
