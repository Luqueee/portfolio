import { useState } from 'react'
import { DiagramCanvas, DiagramNode, DiagramWire } from './diagram-primitives'

export function KivgraphPublicationDiagram() {
  const [generation, setGeneration] = useState(1)
  const [phase, setPhase] = useState<'ready' | 'building' | 'published' | 'failed'>('ready')
  const building = phase === 'building'
  const next = generation + 1
  const status = building
    ? `Preparing generation ${next}. Readers still use generation ${generation}.`
    : phase === 'failed'
      ? `Publication failed in this example. Readers still use generation ${generation}.`
      : phase === 'published'
        ? `Generation ${generation} is now published. New reads use the replacement snapshot.`
        : 'Generation 1 is published. Prepare another generation to see the separation.'
  const button = 'cursor-pointer rounded-sm border border-line px-3 py-1.5 text-xs text-muted hover:border-accent hover:text-heading disabled:cursor-not-allowed disabled:opacity-35'
  return <div>
    <p className="mb-3 text-xs text-muted">Illustrative publication · no real indexing or database</p>
    <DiagramCanvas title="A candidate generation is separate from the graph readers use" description={status} desktopHeight={380} mobileHeight={625}>{({ mobile, arrowId }) => <>
      <g fill={`url(#${arrowId}-surface)`} stroke="var(--color-accent)" strokeOpacity=".12">
        <rect x={mobile ? 20 : 25} y={mobile ? 35 : 45} width={mobile ? 320 : 380} height={mobile ? 230 : 265} rx="20" />
        <rect x={mobile ? 20 : 495} y={mobile ? 330 : 45} width={mobile ? 320 : 380} height={mobile ? 245 : 265} rx="20" />
      </g>
      <g textAnchor="middle" fill="var(--color-muted)" fontSize="11.5" letterSpacing="1.1">
        <text x={mobile ? 180 : 215} y={mobile ? 19 : 25}>PREPARING A REPLACEMENT</text>
        <text x={mobile ? 180 : 685} y={mobile ? 312 : 25}>SERVING READERS</text>
      </g>
      <DiagramNode x={mobile ? 85 : 115} y={mobile ? 100 : 125} icon="storage" label="Canonical graph" detail="LadybugDB" />
      <DiagramWire d={mobile ? 'M 129 100 H 231' : 'M 165 125 H 265'} arrowId={arrowId} label="build" x={mobile ? 180 : 215} y={mobile ? 84 : 109} active={building} />
      <DiagramNode x={mobile ? 275 : 315} y={mobile ? 100 : 125} icon="snapshot" label="Candidate" detail={building ? [`generation ${next}`, 'not visible to readers'] : phase === 'failed' ? ['not published', 'previous graph retained'] : ['next immutable snapshot', 'prepared by indexing']} muted={!building} />
      <DiagramWire d={mobile ? 'M 275 200 C 330 200 330 260 330 290 V 330 C 330 370 85 336 85 376' : 'M 359 125 C 430 105 475 145 541 125'} arrowId={arrowId} label={building ? 'only after success' : 'publish replacement'} x={mobile ? 179 : 450} y={mobile ? 285 : 84} dashed={!building} />
      <DiagramNode x={mobile ? 85 : 585} y={mobile ? 410 : 125} icon="snapshot" label="Published snapshot" detail={[`generation ${generation}`, 'immutable read model']} />
      <DiagramWire d={mobile ? 'M 231 410 H 129' : 'M 735 125 H 635'} arrowId={arrowId} label="query" x={mobile ? 180 : 685} y={mobile ? 394 : 109} />
      <DiagramNode x={mobile ? 275 : 785} y={mobile ? 410 : 125} icon="agent" label="Readers" detail={['MCP queries', 'published graph only']} />
      <text x={mobile ? 180 : 685} y={mobile ? 546 : 280} textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">{building || phase === 'failed' ? `Generation ${generation} keeps serving.` : 'No per-query database traversal.'}</text>
    </>}</DiagramCanvas>
    <div role="group" aria-label="Illustrative snapshot publication" className="flex flex-wrap gap-2 border-t border-line pt-4">
      <button type="button" className={button} disabled={building} onClick={() => setPhase('building')}>Prepare next generation</button>
      <button type="button" className={button} disabled={!building} onClick={() => { setGeneration(next); setPhase('published') }}>Publish replacement</button>
      <button type="button" className={button} disabled={!building} onClick={() => setPhase('failed')}>Simulate failure</button>
      <button type="button" className={button} onClick={() => { setGeneration(1); setPhase('ready') }}>Reset</button>
    </div>
    <p role="status" aria-live="polite" className="mt-3 mb-0 text-xs leading-relaxed text-muted">{status}</p>
  </div>
}
