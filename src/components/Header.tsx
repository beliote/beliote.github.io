"use client";

import { LanguageSwitch } from "@/components/LanguageSwitch";
import { useLanguage } from "@/context/LanguageContext";
import { profile } from "@/data/resumeData";

export function Header() {
  const { t } = useLanguage();

  return (
    <header>
      <div className="sticky top-0 z-40 border-b border-rule/80 bg-[#090d14]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-3">
          <a href="#haut" className="font-pixel shrink-0 text-sm text-ink">
            {profile.name}
          </a>
          <nav className="flex min-w-0 flex-1 gap-4 overflow-x-auto" aria-label="Sections">
            {t.nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="shrink-0 font-pixel text-sm text-mute hover:text-emerald-300"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <LanguageSwitch />
        </div>
      </div>

      <div id="haut" className="mx-auto max-w-5xl px-5 pb-8 pt-10">
        <h1 className="glitch font-pixel text-4xl leading-none sm:text-5xl">{profile.name}</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-mute">{t.role}</p>
        <p className="mt-6 inline-flex max-w-3xl items-center gap-2 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-3 py-2 font-pixel text-sm leading-snug text-emerald-300">
          <span className="beacon inline-block h-2 w-2 shrink-0 rounded-full bg-emerald-400" aria-hidden />
          {t.status}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <a className="underline decoration-rule underline-offset-4 hover:decoration-emerald-300" href={profile.github}>
            {t.links.github}
          </a>
          <a className="underline decoration-rule underline-offset-4 hover:decoration-emerald-300" href={profile.linkedin}>
            {t.links.linkedin}
          </a>
          <a
            className="underline decoration-rule underline-offset-4 hover:decoration-emerald-300"
            href={`mailto:${profile.email}`}
          >
            {t.links.email}
          </a>
          <a
            href="/cv/BurgalatEliot_CV.pdf"
            download="BurgalatEliot_CV.pdf"
            aria-label={t.links.cvLabel}
            className="no-print rounded-lg border border-emerald-400/50 px-2 py-1 font-pixel text-sm text-emerald-300"
          >
            {t.links.cv}
          </a>
        </div>
      </div>
    </header>
  );
}
