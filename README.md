# Portfolio

Personal portfolio and developer log for Leo Bastianelli — full-stack developer based in Córdoba, Argentina. Bilingual (English/Spanish), built with Next.js App Router.

## Stack

- **Framework**: Next.js 16 (App Router), React, TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: MDX (`@next/mdx`) for the notes/log, hand-rolled parsing for project copy — no markdown/frontmatter library
- **i18n**: no library — a proxy (middleware) resolves the locale and redirects, `[locale]` segments handle routing
- **OG images**: `next/og` (`ImageResponse`), generated per route
- **Analytics**: Vercel Web Analytics, plus PostHog (custom events + session replay, behind a `/ingest` reverse proxy) and Microsoft Clarity (heatmaps) — both production-only
- **Testing/verification**: Playwright (dev dependency, used for manual accessibility and visual verification, not an automated suite)

## Project structure

```
content/
  projects/<slug>/       meta.ts (locale-agnostic data) + en.md / es.md (prose)
  notes/<slug>/           meta.ts + en.mdx / es.mdx (MDX body + metadata export)
src/
  app/
    [locale]/             routed pages: home, /notes, /notes/[slug], not-found
    globals.css           design tokens (@theme), all component styles
  components/             React components (Nav, Work, AboutMe, StackIcons, ...)
  context/                LanguageContext, ContentModeContext
  lib/
    content/              loaders (getProjects, getNotes, getUi) + shared types
    i18n.ts               locale primitives (no library)
    jsonld.ts             schema.org node builders
    og.tsx                shared OG image frame + font loading
ui/
  en.json, es.json         UI copy (nav, hero, section labels, etc.)
```

## Running locally

Requires Node 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The proxy redirects `/` to `/en` or `/es` based on the `Accept-Language` header (or a previously saved choice).

```bash
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

## Environment variables

All client-side and public by design (`NEXT_PUBLIC_*`) — no secrets. They're set
in Vercel (Production, type "Config"); for local work copy them into an
untracked `.env.local`:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key (EU Cloud) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog ingestion host — `https://eu.i.posthog.com` (the browser talks to the `/ingest` proxy; this documents the upstream) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity project id |

PostHog and Clarity boot only when `NODE_ENV === "production"`, so `next dev`
never sends data regardless of what's in `.env.local`.

**Custom PostHog events** are centralised in `src/lib/analytics.ts` (typed
helpers — no bare `posthog.capture` in components):

| Event | Where it fires | File |
| --- | --- | --- |
| `contact_click` | any contact link (Contact section + menu panel) | `components/Contact.tsx`, `components/Nav.tsx` |
| `language_switch` | ES/EN switch | `components/LocaleSwitcher.tsx` |
| `project_card_click` | opening a featured project's screenshot viewer | `components/Work.tsx` |
| `project_link_click` | repo/live link on any project | `components/Work.tsx` |
| `note_read` | scrolled 75% through a Log note | `components/analytics/NoteReadTracker.tsx` |
| `$pageview` | every route change (manual, App Router) | `components/analytics/PostHogPageview.tsx` |

**Excluding your own traffic.** Visit any page once with `?internal=1`
(e.g. `https://leobastianelli.dev/en?internal=1`). That registers an
`is_internal: true` super property on that browser, which PostHog persists and
attaches to every subsequent event. In PostHog, filter it out with
`is_internal is not set` (or `!= true`) on insights / replay. It's per-browser
and sticks until site data is cleared; re-apply after clearing. Handled in
`components/analytics/PostHogPageview.tsx`.

`cv_download`, `hero_cta_click` and `contact_form_submit` helpers exist but are
unwired — the site currently has no CV download, no hero CTA and no contact
form. Wire the helper at the call site if any of those get added.

## Notable technical decisions

**Bilingual routing without an i18n library.** Two locales don't justify one. A `proxy.ts` middleware resolves the visitor's locale (saved cookie, then `Accept-Language`, then a default) and redirects locale-less paths; `[locale]` segments do the rest. `src/lib/i18n.ts` holds the handful of primitives this needs (`isLocale`, `localizePath`, `localeFromAcceptLanguage`, …).

**MDX metadata via `export const metadata`, not frontmatter.** `@next/mdx` doesn't parse YAML frontmatter out of the box — that requires `remark-frontmatter` and friends. Rather than add dependencies for it, each note's `.mdx` file exports its own `metadata` object (title), and locale-agnostic fields (date, kind, tags) live in a sibling `meta.ts`. Same split used for project content, applied consistently.

**JSON-LD as a single `@graph` with stable `@id`s.** The home page defines `Person` and `WebSite` once (`{SITE_URL}/#person`, `/#website`); every other page (notes, projects) references them by `@id` instead of repeating the entity. Projects are typed `SoftwareApplication` or `CreativeWork` depending on whether they're a real piece of software or a content/marketing site; the four without a public URL omit it rather than pointing at the portfolio page that merely describes them.

**Dynamic OG images with `ImageResponse`.** Each route (`/`, `/notes`, `/notes/[slug]`) generates its own Open Graph image at request time, reusing the site's actual design tokens — colors and the Bricolage Grotesque typeface are loaded from Google Fonts at render time, since `next/og`'s renderer (Satori) can't resolve CSS custom properties or `next/font`.

**Accessibility audited, not assumed.** Keyboard focus order, `prefers-reduced-motion` coverage, and WCAG 2.1 AA were reviewed end to end — not just on new components. A couple of real issues came out of it: a disclosure pattern whose links were unreachable via forward Tab (fixed with targeted focus redirection, not a DOM reorder), and two animation systems (`.reveal`, `.fade-up`) that ignored the reduced-motion setting entirely.

**Lighthouse 100/100/100/100** (Performance/Accessibility/Best Practices/SEO), verified in both locales against a production build.
