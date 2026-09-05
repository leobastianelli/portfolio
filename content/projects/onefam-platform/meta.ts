import type { ProjectMeta } from "@/lib/content/types";

// Stack deliberadamente minimo en la ficha publica — Leo pidio no nombrar
// integraciones especificas (ver commit message) para este proyecto interno.
const meta: ProjectMeta = {
  slug: "onefam-platform",
  org: "Onefam Hostels",
  year: "2024–present",
  status: "building",
  stack: ["Next.js", "Supabase", "Vercel"],
  links: [],
  featured: false,
  cover: "/covers/onefam-platform.png",
  coverAspect: 16 / 10,
  coverBlurred: true,
  coverPosition: "left center",
};

export default meta;
