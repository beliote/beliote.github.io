"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { resume, type Locale, type ResumeContent } from "@/data/resumeData";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ResumeContent;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value === "fr" || value === "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("fr");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("portfolio-locale");
    if (isLocale(stored)) {
      setLocale(stored);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    document.documentElement.lang = locale;
    window.localStorage.setItem("portfolio-locale", locale);
  }, [locale, ready]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: resume[locale],
    }),
    [locale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return value;
}
