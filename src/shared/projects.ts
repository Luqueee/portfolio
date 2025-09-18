import { Language } from "@/types/languages";

export interface Project {
    name: string;
    description: string;
    image: string;
    tech_stack: Language[];
    code?: string;
    demo?: string;
}

export const projects: Project[] = [
    {
        name: "RemoteCord",
        description: "An application used to remote control your computer using a discord bot.",
        image: "/images/projects/remotecord.webp",
        tech_stack: [
            "React",
            "TypeScript",
            "Tauri",
            "Docker",
            "Pm2",
            "Redis",
            "Nest.js"
        ],
        code: "https://github.com/remotecord",
        demo: "https://remotecord.app"
    },
    {
        name: "Rplace clone",
        description: "Clone from Rplace project made by reddit, inspired also on Wplace.",
        image: "/images/projects/rplace.webp",
        tech_stack: [
            "Next.js",
            "TypeScript",
            "Postgres",
            "Pm2",
            "Redis",
            "Nest.js"
        ],
        code: "https://github.com/rplace-clone",
        demo: "https://drawit.place"
    },


]