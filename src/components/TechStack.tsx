"use client";
import { languages } from "@/shared/tech-stack";
import { useInView, motion } from "motion/react";
import { useRef } from "react";

export const TechStack = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);

  return (
    <div ref={ref} className=" w-full">
      <h3 className="text-4xl font-[700]">Tech Stack</h3>
      <div className="grid md:lg:grid-cols-8 grid-cols-4 gap-4 mt-4">
        {languages.map((lang, idx) => (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 * (idx * 0.5) }}
            key={lang.name}
            className={
              "border  border-zinc-800 hover:bg-zinc-800 focus:bg-zinc-800 bg-transparent rounded-lg p-2 gap-2 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-300"
            }
          >
            <img
              src={lang.icon}
              alt={lang.name}
              draggable={false}
              loading="lazy"
              className="w-10 h-10 object-contain"
            />
            <p className="text-sm text-zinc-400 select-none">{lang.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
