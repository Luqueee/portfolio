import { Link } from 'react-router'
import { ExternalLink } from './external-link'

export function MolePreview() {
  return (
    <figure className="mt-[24px] mb-0 overflow-hidden rounded-[10px] border border-line bg-background">
      <Link to="/projects/mole" viewTransition aria-label="Read the Mole project story" className="relative z-[2] block">
      <img
        src="/images/mole/logs.webp"
        alt="Mole daemon logs showing forwarded ports, automatic discovery of port 9090, SSH reconnection, and removal of an unavailable port."
        width={1600}
        height={586}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
      </Link>
      <figcaption className="border-t border-line px-[16px] py-[12px] text-[12px] leading-[1.7] text-muted">One SSH connection. Ports discovered, forwarded, and cleaned up automatically. Output from <code className="text-foreground">mole logs</code>. <ExternalLink href="/images/mole/logs.webp" className="relative z-[2] text-accent underline underline-offset-4">View full size ↗</ExternalLink></figcaption>
    </figure>
  )
}
