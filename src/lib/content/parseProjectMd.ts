import type { ProjectLocaleContent } from "./types";

/**
 * Hand-rolled parser for the project prose format — no markdown/frontmatter
 * library, per D2. Format:
 *
 *   title: ...
 *   role: ...
 *
 *   ## Summary
 *   ...
 *
 *   ## Technical
 *   ...
 */
export function parseProjectMd(raw: string): ProjectLocaleContent {
  const [preamble, ...sections] = raw.split(/\n##\s+/);

  const fields: Record<string, string> = {};
  for (const line of preamble.split("\n")) {
    const match = line.match(/^(\w+):\s*(.*)$/);
    if (match) fields[match[1].toLowerCase()] = match[2].trim();
  }

  const prose: Record<string, string> = {};
  for (const section of sections) {
    const newlineIndex = section.indexOf("\n");
    const heading = section.slice(0, newlineIndex).trim().toLowerCase();
    prose[heading] = section.slice(newlineIndex + 1).trim();
  }

  return {
    title: fields.title ?? "",
    role: fields.role ?? "",
    summary: prose.summary ?? "",
    technical: prose.technical ?? "",
  };
}
