export const email = 'luqueee_@outlook.es'

export const technologies = {
  React: 'react_dark.svg',
  TypeScript: 'typescript.svg',
  'Node.js': 'nodejs.svg',
  Python: 'python.svg',
  Go: 'golang_dark.svg',
  MongoDB: 'mongodb-icon-dark.svg',
  PostgreSQL: 'postgresql.svg',
  Docker: 'docker.svg',
  Redis: 'redis.svg',
} as const

export type Technology = keyof typeof technologies

export const everydayTechnologies = [
  'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'MongoDB', 'PostgreSQL', 'Docker', 'Redis',
] as const satisfies readonly Technology[]

export const experience = [
  { name: 'Kenabot', href: 'https://kenabot.xyz' },
  { name: 'NaN-tic', href: 'https://www.nan-tic.com/es' },
] as const

export const socialLinks = {
  github: { label: 'GitHub', icon: 'github', href: 'https://github.com/luqueee', external: true },
  instagram: { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/adria.cabreraa', external: true },
  email: { label: 'Email', icon: 'email', href: `mailto:${email}`, external: false },
} as const
