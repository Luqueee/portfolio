import { Link } from 'react-router'
import { ExternalLink } from './external-link'

export function MolePreview() {
  return (
    <figure className="mt-[24px] mb-0 overflow-hidden rounded-[10px] border border-line bg-background">
      <Link to="/projects/mole" viewTransition aria-label="Read the Mole project story" className="relative z-[2] block">
      <img
        src="/images/mole/website.webp"
        alt="The mole.luqueee.dev homepage: the headline “Right here.”, a description of forwarding remote ports to localhost over one SSH connection, a “mole init -up” command and a “Meet the desktop app” button."
        width={1600}
        height={896}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
      </Link>
      <figcaption className="border-t border-line px-[16px] py-[12px] text-[12px] leading-[1.7] text-muted">The Mole website at <code className="text-foreground">mole.luqueee.dev</code>: install, how it works under the hood, and the CLI and daemon. <ExternalLink href="/images/mole/website.webp" className="relative z-[2] text-accent underline underline-offset-4">View full size ↗</ExternalLink></figcaption>
    </figure>
  )
}
