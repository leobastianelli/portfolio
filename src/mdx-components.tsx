import type { MDXComponents } from "mdx/types";

// Requerido por `@next/mdx` en App Router (sin este archivo MDX no compila).
// Estos overrides son la tipografía de Notes: mismos tokens que el resto del
// sitio (`--text-*`, `--color-ink*`, `--font-bricolage` vía `.editorial-type`),
// sin librería de "prose" — separación vertical entre bloques vía `.note-body`
// en globals.css, no acá.
const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="editorial-type"
      style={{ fontSize: "var(--text-title)", fontWeight: 500, lineHeight: 1.15, color: "var(--color-ink)" }}
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="editorial-type"
      style={{ fontSize: "var(--text-heading)", fontWeight: 500, lineHeight: 1.25, color: "var(--color-ink)" }}
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="editorial-type"
      style={{ fontSize: "var(--text-xl)", fontWeight: 600, lineHeight: 1.3, color: "var(--color-ink)" }}
      {...props}
    />
  ),
  p: (props) => (
    <p
      className="editorial-type"
      style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, color: "var(--color-ink)" }}
      {...props}
    />
  ),
  a: (props) => (
    <a className="text-accent hover:opacity-70 transition-opacity" {...props} />
  ),
  ul: (props) => (
    <ul style={{ paddingLeft: "1.25rem", listStyle: "disc" }} {...props} />
  ),
  ol: (props) => (
    <ol style={{ paddingLeft: "1.25rem", listStyle: "decimal" }} {...props} />
  ),
  li: (props) => (
    <li
      className="editorial-type"
      style={{ fontSize: "var(--text-lg)", lineHeight: 1.7, color: "var(--color-ink)" }}
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="editorial-type"
      style={{
        borderLeft: "2px solid var(--border)",
        paddingLeft: "1.25rem",
        fontStyle: "italic",
        color: "var(--color-ink-faded)",
      }}
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="font-mono"
      style={{ fontSize: "0.9em", background: "var(--color-panel-deep)", padding: "0.15em 0.4em", borderRadius: "4px" }}
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="font-mono"
      style={{
        fontSize: "var(--text-sm)",
        background: "var(--color-panel-deep)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "1rem",
        overflowX: "auto",
      }}
      {...props}
    />
  ),
  hr: (props) => <hr style={{ border: 0, borderTop: "1px solid var(--border)" }} {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
