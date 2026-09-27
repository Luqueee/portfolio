import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { createElement, type ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { createServer } from 'vite'
import { metadataMarkup, type PagePath } from '../src/seo'
import { projects } from '../src/projects'

const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  const { Home, ProjectArticle, Projects, SiteLayout } = await vite.ssrLoadModule('/src/site.tsx')
  const template = await readFile('dist/index.html', 'utf8')
  const routes: [PagePath, ReactElement][] = [
    ['/', createElement(Home)],
    ['/projects', createElement(Projects)],
    ...projects.map((project) => [project.path, createElement(ProjectArticle, { project })] as [PagePath, ReactElement]),
  ]
  for (const [path, component] of routes) {
    const destination = path === '/' ? 'dist/index.html' : `dist${path}/index.html`
    const body = renderToString(createElement(StaticRouter, { location: path }, createElement(SiteLayout, null, component)))
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
