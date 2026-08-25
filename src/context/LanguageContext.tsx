"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import type { UiContent } from "@/lib/content/ui";

interface LangContextValue {
  locale: Locale;
  t: UiContent;
}

const LangContext = createContext<LangContextValue | null>(null);

/**
 * The locale and its content are resolved server-side (`getUi`, which reads
 * from disk) and handed down as `ui` — nothing to detect or load here.
 */
export function LanguageProvider({
  locale,
  ui,
  children,
}: {
  locale: Locale;
  ui: UiContent;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ locale, t: ui }), [locale, ui]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
