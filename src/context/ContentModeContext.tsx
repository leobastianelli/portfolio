"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

export type ContentMode = "overview" | "technical";

const STORAGE_KEY = "contentMode";
let fallbackMode: ContentMode = "overview";
const listeners = new Set<() => void>();
function readMode(): ContentMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "technical" || stored === "overview" ? stored : fallbackMode;
  } catch { return fallbackMode; }
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}
function setMode(next: ContentMode) {
  fallbackMode = next;
  try { window.localStorage.setItem(STORAGE_KEY, next); } catch { /* Keep the control usable without storage. */ }
  listeners.forEach((listener) => listener());
}

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
  const mode = useSyncExternalStore(subscribe, readMode, (): ContentMode => "overview");

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
