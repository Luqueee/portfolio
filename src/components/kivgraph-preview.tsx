import { Link } from 'react-router'
import { ExternalLink } from './external-link'

export function KivgraphPreview() {
  return (
    <figure className="mt-[24px] mb-0 overflow-hidden rounded-[10px] border border-line bg-background">
      <Link to="/projects/kivgraph" viewTransition aria-label="Read the Kivgraph project story" className="relative z-[2] block">
        <img
          src="/images/kivgraph/website.webp"
          alt="The kivgraph.dev homepage: the headline “Know what breaks before your coding agent changes it.”, a short description, “try find_by_intent” and “install Kivgraph” buttons, and a macOS install command."
          width={1600}
          height={896}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </Link>
      <figcaption className="border-t border-line px-[16px] py-[12px] text-[12px] leading-[1.7] text-muted">
        The Kivgraph website at <code className="text-foreground">kivgraph.dev</code>: install guide, documentation and benchmarks.
        <span className="mt-[6px] flex flex-wrap gap-x-[18px] gap-y-[6px]">
          <ExternalLink href="/images/kivgraph/website.webp" className="relative z-[2] text-accent underline underline-offset-4">View full size ↗</ExternalLink>
          <ExternalLink href="https://github.com/Luqueee/kivgraph/blob/main/docs/assets/kivgraph-ui-demo.mp4" className="relative z-[2] text-accent underline underline-offset-4">Watch viewer demo ↗</ExternalLink>
        </span>
      </figcaption>
    </figure>
  )
}
