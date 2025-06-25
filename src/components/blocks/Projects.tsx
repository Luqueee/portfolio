"use client";

import { Project, projects } from "@/shared/projects";
import { IconCode, IconWorld } from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

export const ProjectsCard = () => {
  return (
    <div>
      <h3 className="text-4xl font-[700]">Projects</h3>
      <div className="grid md:lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
        {projects.map((project, index) => {
          return <ProjectCard project={project} key={index} index={index} />;
        })}
      </div>
    </div>
  );
};

const ProjectCard: React.FC<{
  project: Project;
  index: number;
}> = ({ project, index, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView && { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col gap-4 p-4 bg-[#1a1a1a49]/30 backdrop-blur-sm rounded-lg aspect-[3/4]"
      {...props}
    >
      <Image
        height={500}
        width={500}
        src={project.image}
        alt={project.name}
        draggable="false"
        loading="lazy"
        className="w-full h-fit rounded-lg"
      />

      <h4 className="text-xl font-[600]">{project.name}</h4>
      <div className="flex flex-wrap">
        {project.tech_stack.map((tech, index) => (
          <span
            key={index}
            className="inline-block bg-zinc-800 text-gray-200 px-2 py-1 rounded-lg text-sm mr-2 mb-2"
          >
            {tech}
          </span>
        ))}
      </div>
      <div className="mt-auto mb-8 gap-4 flex">
        {project.code && (
          <Link
            href={project.code}
            target="_blank"
            className="inline-flex items-center gap-2 justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 h-10 px-4 py-2 relative group overflow-hidden text-gray-50 rounded-lg hover:bg-zinc-700 hover:text-gray-50 transition-all duration-500 "
          >
            <IconCode />
            <span> Source Code</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -translate-x-full group-hover:translate-x-full transition duration-700" />
          </Link>
        )}
        {project.demo && (
          <Link
            href={project.demo}
            target="_blank"
            className="inline-flex items-center gap-2 justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 h-10 px-4 py-2 relative group overflow-hidden text-gray-50 rounded-lg hover:bg-zinc-700 hover:text-gray-50 transition-all duration-500 "
          >
            <IconWorld />
            <span> Demo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -translate-x-full group-hover:translate-x-full transition duration-700" />
          </Link>
        )}
      </div>
    </motion.div>
  );
};
