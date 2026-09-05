import type { NoteMeta } from "@/lib/content/types";
import hello from "./hello/meta";

/**
 * Explicit registry rather than a directory scan — same reasoning as
 * `content/projects/index.ts`: order is deliberate and Next.js bundles this
 * statically.
 */
export const noteMetas: NoteMeta[] = [hello];
