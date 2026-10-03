"use client";

import { SectionHeading } from "@/components/Timeline";
import { useLanguage } from "@/context/LanguageContext";

export function ProjectsSection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-rule py-10" aria-labelledby="projets">
      <SectionHeading id="projets" index={t.projects.index} title={t.projects.title} />
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {t.projects.items.map((item) => (
          <article key={`${item.period}-${item.title}`} className="pixel-card flex h-full flex-col px-4 py-4">
            <p className="font-pixel text-sm text-emerald-300">{item.period}</p>
            <h3 className="mt-2 text-sm font-medium leading-snug">{item.title}</h3>
            <p className="mt-1 text-sm text-mute">{item.place}</p>
            {item.detail ? <p className="mt-2 text-sm leading-relaxed">{item.detail}</p> : null}
            {item.stack ? (
              <ul className="mt-3 flex flex-wrap gap-2">
                {item.stack.split(", ").map((piece) => (
                  <li key={piece} className="rounded-full border border-rule px-2 py-0.5 font-mono text-xs text-mute">
                    {piece}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
