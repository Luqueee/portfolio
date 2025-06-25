import Link from "next/link";
import { GitHub, Instagram } from "../ui/Icons";

const socials = [
  {
    icon: GitHub,
    href: "https://github.com/luqueee",
  },
  {
    icon: Instagram,
    href: "https://www.instagram.com/adria.cabreraa",
  },
];

export const Socials = () => {
  return (
    <div className="flex ">
      {socials.map((social, index) => {
        return (
          <Link
            href={social.href}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-2 justify-center whitespace-nowrap text-sm font-medium  ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  px-2 py-2 h-10 relative group  text-gray-50 rounded-full hover:bg-transparent hover:text-gray-50 transition-transform duration-500 hover:scale-105"
          >
            <social.icon className="w-8 h-8" />
          </Link>
        );
      })}
    </div>
  );
};
