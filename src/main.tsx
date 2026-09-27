import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Home, ProjectArticle, Projects, SiteLayout } from './site'
import { projects } from './projects'
import './styles.css'

const router = createBrowserRouter([
  { element: <SiteLayout />, children: [
    { path: '/', element: <Home /> },
    { path: '/projects', element: <Projects /> },
    ...projects.map((project) => ({ path: project.path, element: <ProjectArticle project={project} /> })),
    { path: '*', element: <Navigate to="/" replace /> },
  ] },
])

const root = document.getElementById('root')!
const app = <StrictMode><RouterProvider router={router} /></StrictMode>

if (root.hasChildNodes()) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
