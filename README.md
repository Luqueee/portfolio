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

## Spotify now playing

The home page shows “Listening to · Spotify” beneath the introduction while the owner's account is actively playing a track. It displays unchanged album artwork, the title, artists, and a link back to Spotify. Paused/idle playback, ads, podcasts, local files without a Spotify link, and API failures hide the block rather than display stale listening activity.

The listening block is a minimal inline row without a card background, border, or outer padding, aligned with the introduction. When visible, it leaves 32 px before Featured projects; without a song, the original section spacing is preserved.

`api/now-playing.ts` is a Vercel Node function using a Web Standard handler. `server/spotify.ts` refreshes the owner's access token server-side and returns only public track fields. Secrets never use a `VITE_` prefix or enter the client bundle. Successful playback responses are cached by the CDN for 15 seconds without stale-while-revalidate; browsers poll every 30 seconds while visible and refresh when returning to the tab. Spotify rate limits honor `Retry-After`. Playback updates can therefore take up to roughly 45 seconds to appear.

### Connect your account

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard). Register **exactly** `http://127.0.0.1:8888/callback` as its redirect URI; if the app is in development mode, ensure your account is permitted to use it.
2. Store `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in the ignored `.env.local` file, using `.env.example` as a key reference. Never commit the actual credentials.
3. Run `bun run spotify:authorize` from the repository. Open the printed authorization link and approve **only** `user-read-currently-playing`. The callback runs on loopback, validates OAuth state, and writes `SPOTIFY_REFRESH_TOKEN` into `.env.local` with owner-only file permissions. It does not print the token or send it to the browser.
4. Restart `bun run dev` (or `bun run preview`) and play a song. Both local servers mount the same API handler used by Vercel.
5. Set those three server-only variables in the Vercel project's environment settings for the desired environments, then redeploy. Deploy the repository through Vercel: uploading only `dist/` does **not** deploy the function.

Spotify authorization is required once per refresh-token lifetime. [Spotify currently documents a six-month lifetime](https://developer.spotify.com/documentation/web-api/tutorials/refreshing-tokens); rerun the command and update the Vercel token when it expires or is revoked. Revoking access in Spotify or removing the environment variables disables the integration. The current song becomes public to all portfolio visitors.

The endpoint returns `{ track: null }` for inactive/unsupported playback, `503` for missing configuration or upstream failure, and `429` with `Retry-After` when Spotify limits requests. The browser hides the block for all unavailable states. No fake track is shipped or prerendered.


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
- Vercel Web Analytics is mounted once in `src/app/site-layout.tsx` using `@vercel/analytics/react`, covering all client routes. Enable **Web Analytics** in the Vercel project dashboard and redeploy to activate the hosted `/_vercel/insights/*` endpoints. Local preview verifies script injection, not production data collection.

The homepage and `/projects` show [Mole](https://mole.luqueee.dev/), [Kivgraph](https://kivgraph.dev/), and [Qwen on A10](https://github.com/Luqueee/qwen38-a10-llamampere) in a minimal single-column editorial list, without technology labels beside the titles. Each padded card links to its story through the title's stretched link; resource links remain independently clickable above that overlay. Project kinds remain on their article pages. Experience links are separate from project entries.

The site uses a charcoal dark theme throughout, without a theme switcher. The homepage starts directly with its introduction heading; the footer contains only the copyright.

Page navigation, first-load content, project hover states, and sections entering the viewport use subtle transitions. CSS-only microinteractions add sliding underlines to project actions, 1 px directional arrow movement on link hover and keyboard focus, a small press response on links, and a subtle brand tilt. These additions run only when `prefers-reduced-motion: no-preference`; reduced-motion preferences disable the animation.

The dotted background moves at 8% of scroll speed through `useBackgroundParallax`. A passive scroll listener schedules at most one animation-frame update, writes a CSS transform offset without React renders, and wraps within the repeated 17 px pattern to keep the fixed layer small. Reduced-motion preferences disable the effect, including when changed while the page is open; listeners and frames are cleaned up on unmount.

Technology logos are served from [SVGL](https://svgl.app/), using dark-background variants where available.
