import Link from "next/link";
import { GitHub } from "../ui/Icons";

export function Footer() {
  return (
    <footer className="mt-20 mx-auto w-full max-w-[1000px] border border-zinc-800 bg-zinc-900/10 backdrop-blur-lg rounded-xl px-4 py-2 flex justify-between items-center">
      <Link
        href={"https://github.com/luqueee/portfolio"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex w-fit items-center gap-2 justify-center whitespace-nowrap text-sm font-medium  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  px-2 py-2 h-10 relative group  text-gray-50 rounded-full hover:bg-transparent hover:text-gray-50 transition-transform duration-500 hover:scale-105"
      >
        <GitHub className="w-7 h-7" />
      </Link>
      <p>Adrià Cabrera Luque</p>
    </footer>
  );
}
