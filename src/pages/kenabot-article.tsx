import { ArrowRight, ArrowUpRight } from 'lucide-react'
import ReactMarkdown, { type Components } from 'react-markdown'
import { Link } from 'react-router'
import { ExternalLink } from '../components/external-link'
import { BackLink, Eyebrow, Lead, PageContent, PageHeading } from '../components/page'
import kenabotArticle from '../../content/experience/kenabot.md?raw'
import { KenabotArticleDiagram, type KenabotDiagramKind } from '../components/kenabot-article-diagram'
import { articleClasses, linkRowClasses } from './project-article'

const markdownComponents = {
  a: ({ href, children }) => <ExternalLink href={href}>{children}</ExternalLink>,
  p: ({ children }) => {
    if (typeof children === 'string') {
      const match = /^\[kenabot-diagram:(architecture|dashboard|alerts|custom-bots)\]$/.exec(children)
      if (match) return <KenabotArticleDiagram kind={match[1] as KenabotDiagramKind} />
    }
    return <p>{children}</p>
  },
} satisfies Components

export function KenabotArticle() {
  return (
    <PageContent className="mt-[64px] max-[641px]:mt-[71px]">
      <Link
        to="/"
        className="group mb-[45px] inline-flex items-center gap-[8px] text-[12px] font-semibold text-muted hover:text-accent"
        viewTransition
      >
        <ArrowRight
          size={14}
          className="rotate-180 motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover:-translate-x-px motion-safe:group-focus-visible:-translate-x-px"
        />
        Home
      </Link>
      <Eyebrow>Experience</Eyebrow>
      <PageHeading>Kenabot</PageHeading>
      <Lead className="mb-[20px]">A multipurpose Discord bot in 300k+ servers, built by a team for over four years. I joined it two years ago and work across its frontend, backend and infrastructure.</Lead>
      <div className={linkRowClasses}>
        <ExternalLink href="https://kena.bot">Website <ArrowUpRight size={14} /></ExternalLink>
      </div>
      <article className={articleClasses}>
        <ReactMarkdown components={markdownComponents}>{kenabotArticle}</ReactMarkdown>
      </article>
      <BackLink to="/" className="mt-[26px] mb-[110px]">Back to home</BackLink>
    </PageContent>
  )
}
