"use client";

import { useLanguage } from "@/context/LanguageContext";
import type { Locale } from "@/data/resumeData";

const LOCALES: readonly Locale[] = ["fr", "en"];

export function LanguageSwitch() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="no-print flex overflow-hidden rounded-lg border border-emerald-400/40" role="group" aria-label="Language">
      {LOCALES.map((item) => {
        const active = item === locale;
        return (
          <button
            key={item}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(item)}
            className={`px-2 py-1 font-pixel text-sm uppercase ${
              active ? "bg-emerald-400 text-[#090d14]" : "text-ink"
            }`}
          >
            {item}
          </button>
        );
      })}
    </div>
  );
}
