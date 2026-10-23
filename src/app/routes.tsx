import type { ReactElement } from 'react'
import { Navigate, type RouteObject } from 'react-router'
import { SiteLayout } from './site-layout'
import { Home } from '../pages/home'
import { Projects } from '../pages/projects'
import { KenabotArticle } from '../pages/kenabot-article'
import { ProjectArticle } from '../pages/project-article'
import { projects } from '../data/projects'
import type { PagePath } from '../lib/seo'

// The browser and prerenderer consume the same page definitions.
export const pageRoutes: { path: PagePath; element: ReactElement }[] = [
  { path: '/', element: <Home /> },
  { path: '/projects', element: <Projects /> },
  { path: '/experience/kenabot', element: <KenabotArticle /> },
  ...projects.map((project) => ({ path: project.path, element: <ProjectArticle project={project} /> })),
]

export const routes: RouteObject[] = [
  {
    element: <SiteLayout />,
    children: [...pageRoutes, { path: '*', element: <Navigate to="/" replace /> }],
  },
]
