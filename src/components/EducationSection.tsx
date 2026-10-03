"use client";

import { SectionHeading } from "@/components/Timeline";
import { useLanguage } from "@/context/LanguageContext";

export function EducationSection() {
  const { t } = useLanguage();
  const items = [...t.education.items].reverse();

  return (
    <section className="py-10" aria-labelledby="formation">
      <SectionHeading id="formation" index={t.education.index} title={t.education.title} />
      <ol className="chrono mt-6">
        {items.map((item, index) => (
          <li key={`${item.period}-${item.title}`} className="chrono-stop">
            <span className={index === items.length - 1 ? "chrono-node beacon" : "chrono-node"} aria-hidden="true" />
            <article className="pixel-card h-full px-4 py-4">
              <p className="font-pixel text-sm text-emerald-300">{item.period}</p>
              <h3 className="mt-2 text-sm font-medium leading-snug">{item.title}</h3>
              <p className="mt-1 text-sm text-mute">{item.place}</p>
              {item.detail ? <p className="mt-2 text-sm leading-relaxed">{item.detail}</p> : null}
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
