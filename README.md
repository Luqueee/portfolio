# luqueee's Portfolio

A personal portfolio built with React, React Router, Vite, and Tailwind CSS 4. Its editorial design draws inspiration from the simplicity of antfu.me, with its own content and identity.

## Development

Use Bun 1.4.2 (the version declared in `package.json`). When running with Node.js, React Router 8 requires Node 22.22 or newer. React and React DOM must be 19.2.7 or newer.

Routing uses React Router 8 in Data Mode: import routing APIs from `react-router` and the browser `RouterProvider` from `react-router/dom`. The prerender script uses `StaticRouter` from `react-router`. There is no `react-router-dom` dependency or React Router framework plugin.

```bash
bun install
bun run dev
```

`bun run build` checks TypeScript, builds the client and prerenders `/`, `/projects/`, `/projects/mole/`, `/projects/kivgraph/`, and `/projects/qwen-a10/` into `dist/`. All five pages have readable HTML before JavaScript executes. `bun run preview` serves the production output locally.

## Architecture and styling

- `src/main.tsx`: browser bootstrap; hydrate known prerendered routes and render unknown-path fallbacks without hydrating unrelated HTML.
- `src/app/`: shared route definitions, site layout, and client metadata updates. `routes.tsx` is the source of truth for both browser routing and prerendering.
- `src/pages/`: Home, Projects, and ProjectArticle views.
- `src/components/`: reusable page typography, sections, reveal behavior, project list, technology labels, and external links; `layout/` contains the header and footer.
- `src/data/`: project catalog, Markdown article imports, profile, technologies, experience, and contact links.
- `src/hooks/`: route-driven scrolling and viewport reveal effects, with observer/listener cleanup and reduced-motion support.
- `src/lib/seo.ts`: metadata and structured-data generation.
- `content/projects/`: article content, independent of the presentation layer.

Tailwind runs through `@tailwindcss/vite`; component styling lives in utility classes alongside the markup. `src/styles.css` contains the Tailwind import, shared `@theme` typography/color/easing tokens, global base styles, and keyframes/view transitions only. There is no component stylesheet or `@apply` layer. Project list class names remain semantic hooks, not styling selectors.

Edit theme tokens for site-wide design changes, shared components for repeated UI, and page modules for view-specific layout. Keep complete utility class strings rather than dynamically constructing Tailwind class names. Reveals remain readable in prerendered HTML before JavaScript runs and respect changes to `prefers-reduced-motion`.

## Project stories

Mole, Kivgraph, and Qwen on A10 each have a Markdown article in `content/projects/`. Edit `mole.md`, `kivgraph.md`, or `qwen-a10.md` to change the story, then rebuild; use `##` for article sections because the page supplies its own `h1`. The project title, short summary, canonical path, and SEO description live in `src/data/projects.ts`. `src/data/articles.ts` imports the Markdown files as raw text and `src/pages/project-article.tsx` renders them with `react-markdown`, while `scripts/prerender.ts` produces static HTML for direct links and crawlers. Project names on the home and projects pages link to these stories; Website/Documentation and GitHub remain external links. An optional `websiteLabel` customizes the external resource label for projects without a standalone website.

For another project, add its data in `src/data/projects.ts`, its Markdown file and import in `src/data/articles.ts`, and its canonical URL in `public/sitemap.xml`. The typed article map requires content for every project slug. Client routes and prerendered pages are generated from the same project-backed route definitions.

The Qwen on A10 story documents the [qwen38-a10-llamampere repository](https://github.com/Luqueee/qwen38-a10-llamampere), including the NaN-tic internship context, Tryton quality task, frozen inference replay, final configuration, and measurement limits. Its linked documentation and archived comparison are the sources for performance claims; distinguish historical experiments from the final serving spec when updating the article.

## SEO and deployment

- Canonical origin: `https://luqueee.dev` (taken from the previous portfolio configuration). Change `src/lib/seo.ts` and the URLs in `public/robots.txt` and `public/sitemap.xml` together if the domain changes.
- `src/lib/seo.ts` owns per-page titles, descriptions, Open Graph/Twitter metadata, and JSON-LD; Vite injects home metadata during development/build, then `scripts/prerender.ts` writes distinct projects and article pages.
- `public/og.png` is the 1200×630 social preview rendered from `public/og.svg`. `public/robots.txt` points to `public/sitemap.xml`.
- Deploy the **contents of `dist/`**, serving each listed route from its matching `index.html` (including the three project article directories). Preserve `robots.txt`, `sitemap.xml`, `og.png`, `favicon.png`, and `apple-touch-icon.png` at the origin root. The site icons are resized and cropped from the supplied `logo-portfolio.png`. Unknown paths should return HTTP 404 rather than a 200 response with home-page metadata.
- After deployment, verify the public responses for every sitemap URL and submit the sitemap to your search engine webmaster tools; local builds do not establish that production is deployed or indexed.

The homepage and `/projects` show [Mole](https://mole.luqueee.dev/), [Kivgraph](https://kivgraph.dev/), and [Qwen on A10](https://github.com/Luqueee/qwen38-a10-llamampere) in a minimal single-column editorial list, without technology labels beside the titles. Each padded card links to its story through the title's stretched link; resource links remain independently clickable above that overlay. Project kinds remain on their article pages. Experience links are separate from project entries.

The site uses a charcoal dark theme throughout, without a theme switcher. The homepage starts directly with its introduction heading; the footer contains only the copyright.

Page navigation, first-load content, project hover states, and sections entering the viewport use subtle transitions. CSS-only microinteractions add sliding underlines to project actions, 1 px directional arrow movement on link hover and keyboard focus, a small press response on links, and a subtle brand tilt. These additions run only when `prefers-reduced-motion: no-preference`; reduced-motion preferences disable the animation.

Technology logos are served from [SVGL](https://svgl.app/), using dark-background variants where available.
