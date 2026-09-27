export const projects = [
  {
    slug: 'mole',
    path: '/projects/mole',
    name: 'Mole',
    kind: 'Go · CLI',
    description: 'One SSH connection that discovers and forwards your remote development ports automatically.',
    articleDescription: 'How Mole makes remote development servers feel local with one SSH connection, automatic port discovery, and a background daemon.',
    website: 'https://mole.luqueee.dev/',
    repository: 'https://github.com/Luqueee/mole',
  },
  {
    slug: 'kivgraph',
    path: '/projects/kivgraph',
    name: 'Kivgraph',
    kind: 'Go · MCP',
    description: 'Local code intelligence for coding agents, with exact symbol references and cross-repository change impact.',
    articleDescription: 'Inside Kivgraph: a local semantic code graph for coding agents, cross-repository impact analysis, and what its benchmarks actually showed.',
    website: 'https://kivgraph.dev/',
    repository: 'https://github.com/Luqueee/kivgraph',
  },
] as const

export type Project = (typeof projects)[number]
export type ProjectSlug = Project['slug']
