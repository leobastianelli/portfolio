import type { ProjectMeta } from "@/lib/content/types";

const meta: ProjectMeta = {
  slug: "golf-membership-platform",
  org: "Mully Group / NewReserve",
  year: "2024–2026",
  status: "archived",
  stack: ["Shopify Plus", "Liquid", "Next.js", "Firebase", "n8n", "Impact.com"],
  links: [{ label: "mymully.com", url: "https://mymully.com" }],
  featured: true,
  cover: "/covers/golf-membership-platform-home-startup.webp",
  coverAspect: 16 / 10,
  screenshots: [
    {
      title: "Membership value",
      cover: "/covers/golf-membership-platform-value-startup.webp",
      coverAspect: 16 / 10,
    },
    {
      title: "Quarterly edit",
      cover: "/covers/golf-membership-platform-quarter-startup.webp",
      coverAspect: 16 / 10,
    },
    {
      title: "Style quiz",
      cover: "/covers/golf-membership-platform-quiz-startup.webp",
      coverAspect: 16 / 10,
    },
  ],
};

export default meta;
