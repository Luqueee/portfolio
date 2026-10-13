import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { projects } from '../data/projects'
import { ExternalLink } from './external-link'

const resourceLinkClasses = "group/resource relative z-[2] inline-flex items-center gap-[4px] text-[11px] font-bold whitespace-nowrap text-foreground hover:text-accent motion-safe:transition-[color,translate,scale] motion-safe:duration-[200ms,250ms,120ms] motion-safe:ease-[ease,var(--ease-editorial),ease] motion-safe:active:scale-[.97] motion-safe:after:absolute motion-safe:after:inset-x-0 motion-safe:after:-bottom-[4px] motion-safe:after:h-px motion-safe:after:origin-right motion-safe:after:scale-x-0 motion-safe:after:bg-current motion-safe:after:transition-transform motion-safe:after:duration-250 motion-safe:after:ease-editorial motion-safe:after:content-[''] motion-safe:hover:after:origin-left motion-safe:hover:after:scale-x-100 motion-safe:focus-visible:after:origin-left motion-safe:focus-visible:after:scale-x-100"
const externalArrowClasses = 'text-accent motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover/resource:translate-x-px motion-safe:group-hover/resource:-translate-y-px motion-safe:group-focus-visible/resource:translate-x-px motion-safe:group-focus-visible/resource:-translate-y-px'

export function ProjectList({ className }: { className?: string }) {
  const spacing = className ?? 'mt-[25px]'
  return (
    <div className={`project-list ${spacing}`}>
      {projects.map((project) => (
        <article className="project-row relative isolate border-b border-line px-[24px] py-[27px] transition-colors duration-300 ease-[ease] first:border-t hover:bg-accent/[.045] motion-reduce:transition-none max-[641px]:px-[16px] max-[641px]:py-[22px]" key={project.slug}>
          <div>
            <h3 className="mt-0 mb-[5px] font-heading text-[23px] font-bold tracking-[-.045em] text-heading">
              <Link to={project.path} viewTransition className="group/story inline-flex items-center gap-[6px] hover:text-accent after:absolute after:inset-0 after:z-[1] after:content-[''] focus-visible:after:outline-2 focus-visible:after:outline-accent focus-visible:after:outline-offset-4">
                {project.name}<ArrowRight size={18} className="text-accent motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover/story:translate-x-px motion-safe:group-focus-visible/story:translate-x-px" />
              </Link>
            </h3>
            <p className="m-0 text-[13px] leading-[1.6] text-muted">{project.description}</p>
            <div className="project-links mt-[16px] flex flex-wrap gap-x-[25px] gap-y-[12px]">
              <Link to={project.path} viewTransition className={resourceLinkClasses}>
                Read story <ArrowRight size={13} className="text-accent motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover/resource:translate-x-px motion-safe:group-focus-visible/resource:translate-x-px" />
              </Link>
              <ExternalLink href={project.website} className={resourceLinkClasses}>
                {'websiteLabel' in project ? project.websiteLabel : 'Website'} <ArrowUpRight size={13} className={externalArrowClasses} />
              </ExternalLink>
              <ExternalLink href={project.repository} className={resourceLinkClasses}>
                GitHub <ArrowUpRight size={13} className={externalArrowClasses} />
              </ExternalLink>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
