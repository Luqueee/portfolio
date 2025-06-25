import Link from "next/link";
import { Socials } from "./Socials";
import { IconSend } from "@tabler/icons-react";

export function Hero() {
  return (
    <>
      <div id="top" className=" mt-40 flex flex-col items-center gap-4">
        <h2 className="text-xl font-[600] text-gray-200 ">
          Adrià Cabrera Luque.
        </h2>
        <h1 className="md:lg:text-8xl text-6xl font-[600]">
          FULLSTACK
          <br />
          DEVELOPER
        </h1>
      </div>
      <div className="mt-10 flex md:lg:gap-8 gap-2">
        <Link
          href={"mailto:luqueee_@outlook.es"}
          className="inline-flex items-center gap-2 justify-center whitespace-nowrap text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input h-10 px-4 py-2 relative group overflow-hidden bg-transparent text-gray-50 rounded-full hover:bg-transparent hover:text-gray-50 transition-transform duration-500 hover:scale-105"
        >
          <IconSend stroke={2} />
          <span>Contact me</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -translate-x-full group-hover:translate-x-full transition duration-700" />
        </Link>

        <Socials />
      </div>
    </>
  );
}
