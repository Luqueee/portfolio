import type { Language } from "@/types/languages";
import Image from "next/image";
import { cn, getImageTechStackIconPath } from "@/lib/utils";
import { motion } from "motion/react";
import { useImageColors } from "@/hooks/useImageColors";
export const TechStack: React.FC<{
  lang: Language;
}> = ({ lang, ...porps }) => {
  const url = getImageTechStackIconPath(lang.icon);
  const { backgroundColor } = useImageColors(url);

  return (
    <motion.div
      {...porps}
      whileHover={{ backgroundColor }}
      className={cn(
        `hover:border-none group`,
        `lang border border-zinc-800 bg-zinc-900/10 backdrop-blur-md rounded-lg p-2 gap-2 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-all duration-500`
      )}
    >
      <div className="relative">
        <Image
          src={url}
          alt={lang.name}
          draggable={false}
          loading="lazy"
          width={40}
          height={40}
          className="w-10 h-10 object-contain group-hover:scale-110 transition-all duration-300"
          unoptimized
        />
        <Image
          src={url}
          alt={lang.name}
          draggable={false}
          loading="lazy"
          width={40}
          height={40}
          className="w-10 h-10 absolute top-0 scale-105 -z-10 blur-xs animate-pulse object-contain"
          unoptimized
        />
      </div>
      <p className="text-sm text-zinc-400 select-none">{lang.name}</p>
    </motion.div>
  );
};
