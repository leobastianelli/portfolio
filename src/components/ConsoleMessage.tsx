"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n";
import { SITE } from "@/lib/site";

const loggedLocales = new Set<Locale>();

const messages: Record<Locale, string> = {
  es:
    "Si estás buscando errores en la consola, no los vas a encontrar jaja.\n" +
    `Hablando en serio, podés revisar el código de este portfolio en ${SITE.repository}`,
  en:
    "If you're looking for errors in the console, you won't find any haha.\n" +
    `Seriously though, you can check out this portfolio's code at ${SITE.repository}`,
};

export default function ConsoleMessage({ locale }: { locale: Locale }) {
  useEffect(() => {
    if (loggedLocales.has(locale)) return;
    loggedLocales.add(locale);

    console.log(messages[locale]);
  }, [locale]);

  return null;
}
