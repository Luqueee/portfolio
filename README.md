# luqueee's Portfolio

A personal portfolio built with React, React Router, and Vite. Its editorial design draws inspiration from the simplicity of antfu.me, with its own content and identity.

## Development

```bash
bun install
bun run dev
```

`bun run build` checks TypeScript, builds the client and prerenders `/`, `/projects/`, `/projects/mole/`, `/projects/kivgraph/`, and `/projects/qwen-a10/` into `dist/`. All five pages have readable HTML before JavaScript executes. `bun run preview` serves the production output locally.

## Project stories

Mole, Kivgraph, and Qwen on A10 each have a Markdown article in `content/projects/`. Edit `mole.md`, `kivgraph.md`, or `qwen-a10.md` to change the story, then rebuild; use `##` for article sections because the page supplies its own `h1`. The project title, short summary, canonical path, and SEO description live in `src/projects.ts`. `src/site.tsx` imports the Markdown files as raw text and renders them with `react-markdown`, while `scripts/prerender.ts` produces static HTML for direct links and crawlers. Project names on the home and projects pages link to these stories; Website/Documentation and GitHub remain external links. An optional `websiteLabel` customizes the external resource label for projects without a standalone website.

For another project, add its data in `src/projects.ts`, its Markdown file and import in `src/site.tsx`, and its canonical URL in `public/sitemap.xml`. The client routes and prerender pages are generated from the project list.

The Qwen on A10 story documents the [qwen38-a10-llamampere repository](https://github.com/Luqueee/qwen38-a10-llamampere), including the NaN-tic internship context, Tryton quality task, frozen inference replay, final configuration, and measurement limits. Its linked documentation and archived comparison are the sources for performance claims; distinguish historical experiments from the final serving spec when updating the article.

## SEO and deployment

- Canonical origin: `https://luqueee.dev` (taken from the previous portfolio configuration). Change `src/seo.ts` and the URLs in `public/robots.txt` and `public/sitemap.xml` together if the domain changes.
- `src/seo.ts` owns per-page titles, descriptions, Open Graph/Twitter metadata, and JSON-LD; Vite injects home metadata during development/build, then `scripts/prerender.ts` writes distinct projects and article pages.
- `public/og.png` is the 1200×630 social preview rendered from `public/og.svg`. `public/robots.txt` points to `public/sitemap.xml`.
- Deploy the **contents of `dist/`**, serving each listed route from its matching `index.html` (including the three project article directories). Preserve `robots.txt`, `sitemap.xml`, `og.png`, `favicon.png`, and `apple-touch-icon.png` at the origin root. The site icons are resized and cropped from the supplied `logo-portfolio.png`. Unknown paths should return HTTP 404 rather than a 200 response with home-page metadata.
- After deployment, verify the public responses for every sitemap URL and submit the sitemap to your search engine webmaster tools; local builds do not establish that production is deployed or indexed.

The homepage and `/projects` show [Mole](https://mole.luqueee.dev/), [Kivgraph](https://kivgraph.dev/), and [Qwen on A10](https://github.com/Luqueee/qwen38-a10-llamampere) in a minimal editorial list. Experience links are separate from project entries.

The site uses a charcoal dark theme throughout, without a theme switcher.

Page navigation, first-load content, project hover states, and sections entering the viewport use subtle transitions. Reduced-motion preferences disable the animation.

Technology logos are served from [SVGL](https://svgl.app/), using dark-background variants where available.
