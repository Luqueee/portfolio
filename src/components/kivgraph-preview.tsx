import { Link } from 'react-router'
import { ExternalLink } from './external-link'

export function KivgraphPreview() {
  return (
    <figure className="mt-[24px] mb-0 overflow-hidden rounded-[10px] border border-line bg-background">
      <Link to="/projects/kivgraph" viewTransition aria-label="Read the Kivgraph project story" className="relative z-[2] block">
        <img
          src="/kivgraph-viewer.webp"
          alt="Kivgraph's 3D graph viewer showing repositories, packages, files, and symbols connected by dependency edges."
          width={1600}
          height={924}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </Link>
      <figcaption className="border-t border-line px-[16px] py-[12px] text-[12px] leading-[1.7] text-muted">
        Explore the relationships across a codebase. The read-only 3D graph viewer, opened with <code className="text-foreground">kivgraph ui</code>.
        <span className="mt-[6px] flex flex-wrap gap-x-[18px] gap-y-[6px]">
          <ExternalLink href="/kivgraph-viewer.webp" className="relative z-[2] text-accent underline underline-offset-4">View full size ↗</ExternalLink>
          <ExternalLink href="https://github.com/Luqueee/kivgraph/blob/main/docs/assets/kivgraph-ui-demo.mp4" className="relative z-[2] text-accent underline underline-offset-4">Watch demo ↗</ExternalLink>
        </span>
      </figcaption>
    </figure>
  )
}
