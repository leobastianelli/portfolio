import { SITE } from "@/lib/site";
import type { UiContent } from "@/lib/content/ui";

/** Shared by `Contact.tsx` and the hamburger menu panel — one source for hrefs/values. */
const RAW: Record<string, { value: string; href: string; mono: boolean }> = {
  email: {
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    mono: true,
  },
  linkedin: {
    value: SITE.social.linkedin.replace(/^https?:\/\//, ""),
    href: SITE.social.linkedin,
    mono: false,
  },
  github: {
    value: SITE.social.github.replace(/^https?:\/\//, ""),
    href: SITE.social.github,
    mono: false,
  },
};

export function getContactLinks(t: UiContent) {
  return t.contact.links.map((link) => ({ key: link.key, label: link.label, ...RAW[link.key] }));
}
