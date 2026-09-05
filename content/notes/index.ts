import type { NoteMeta } from "@/lib/content/types";

/**
 * Explicit registry rather than a directory scan — same reasoning as
 * `content/projects/index.ts`: order is deliberate and Next.js bundles this
 * statically. Empty until the first real note lands; `/notes` renders
 * `ui.notes.empty` and the sitemap simply emits no `/notes/*` entries.
 */
export const noteMetas: NoteMeta[] = [];
