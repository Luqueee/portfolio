type Languages =
  | "Postgres"
  | "MongoDB"
  | "TypeScript"
  | "Python"
  | "Golang"
  | "Html5"
  | "CSS"
  | "MongoDB"
  | "Next.js"
  | "React"
  | "Node.js"
  | "Express.js"
  | "Nest.js"
  | "Tauri"
  | "Docker"
  | "Pm2"
  | "Redis";

export interface Language {
  name: Languages;
  icon: string;
}

export type Langs = Language[];
