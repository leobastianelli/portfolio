"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ContentMode = "overview" | "technical";

const STORAGE_KEY = "contentMode";

interface ContentModeContextValue {
  mode: ContentMode;
  setMode: (mode: ContentMode) => void;
}

const ContentModeContext = createContext<ContentModeContextValue | null>(null);

/**
 * Global, not per-card (brief section 5). Starts at "overview" on every
 * render — including the client's first paint, to match SSR — then adopts
 * whatever was saved in localStorage once mounted.
 */
export function ContentModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ContentMode>("overview");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "overview" || stored === "technical") setModeState(stored);
  }, []);

  // The segmented-control redesign has two independently clickable
  // options ("Técnico" / "Resumen"), not a single flip switch — each sets
  // the mode it names directly.
  const setMode = (next: ContentMode) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    setModeState(next);
  };

  return (
    <ContentModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ContentModeContext.Provider>
  );
}

export function useContentMode() {
  const ctx = useContext(ContentModeContext);
  if (!ctx) throw new Error("useContentMode must be used within ContentModeProvider");
  return ctx;
}
