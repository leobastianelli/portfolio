"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Lang = "es" | "en";

export const translations = {
  es: {
    nav: {
      work: "Trabajo",
      stack: "Stack",
      about: "Sobre mí",
      contact: "Contacto",
      hire: "Contratame",
    },
    hero: {
      labelRole: "Desarrollador Full-Stack",
      labelCity: "Córdoba, Argentina",
      bio: "Construyo aplicaciones web listas para producción para clientes internacionales. Más de 5 años trabajando en e-commerce, SaaS y plataformas de contenido — desde WordPress hasta Next.js, desde Shopify hasta Firebase.",
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
      p1: "Soy desarrollador full-stack con más de cinco años de experiencia construyendo productos digitales para clientes internacionales — desde startups ágiles hasta marcas consolidadas de Europa y América.",
      p2: "Mi trabajo abarca tiendas de e-commerce, dashboards SaaS y plataformas orientadas al contenido. Abordo cada proyecto con una mentalidad de producto: entender los objetivos del negocio, no solo entregar funcionalidades. Me importa el rendimiento, la confiabilidad y los pequeños detalles que hacen que un producto se sienta terminado.",
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
        "Disponible para proyectos freelance, contratos y colaboraciones a largo plazo. Respondo en menos de 24 horas.",
    },
  },

  en: {
    nav: {
      work: "Work",
      stack: "Stack",
      about: "About",
      contact: "Contact",
      hire: "Hire me",
    },
    hero: {
      labelRole: "Full-Stack Developer",
      labelCity: "Córdoba, Argentina",
      bio: "I build production-ready web applications for international clients. 5+ years working across e-commerce, SaaS, and content platforms — from WordPress to Next.js, Shopify to Firebase.",
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
      p1: "I'm a full-stack developer with over five years of experience building digital products for international clients — from lean startups to established brands across Europe and the Americas.",
      p2: "My work spans e-commerce storefronts, SaaS dashboards, and content-driven platforms. I approach each project with a product mindset: understanding the business goals, not just shipping features. I care about performance, reliability, and the small details that make a product feel finished.",
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
        "Available for freelance projects, contracts, and long-term collaborations. I respond within 24 hours.",
    },
  },
} as const;

export type Translations = typeof translations;

interface LangContextValue {
  lang: Lang;
  t: (typeof translations)[Lang];
  toggle: () => void;
  setLang: (l: Lang) => void;
}

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = localStorage.getItem("lang") as Lang | null;
    if (stored === "es" || stored === "en") {
      setLangState(stored);
    } else {
      const browserLang = navigator.language.toLowerCase();
      setLangState(browserLang.startsWith("en") ? "en" : "es");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const toggle = () => setLang(lang === "es" ? "en" : "es");

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggle, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
