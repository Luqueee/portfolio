import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter, matchRoutes } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { pageRoutes, routes } from './app/routes'
import './styles.css'

const router = createBrowserRouter(routes)

const root = document.getElementById('root')!
const app = <StrictMode><RouterProvider router={router} /></StrictMode>

// Unknown URLs receive the host's fallback HTML, not their own prerendered page.
if (root.hasChildNodes() && matchRoutes(pageRoutes, window.location)) {
  hydrateRoot(root, app)
} else {
  createRoot(root).render(app)
}
