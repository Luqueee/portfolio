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
        className="relative hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        <Image
          src={"/images/kenaLogo.png"}
          alt="kena logo"
          width={80}
          draggable={false}
          height={80}
          className="rounded-lg shadow-lg "
        />
        <Image
          src={"/images/kenaLogo.png"}
          alt="kena logo"
          width={80}
          draggable={false}
          height={80}
          className="rounded-lg shadow-lg absolute top-0 scale-110 -z-10 blur-sm animate-pulse"
        />
      </Link>
    </div>
  );
};
