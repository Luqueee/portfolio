import { ArrowRight, ArrowUpRight } from 'lucide-react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Link } from 'react-router'
import { ExternalLink } from '../components/external-link'
import { BackLink, Eyebrow, Lead, PageContent, PageHeading } from '../components/page'
import { MoleArticleDiagram } from '../components/mole-article-diagram'
import { KivgraphArticleDiagram } from '../components/kivgraph-article-diagram'
import { articles } from '../data/articles'
import type { Project } from '../data/projects'
import type { MoleDiagramKind } from '../data/mole-diagram-sources'
import type { KivgraphDiagramKind } from '../data/kivgraph-diagram-sources'

const markdownComponents = {
  a: ({ href, children }) => <ExternalLink href={href}>{children}</ExternalLink>,
  p: ({ children }) => {
    if (typeof children === 'string') {
      const match = /^\[mole-diagram:(traffic|process|discovery|recovery|operations|clipboard|delivery)\]$/.exec(children)
      if (match) return <MoleArticleDiagram kind={match[1] as MoleDiagramKind} />
      const kivgraph = /^\[kivgraph-diagram:(indexing|engines|publication|queries|identity|viewer)\]$/.exec(children)
      if (kivgraph) return <KivgraphArticleDiagram kind={kivgraph[1] as KivgraphDiagramKind} />
    }
    return <p>{children}</p>
  },
} satisfies Components

export function ProjectArticle({ project }: { project: Project }) {
  return (
    <PageContent className="mt-[64px] max-[641px]:mt-[71px]">
      <Link
        to="/projects"
        className="group mb-[45px] inline-flex items-center gap-[8px] text-[12px] font-semibold text-muted hover:text-accent"
        viewTransition
      >
        <ArrowRight
          size={14}
          className="rotate-180 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover:-translate-x-px motion-safe:group-focus-visible:-translate-x-px"
        />
        All projects
      </Link>
      <Eyebrow>{project.kind}</Eyebrow>
      <PageHeading>{project.name}</PageHeading>
      <Lead className="mb-[20px]">{project.description}</Lead>
      <div
        className="mb-[48px] flex gap-[22px] text-[12px] font-bold
          [&_a]:relative [&_a]:inline-flex [&_a]:items-center [&_a]:gap-[5px] [&_a]:text-heading [&_a:hover]:text-accent [&_svg]:text-accent
          motion-safe:[&_a]:[transition:color_.2s_ease,transform_.25s_cubic-bezier(.22,1,.36,1),scale_.12s_ease] motion-safe:[&_a:active]:scale-[.97]
          motion-safe:[&_a]:after:absolute motion-safe:[&_a]:after:inset-x-0 motion-safe:[&_a]:after:bottom-[-4px] motion-safe:[&_a]:after:h-px motion-safe:[&_a]:after:bg-current motion-safe:[&_a]:after:content-['']
          motion-safe:[&_a]:after:origin-right motion-safe:[&_a]:after:scale-x-0 motion-safe:[&_a]:after:transition-transform motion-safe:[&_a]:after:duration-250 motion-safe:[&_a]:after:ease-editorial
          motion-safe:[&_a:is(:hover,:focus-visible)]:after:origin-left motion-safe:[&_a:is(:hover,:focus-visible)]:after:scale-x-100
          motion-safe:[&_svg]:transition-transform motion-safe:[&_svg]:duration-300 motion-safe:[&_svg]:ease-[ease]
          motion-safe:[&_a:is(:hover,:focus-visible)_svg]:translate-x-px motion-safe:[&_a:is(:hover,:focus-visible)_svg]:-translate-y-px"
      >
        <ExternalLink href={project.website}>
          {'websiteLabel' in project ? project.websiteLabel : 'Website'} <ArrowUpRight size={14} />
        </ExternalLink>
        <ExternalLink href={project.repository}>GitHub <ArrowUpRight size={14} /></ExternalLink>
      </div>
      <article
        className="border-t border-line pt-[2px] text-[15px] leading-[1.9]
          [&_h2]:mt-[42px] [&_h2]:mb-[14px] [&_h2]:font-heading [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:leading-[1.45] [&_h2]:tracking-[-.04em] [&_h2]:text-heading
          [&>p]:m-0 [&>p]:mb-[20px] [&>p]:text-foreground [&_strong]:font-bold [&_strong]:text-heading [&_em]:italic [&_em]:text-heading
          [&_a]:text-heading [&_a]:underline [&_a]:decoration-accent [&_a]:underline-offset-[4px] [&_a:hover]:text-accent
          [&_code]:rounded-[4px] [&_code]:bg-soft [&_code]:px-[5px] [&_code]:py-[2px] [&_code]:font-[family-name:monospace] [&_code]:text-[.9em] [&_code]:text-heading
          [&_pre]:mt-[12px] [&_pre]:mb-[24px] [&_pre]:overflow-x-auto [&_pre]:rounded-[6px] [&_pre]:border [&_pre]:border-line [&_pre]:bg-[#242a26] [&_pre]:px-[22px] [&_pre]:py-[18px] [&_pre]:font-[family-name:monospace] [&_pre]:leading-[1.7]
          [&_pre_code]:bg-transparent [&_pre_code]:p-0"
      >
        <ReactMarkdown components={markdownComponents}>{articles[project.slug]}</ReactMarkdown>
      </article>
      <BackLink to="/projects" className="mt-[26px] mb-[110px]">Back to all projects</BackLink>
    </PageContent>
  )
}
