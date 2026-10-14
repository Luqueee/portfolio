import { useId } from 'react'
import { MoleClipboardDiagram, MoleDeliveryDiagram, MoleDiscoveryDiagram, MoleOperationsDiagram, MoleProcessDiagram, MoleRecoveryDiagram } from './mole-article-diagrams'
import { MoleTrafficSimulation } from './mole-traffic-simulation'
import { moleDiagramSources, moleRevision, type MoleDiagramKind } from '../data/mole-diagram-sources'
import { ExternalLink } from './external-link'

const captions: Record<MoleDiagramKind, string> = {
  traffic: 'The data path · your machine → SSH → the same port on the remote.',
  process: 'The process model · one local executable owns the forwarding runtime.',
  discovery: 'The control loop · discovery changes listeners, not application payloads.',
  recovery: 'The recovery path · replace the transport, keep the listener sockets.',
  operations: 'The local control plane · HTTP status and file-based logs are separate paths.',
  clipboard: 'The optional image path · private HTTP, independent of the SSH tunnel.',
  delivery: 'The delivery path · the website and installer are not the running daemon.',
}

export function MoleArticleDiagram({ kind }: { kind: MoleDiagramKind }) {
  const id = useId()
  return <figure data-mole-diagram={kind} aria-labelledby={id} className="my-[32px] border-y border-line py-[26px] max-[641px]:my-[26px] max-[641px]:py-[20px]">
    {kind === 'traffic' ? <MoleTrafficSimulation /> : kind === 'process' ? <MoleProcessDiagram /> : kind === 'discovery' ? <MoleDiscoveryDiagram /> : kind === 'recovery' ? <MoleRecoveryDiagram /> : kind === 'operations' ? <MoleOperationsDiagram /> : kind === 'clipboard' ? <MoleClipboardDiagram /> : <MoleDeliveryDiagram />}
    <figcaption id={id} className="mt-[18px] text-[11px] leading-[1.8] text-muted">{captions[kind]}</figcaption>
    <details className="mt-[10px] text-[10px] leading-[1.8] text-muted"><summary className="w-fit cursor-pointer hover:text-heading">Implementation on main</summary><div className="mt-[10px] flex flex-wrap gap-x-[18px] gap-y-[7px]">{moleDiagramSources[kind].map(source => <ExternalLink key={`${source.path}:${source.line}`} href={`https://github.com/Luqueee/mole/blob/${moleRevision}/${source.path}#L${source.line}${source.endLine ? `-L${source.endLine}` : ''}`}>{source.label} ↗</ExternalLink>)}</div></details>
  </figure>
}
