import { useId } from 'react'
import { KivgraphEngineDiagram, KivgraphIdentityDiagram, KivgraphIndexDiagram, KivgraphQueryDiagram, KivgraphViewerDiagram } from './kivgraph-article-diagrams'
import { KivgraphPublicationDiagram } from './kivgraph-publication-diagram'
import { kivgraphDiagramSources, kivgraphRevision, type KivgraphDiagramKind } from '../data/kivgraph-diagram-sources'
import { ExternalLink } from './external-link'

const captions: Record<KivgraphDiagramKind, string> = {
  indexing: 'The write path · a full corpus rebuild, with reusable analysis facts.',
  engines: 'The semantic boundary · each engine supplies evidence, not just matching names.',
  identity: 'Cross-repository resolution · a provider identity is not yet a proven symbol edge.',
  publication: 'The publication boundary · building a candidate does not replace the graph readers use.',
  queries: 'The read path · indexed relationships and current source bodies are different data.',
  viewer: 'The visual surface · independent read-only HTTP, not an MCP frontend.',
}

export function KivgraphArticleDiagram({ kind }: { kind: KivgraphDiagramKind }) {
  const id = useId()
  return <figure data-kivgraph-diagram={kind} aria-labelledby={id} className="my-[32px] border-y border-line py-[26px] max-[641px]:my-[26px] max-[641px]:py-[20px]">
    {kind === 'indexing' ? <KivgraphIndexDiagram /> : kind === 'engines' ? <KivgraphEngineDiagram /> : kind === 'identity' ? <KivgraphIdentityDiagram /> : kind === 'publication' ? <KivgraphPublicationDiagram /> : kind === 'queries' ? <KivgraphQueryDiagram /> : <KivgraphViewerDiagram />}
    <figcaption id={id} className="mt-[18px] text-[11px] leading-[1.8] text-muted">{captions[kind]}</figcaption>
    <details className="mt-[10px] text-[10px] leading-[1.8] text-muted"><summary className="w-fit cursor-pointer hover:text-heading">Implementation on main</summary><div className="mt-[10px] flex flex-wrap gap-x-[18px] gap-y-[7px]">{kivgraphDiagramSources[kind].map(source => <ExternalLink key={`${source.path}:${source.line}`} href={`https://github.com/Luqueee/kivgraph/blob/${kivgraphRevision}/${source.path}#L${source.line}-L${source.endLine}`}>{source.label} ↗</ExternalLink>)}</div></details>
  </figure>
}
