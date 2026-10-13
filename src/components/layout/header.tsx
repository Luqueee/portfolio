import { Github } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { socialLinks } from '../../data/profile'
import { ExternalLink } from '../external-link'

const navigationLinkClasses = "relative transition-colors duration-180 ease-[ease] hover:text-heading aria-[current=page]:font-bold aria-[current=page]:text-heading after:absolute after:inset-x-0 after:-bottom-[6px] after:h-px after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-350 after:ease-editorial after:content-[''] hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100 motion-reduce:transition-none motion-reduce:after:transition-none"

export function Header() {
  return (
    <header className="flex min-h-[86px] w-full items-center justify-between gap-[24px] px-[clamp(25px,4vw,72px)] motion-ready:motion-safe:animate-[rise-in_.7s_var(--ease-editorial)_both] max-[641px]:min-h-[72px] max-[641px]:px-[24px]">
      <Link to="/" viewTransition aria-label="luqueee, home" className="-rotate-[4deg] pr-[5px] font-heading text-[25px] leading-none font-extrabold tracking-[-.075em] text-heading motion-safe:transition-[rotate,scale] motion-safe:duration-[250ms,150ms] motion-safe:ease-[var(--ease-editorial),ease] motion-safe:hover:-rotate-[1deg] motion-safe:focus-visible:-rotate-[1deg] motion-safe:active:scale-[.96]">luqueee<span className="text-accent">.</span></Link>
      <nav aria-label="Main navigation" className="flex items-center gap-[29px] text-[13px] font-medium text-muted max-[641px]:gap-[17px] max-[641px]:text-[12px] max-[401px]:gap-[12px]">
        <NavLink to="/" end viewTransition className={navigationLinkClasses}>Home</NavLink>
        <NavLink to="/projects" viewTransition className={navigationLinkClasses}>Projects</NavLink>
        <a href={socialLinks.email.href} className={`${navigationLinkClasses} max-[641px]:hidden`}>Contact</a>
        <span aria-hidden="true" className="ml-[2px] h-[17px] w-px bg-line max-[641px]:hidden" />
        <ExternalLink href={socialLinks.github.href} aria-label="GitHub" className="inline-flex items-center justify-center transition-colors duration-180 ease-[ease] hover:text-heading motion-reduce:transition-none max-[401px]:hidden"><Github size={18} strokeWidth={1.7} /></ExternalLink>
      </nav>
    </header>
  )
}
