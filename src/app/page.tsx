import { ProjectsCard } from "@/components/blocks/Projects";
import { TechStack } from "@/components/blocks/TechStack";

import { Hero } from "@/components/hero/Hero";
import { Contests } from "@/components/blocks/Contests";
import { Studies } from "@/components/blocks/Studies";

export default function Home() {
  return (
    <div className="max-w-[1920px] w-full pb-8 mx-auto px-4 h-fit flex flex-col items-center  ">
      <Hero />
      <div className="mt-20 max-w-default w-full scroll-mt-32" id="studies">
        <Studies />
      </div>
      <div className="mt-20 max-w-default w-full scroll-mt-32" id="contests">
        <Contests />
      </div>
      <div className="mt-20 max-w-default w-full" id="tech-stack">
        <TechStack />
      </div>
      <div className="mt-20 max-w-default w-full scroll-mt-32" id="projects">
        <ProjectsCard />
      </div>
    </div>
  );
}
