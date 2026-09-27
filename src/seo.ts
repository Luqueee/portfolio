export const siteUrl = 'https://luqueee.dev'
export const socialImage = `${siteUrl}/og.png`

export const pages = {
  '/': {
    title: 'luqueee — Developer',
    description: 'I make things I wish already existed. Explore mole, Kivgraph, my experience, and the tools I use to build software.',
  },
  '/projects': {
    title: 'Projects — luqueee',
    description: 'Explore mole, an auto-discovering SSH port forwarder, and Kivgraph, local code intelligence for coding agents.',
  },
} as const

export type PagePath = keyof typeof pages

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

  return [{
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pages['/projects'].title,
    url: pageUrl('/projects'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'mole', url: 'https://mole.luqueee.dev/' },
        { '@type': 'ListItem', position: 2, name: 'Kivgraph', url: 'https://kivgraph.dev/' },
      ],
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
    '<meta property="og:type" content="website" />',
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
