import { CurrentlyWorking } from "@/components/blocks/CurrentlyWorking";
import { ExperiencesCard } from "@/components/blocks/Experience";
import { ProjectsCard } from "@/components/blocks/Projects";
import { TechStack } from "@/components/blocks/TechStack";

import { Hero } from "@/components/hero/Hero";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Hero />
      {/* <CurrentlyWorking /> */}
      <div className="section" id="tech-stack">
        <TechStack />
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
