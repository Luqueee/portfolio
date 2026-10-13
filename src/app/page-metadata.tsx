import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'
import { isPagePath, pageUrl, pages, socialImage, structuredData } from '../lib/seo'

export function PageMetadata() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const path = pathname !== '/' && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
    if (!isPagePath(path)) return
    const page = pages[path]
    document.title = page.title
    const metadata: Record<string, string> = {
      description: page.description,
      'og:type': path.startsWith('/projects/') ? 'article' : 'website',
      'og:title': page.title,
      'og:description': page.description,
      'og:url': pageUrl(path),
      'og:image': socialImage,
      'twitter:title': page.title,
      'twitter:description': page.description,
      'twitter:image': socialImage,
    }
    for (const [name, content] of Object.entries(metadata)) {
      const selector = name.startsWith('og:') ? `meta[property="${name}"]` : `meta[name="${name}"]`
      document.querySelector(selector)?.setAttribute('content', content)
    }
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageUrl(path))
    const data = document.querySelector('script[type="application/ld+json"]')
    if (data) data.textContent = JSON.stringify(structuredData(path))
  }, [pathname])
  return null
}
