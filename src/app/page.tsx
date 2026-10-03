import { ContactSection } from "@/components/ContactSection";
import { EducationSection } from "@/components/EducationSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Header } from "@/components/Header";
import { HobbiesSection } from "@/components/HobbiesSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsSection } from "@/components/SkillsSection";

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-5xl px-5 pb-16">
        <EducationSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <HobbiesSection />
        <ContactSection />
      </main>
    </div>
  );
}
