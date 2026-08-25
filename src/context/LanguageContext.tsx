"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";

export const translations = {
  es: {
    nav: {
      work: "Trabajo",
      stack: "Stack",
      about: "Sobre mí",
      contact: "Contacto",
      hire: "Contratame",
      language: "Idioma",
      localeNames: { en: "English", es: "Español" },
    },
    hero: {
      labelRole: "Software para pymes argentinas",
      labelCity: "Córdoba, Argentina",
      bio: "Vi bastantes negocios chicos y medianos de acá quedar afuera de herramientas que las empresas grandes —muchas veces extranjeras— usan hace años. Desarrollo tiendas online, sistemas internos y automatizaciones para que ese acceso no dependa del tamaño de la empresa.",
      cta: "Escribime →",
    },
    work: {
      sectionLabel: "Proyectos Seleccionados",
      sectionTitle: "Proyectos & Colaboraciones",
      projects: [
        {
          role: "Desarrollador WordPress",
          description:
            "Plugins personalizados, soporte bilingüe con WPML, integraciones de reservas, filtrado de blog con AJAX y componentes de email HTML. Gestión completa de un sitio de hospitalidad de alto tráfico para viajeros internacionales.",
        },
        {
          role: "Desarrollador Full-Stack",
          description:
            "Firebase Auth con OTP sin contraseña, Shopify Storefront & Admin APIs, integración de Loop Subscriptions, flujos de email con Resend y seguimiento de afiliados con Impact.com. Plataforma de e-commerce de extremo a extremo.",
        },
        {
          role: "Desarrollador Web",
          description:
            "Sitio oficial de una banda cordobesa que fusiona shoegaze, trip-hop y folk argentino. Diseño atmosférico, transiciones suaves y entrega de medios optimizada.",
        },
        {
          role: "Desarrollador Principal",
          description:
            "Sistema multi-agente de IA que utiliza Claude y la API de Google Places para identificar negocios locales sin presencia web y generar automáticamente landing pages listas para desplegar.",
        },
      ],
    },
    stack: {
      sectionLabel: "Tecnologías",
      sectionTitleItalic: "Herramientas",
      categories: [
        "Frontend",
        "Backend",
        "E-Commerce",
        "CMS",
        "Infraestructura",
        "IA & Herramientas",
      ],
    },
    about: {
      sectionLabel: "Trayectoria",
      sectionTitleMain: "Sobre",
      sectionTitleItalic: "mí",
      p1: "Soy desarrollador full-stack, pero antes de escribir una línea de código me importa entender cómo funciona tu negocio: qué vendés, cómo lo vendés hoy, y dónde se traba el proceso. Eso define qué vale la pena construir — no al revés.",
      p2: "Trabajé en tiendas de e-commerce, sistemas internos y automatizaciones para negocios de distintos tamaños, desde pymes locales hasta clientes en Europa y América. Esa mezcla me sirve acá: sé qué tecnología usan las empresas grandes y cómo adaptarla a la escala y el presupuesto real de una pyme argentina.",
      p3pre: "Fuera del trabajo con clientes, contribuyo a ",
      p3post:
        ", una banda de Córdoba que fusiona shoegaze, trip-hop y folk argentino — donde también me encargo de la presencia digital.",
      table: [
        { label: "Experiencia", value: "5+ años" },
        { label: "Ubicación", value: "Córdoba, Argentina" },
        { label: "Idiomas", value: "Español (nativo) · Inglés (fluido)" },
        {
          label: "Disponibilidad",
          value: "Disponible para freelance y contratos",
        },
        { label: "Zona horaria", value: "GMT-3 (ART)" },
      ],
    },
    contact: {
      sectionLabel: "Hablemos",
      headlineMain: "Trabajemos",
      headlineItalic: "juntos.",
      subtitle:
        "Contame cómo funciona tu negocio hoy y te digo qué tiene sentido construir. Respondo en menos de 24 horas.",
    },
  },

  en: {
    nav: {
      work: "Work",
      stack: "Stack",
      about: "About",
      contact: "Contact",
      hire: "Hire me",
      language: "Language",
      localeNames: { en: "English", es: "Español" },
    },
    hero: {
      labelRole: "Software for Argentine SMEs",
      labelCity: "Córdoba, Argentina",
      bio: "I've seen plenty of small and medium businesses here get left out of tools that large companies — often foreign ones — have used for years. I build online stores, internal systems, and automations so that access doesn't depend on company size.",
      cta: "Get in touch →",
    },
    work: {
      sectionLabel: "Selected work",
      sectionTitle: "Projects & Collaborations",
      projects: [
        {
          role: "WordPress Developer",
          description:
            "Custom plugins, WPML bilingual support, booking integrations, AJAX-powered blog filtering, HTML email components. Full ownership of a high-traffic hospitality site serving international travellers.",
        },
        {
          role: "Full-Stack Developer",
          description:
            "Firebase Auth with passwordless OTP, Shopify Storefront & Admin APIs, Loop Subscriptions integration, Resend email flows, and affiliate tracking with Impact.com. End-to-end e-commerce platform.",
        },
        {
          role: "Web Developer",
          description:
            "Official website for a Córdoba-based band blending shoegaze, trip-hop, and Argentine folk. Atmospheric design, smooth transitions, and optimised media delivery.",
        },
        {
          role: "Lead Developer",
          description:
            "Multi-agent AI system using Claude and Google Places API to identify local businesses without websites and auto-generate ready-to-deploy landing pages at scale.",
        },
      ],
    },
    stack: {
      sectionLabel: "Technical expertise",
      sectionTitleItalic: "Tools",
      categories: [
        "Frontend",
        "Backend",
        "E-Commerce",
        "CMS",
        "Infrastructure",
        "AI & Tooling",
      ],
    },
    about: {
      sectionLabel: "Background",
      sectionTitleMain: "About",
      sectionTitleItalic: "me",
      p1: "I'm a full-stack developer, but before writing a single line of code I want to understand how your business works: what you sell, how you sell it today, and where the process breaks down. That's what defines what's worth building — not the other way around.",
      p2: "I've worked on e-commerce stores, internal systems, and automations for businesses of different sizes, from local SMEs to clients in Europe and the Americas. That mix is useful here: I know what technology large companies use and how to adapt it to the real scale and budget of an Argentine SME.",
      p3pre: "Outside of client work, I contribute to ",
      p3post:
        ", a band from Córdoba blending shoegaze, trip-hop, and Argentine folk — where I also handle the digital presence.",
      table: [
        { label: "Experience", value: "5+ years" },
        { label: "Location", value: "Córdoba, Argentina" },
        { label: "Languages", value: "Spanish (native) · English (fluent)" },
        { label: "Availability", value: "Open to freelance & contracts" },
        { label: "Time Zone", value: "ART (UTC−3)" },
      ],
    },
    contact: {
      sectionLabel: "Get in touch",
      headlineMain: "Let's work",
      headlineItalic: "together.",
      subtitle:
        "Tell me how your business works today and I'll tell you what's worth building. I reply within 24 hours.",
    },
  },
} as const;

export type Translations = typeof translations;

interface LangContextValue {
  locale: Locale;
  t: (typeof translations)[Locale];
}

const LangContext = createContext<LangContextValue | null>(null);

/**
 * The locale is owned by the route, so there is nothing to detect on the
 * client and nothing to correct after hydration.
 *
 * TODO(stage 2): replaced by the `content/` + `ui/` layer.
 */
export function LanguageProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, t: translations[locale] }), [locale]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
