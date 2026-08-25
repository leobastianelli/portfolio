/**
 * Single source of truth for anything that depends on where the site lives.
 * Referenced exclusively through this constant — metadata, sitemap, robots
 * and JSON-LD all read from here.
 */
export const SITE = {
  url: "https://leobastianelli.dev",
  name: "lb.dev",
  author: "Leo Bastianelli",
  email: "leonelbastianelli@gmail.com",
  social: {
    linkedin: "https://linkedin.com/in/leonelbstein",
    github: "https://github.com/leobastianelli",
  },
} as const;
