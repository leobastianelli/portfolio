import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ReactNode } from "react";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * ImageResponse (Satori) doesn't run in a real browser — it can't resolve
 * `var(--color-*)`. These are the literal hex values of the site's dark
 * "rail" surface (`globals.css`: `--color-rail`/`--color-rail-ink`/
 * `--color-accent-on-dark`), copied by hand rather than read at runtime.
 * OG cards use the dark surface (not the paper-white main canvas) on
 * purpose — bolder contrast reads better at link-preview thumbnail size.
 */
export const OG_COLORS = {
  bg: "#141414",
  ink: "#f4f4f3",
  inkFaded: "#a1a1a1",
  accent: "#8d73e6",
  border: "rgba(244, 244, 243, 0.15)",
};

const FONT_CHARSET =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789áéíóúÁÉÍÓÚñÑ¿¡—–,.:/•· '\"";

async function loadBricolageWeight(weight: 400 | 700): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@${weight}&text=${encodeURIComponent(FONT_CHARSET)}`,
    { headers: { "User-Agent": "Mozilla/5.0" } } // the CSS2 API serves woff2-only (unsupported by Satori) to unrecognized UAs
  ).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (!match) throw new Error(`[og] couldn't resolve a font URL for Bricolage Grotesque ${weight}`);

  return fetch(match[1]).then((res) => res.arrayBuffer());
}

/** The site's only typeface, in the two weights the OG frame uses (label + title). */
export async function loadOgFonts() {
  const [regular, bold] = await Promise.all([loadBricolageWeight(400), loadBricolageWeight(700)]);
  return [
    { name: "Bricolage Grotesque", data: regular, style: "normal" as const, weight: 400 as const },
    { name: "Bricolage Grotesque", data: bold, style: "normal" as const, weight: 700 as const },
  ];
}

/**
 * The favicon mark, recolored light (`public/og-mark.png`, derived from
 * `src/app/icon.png`'s alpha channel) — the favicon itself is black-on-
 * transparent for light surfaces, which reads as nearly invisible on the OG
 * frame's dark background.
 */
export async function loadOgMark(): Promise<string> {
  const buf = await readFile(join(process.cwd(), "public/og-mark.png"));
  return `data:image/png;base64,${buf.toString("base64")}`;
}

/** Shared layout: small uppercase kicker, big title, hairline footer with the domain + mark. Every OG image is one of these with different copy. */
export function OgFrame({
  kicker,
  title,
  footer,
  mark,
}: {
  kicker: string;
  title: string;
  footer: string;
  mark: string;
}): ReactNode {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 88px",
        background: OG_COLORS.bg,
        fontFamily: "Bricolage Grotesque",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 24,
          fontWeight: 700,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: OG_COLORS.accent,
        }}
      >
        {kicker}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: title.length > 28 ? 64 : 84,
          fontWeight: 700,
          lineHeight: 1.12,
          color: OG_COLORS.ink,
          maxWidth: 980,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: `1px solid ${OG_COLORS.border}`,
          paddingTop: 28,
          fontSize: 22,
          color: OG_COLORS.inkFaded,
        }}
      >
        <div style={{ display: "flex" }}>{footer}</div>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders its own <img>, next/image doesn't apply here */}
        <img src={mark} width={56} height={56} style={{ display: "flex" }} alt="" />
      </div>
    </div>
  );
}
