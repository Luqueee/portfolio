import { ExperiencesCard } from "@/components/blocks/Experience";
import { ProjectsCard } from "@/components/blocks/Projects";
import { TechStackBlock } from "@/components/techstack/TechStackBlock";

import { Hero } from "@/components/hero/Hero";

export default function Home() {
  return (
    <>
      <Hero />
      <CurrentlyWorking />
      <div className="section" id="tech-stack">
        <TechStackBlock />
      </div>
      <div className="section" id="experiences">
        <ExperiencesCard />
      </div>
      <div className="section" id="projects">
        <ProjectsCard />
      </div>
    </>
  );
}
