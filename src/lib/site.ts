/**
 * Single source of truth for anything that depends on where the site lives.
 *
 * TODO: replace `url` with the final domain once it's decided. It is referenced
 * exclusively through this constant — metadata, sitemap, robots and JSON-LD all
 * read from here, so the change is one line.
 */
export const SITE = {
  url: "https://leo-portfolio-liard.vercel.app",
  name: "lb.dev",
  author: "Leo Bastianelli",
  email: "leonelbastianelli@gmail.com",
  social: {
    linkedin: "https://linkedin.com/in/leonelbstein",
    // TODO: GitHub URL pending — needed for the Contact section (stage 5).
    github: "",
  },
} as const;
