import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { createServer } from 'vite'
import { metadataMarkup } from '../src/lib/seo'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { pageRoutes } = await vite.ssrLoadModule('/src/app/routes.tsx')
  const { SiteLayout } = await vite.ssrLoadModule('/src/app/site-layout.tsx')
  const template = await readFile('dist/index.html', 'utf8')
  for (const { path, element } of pageRoutes) {
    const destination = path === '/' ? 'dist/index.html' : `dist${path}/index.html`
    const body = renderToString(createElement(StaticRouter, { location: path }, createElement(SiteLayout, null, element)))
    const html = template
      .replace(/<!-- SEO_START -->[\s\S]*?<!-- SEO_END -->/, metadataMarkup(path))
      .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    if (html === template || !html.includes(`<div id="root">${body}</div>`)) throw new Error(`Prerender failed for ${path}`)
    await mkdir(destination.slice(0, destination.lastIndexOf('/')), { recursive: true })
    await writeFile(destination, html)
    console.log(`Prerendered ${path} → ${destination}`)
  }
} finally {
  await vite.close()
}
