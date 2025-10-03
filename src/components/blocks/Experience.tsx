"use client";

import { Experience, experiences } from "@/shared/experience";
import { IconWorld } from "@tabler/icons-react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

export const ExperiencesCard = () => {
  return (
    <div>
      <h3 className="text-4xl font-[700]">Experience</h3>
      <div className="grid md:lg:grid-cols-2 grid-cols-1 gap-4 mt-4">
        {experiences.map((project, index) => {
          return <ExperienceCard block={project} key={index} index={index} />;
        })}
      </div>
    </div>
  );
};

const ExperienceCard: React.FC<{
  block: Experience;
  index: number;
}> = ({ block, index, ...props }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView && { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col gap-4 p-4 bg-[#1a1a1a49]/30 backdrop-blur-sm rounded-lg "
      {...props}
    >
      <Image
        height={500}
        width={500}
        src={block.image}
        alt={block.name}
        draggable="false"
        loading="lazy"
        className="w-full h-fit rounded-lg"
      />

      <h4 className="text-xl font-[600]">{block.name}</h4>
      <p>{block.description}</p>
      <div className="mt-auto mb-8 gap-4 flex">
        <Link
          href={block.url}
          target="_blank"
          className="inline-flex items-center gap-2 justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-zinc-800 h-10 px-4 py-2 relative group overflow-hidden text-gray-50 rounded-lg hover:bg-zinc-700 hover:text-gray-50 transition-all duration-500 "
        >
          <IconWorld />
          <span>Website</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -translate-x-full group-hover:translate-x-full transition duration-700" />
        </Link>
      </div>
    </motion.div>
  );
};
