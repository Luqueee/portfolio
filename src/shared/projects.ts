import type { Language } from "@/types/languages";

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
        description: "A Discord client for remote control of your computer.",
        image: "/images/projects/remotecord.webp",
        tech_stack: [
            "React",
            "TypeScript",
            "Node.js",
            "Tauri",
            "Docker",
            "Pm2",
            "Redis"
        ],
        code: "https://github.com/remotecord",
        demo: "https://remotecord.app"
    },


]