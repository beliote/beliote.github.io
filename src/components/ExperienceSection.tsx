"use client";

import { SectionHeading } from "@/components/Timeline";
import { useLanguage } from "@/context/LanguageContext";

export function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-rule py-10" aria-labelledby="experiences">
      <SectionHeading id="experiences" index={t.experience.index} title={t.experience.title} />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {t.experience.items.map((item) => (
          <article key={`${item.period}-${item.title}`} className="pixel-card px-4 py-4">
            <p className="font-pixel text-sm text-emerald-300">{item.period}</p>
            <h3 className="mt-2 text-sm font-medium leading-snug">{item.title}</h3>
            <p className="mt-1 text-sm text-mute">{item.place}</p>
            {item.points ? (
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 bg-emerald-400" aria-hidden="true" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : item.detail ? (
              <p className="mt-2 text-sm leading-relaxed">{item.detail}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
