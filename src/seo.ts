import { projects, type Project } from './projects'

export const siteUrl = 'https://luqueee.dev'
export const socialImage = `${siteUrl}/og.png`

export type PagePath = '/' | '/projects' | Project['path']

export const pages = {
  '/': {
    title: 'luqueee — Developer',
    description: 'I make things I wish already existed. Explore Mole, Kivgraph, my experience, and the tools I use to build software.',
  },
  '/projects': {
    title: 'Projects — luqueee',
    description: 'Explore Mole, an auto-discovering SSH port forwarder, and Kivgraph, local code intelligence for coding agents.',
  },
  ...Object.fromEntries(projects.map((project) => [
    project.path,
    { title: `${project.name} — Projects — luqueee`, description: project.articleDescription },
  ])),
} as Record<PagePath, { title: string; description: string }>

export function isPagePath(path: string): path is PagePath {
  return Object.hasOwn(pages, path)
}

export function pageUrl(path: PagePath) {
  return `${siteUrl}${path === '/' ? '/' : `${path}/`}`
}

export function structuredData(path: PagePath) {
  if (path === '/') {
    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'luqueee',
        url: siteUrl,
        sameAs: ['https://github.com/luqueee', 'https://www.instagram.com/adria.cabreraa'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'luqueee',
        url: siteUrl,
        inLanguage: 'en',
      },
    ]
  }

  if (path === '/projects') return [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pages['/projects'].title,
    url: pageUrl('/projects'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: project.name,
        url: pageUrl(project.path),
      })),
    },
  }]

  const project = projects.find((item) => item.path === path)!
  return [{
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: pages[path].title,
    description: pages[path].description,
    url: pageUrl(path),
    author: { '@type': 'Person', name: 'luqueee', url: siteUrl },
    about: {
      '@type': 'SoftwareApplication',
      name: project.name,
      url: project.website,
      codeRepository: project.repository,
    },
  }]
}

function escapeAttribute(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

export function metadataMarkup(path: PagePath) {
  const { title, description } = pages[path]
  const tags = [
    `<title>${escapeAttribute(title)}</title>`,
    `<meta name="description" content="${escapeAttribute(description)}" />`,
    `<link rel="canonical" href="${pageUrl(path)}" />`,
    '<meta name="robots" content="index, follow" />',
    `<meta property="og:type" content="${path.startsWith('/projects/') ? 'article' : 'website'}" />`,
    '<meta property="og:site_name" content="luqueee" />',
    '<meta property="og:locale" content="en_US" />',
    `<meta property="og:title" content="${escapeAttribute(title)}" />`,
    `<meta property="og:description" content="${escapeAttribute(description)}" />`,
    `<meta property="og:url" content="${pageUrl(path)}" />`,
    `<meta property="og:image" content="${socialImage}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="luqueee — I make things I wish already existed." />',
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `<meta name="twitter:description" content="${escapeAttribute(description)}" />`,
    `<meta name="twitter:image" content="${socialImage}" />`,
    `<script type="application/ld+json">${JSON.stringify(structuredData(path)).replaceAll('<', '\\u003c')}</script>`,
  ]
  return `<!-- SEO_START -->\n    ${tags.join('\n    ')}\n    <!-- SEO_END -->`
}
