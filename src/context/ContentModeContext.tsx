"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ContentMode = "overview" | "technical";

const STORAGE_KEY = "contentMode";

interface ContentModeContextValue {
  mode: ContentMode;
  toggle: () => void;
}

const ContentModeContext = createContext<ContentModeContextValue | null>(null);

/**
 * Global, not per-card (brief section 5). Starts at "overview" on every
 * render — including the client's first paint, to match SSR — then adopts
 * whatever was saved in localStorage once mounted.
 */
export function ContentModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ContentMode>("overview");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "overview" || stored === "technical") setMode(stored);
  }, []);

  const toggle = () => {
    setMode((prev) => {
      const next: ContentMode = prev === "overview" ? "technical" : "overview";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <ContentModeContext.Provider value={{ mode, toggle }}>
      {children}
    </ContentModeContext.Provider>
  );
}

export function useContentMode() {
  const ctx = useContext(ContentModeContext);
  if (!ctx) throw new Error("useContentMode must be used within ContentModeProvider");
  return ctx;
}
