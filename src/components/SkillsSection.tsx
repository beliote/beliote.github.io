"use client";

import { SectionHeading } from "@/components/Timeline";
import { useLanguage } from "@/context/LanguageContext";
import type { SkillGroup } from "@/data/resumeData";

function SkillCard({ group, nowrap = false }: { group: SkillGroup; nowrap?: boolean }) {
  return (
    <article className="pixel-card min-w-0 px-4 py-4">
      <h3 className="font-pixel text-sm text-emerald-300">{group.name}</h3>
      <ul className={`mt-3 flex flex-wrap gap-2 ${nowrap ? "lg:flex-nowrap" : ""}`}>
        {group.items.map((item) => (
          <li
            key={item}
            className="shrink-0 rounded-full border border-rule bg-[#090d14]/70 px-2.5 py-1 text-sm leading-none whitespace-nowrap"
          >
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function SkillsSection() {
  const { t } = useLanguage();
  const [agents, languages, systems, spoken] = t.skills.groups;

  return (
    <section className="border-t border-rule py-10" aria-labelledby="competences">
      <SectionHeading id="competences" index={t.skills.index} title={t.skills.title} />
      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-stretch">
          <SkillCard group={agents} nowrap />
          <SkillCard group={spoken} nowrap />
        </div>
        <SkillCard group={languages} />
        <SkillCard group={systems} />
      </div>
    </section>
  );
}
