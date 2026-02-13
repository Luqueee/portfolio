import Link from "next/link";
import Image from "next/image";
export const CurrentlyWorking: React.FC = () => {
  return (
    <div className="section flex justify-center items-center flex-col gap-8">
      <h3 className="text-3xl font-[700] relative">
        <span>Currently working on</span>
        <span className="absolute left-0 top-0 scale-101 opacity-80 -z-10 text-slate-200 blur-xs animate-pulse">
          Currently working on
        </span>
      </h3>
      <Link
        href={"https://kenabot.xyz"}
        target="_blank"
        className="relative "
      >
        <Image
          src={"/images/kenaLogo.png"}
          alt="kena logo"
          width={80}
          draggable={false}
          height={80}
          className="w-30 h-30 rounded-lg hover:scale-110  object-contain hover:-translate-y-3 transition-all duration-300"
        />
        <Image
          src={"/images/kenaLogo.png"}
          alt="kena logo"
          width={80}
          draggable={false}
          height={80}
          className="w-30 h-30 rounded-lg absolute top-0 scale-105 -z-10 blur-xs animate-pulse object-contain"
        />
      </Link>

        
    </div>
  );
};
