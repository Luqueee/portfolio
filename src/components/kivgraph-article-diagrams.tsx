import { useState } from 'react'
import { DiagramCanvas, DiagramNode, DiagramWire } from './diagram-primitives'

export function KivgraphIndexDiagram() {
  return <DiagramCanvas title="Source repositories become a canonical semantic graph" description="Registered source repositories are analyzed by language-aware engines. Normalized symbols and relationships are written to canonical LadybugDB storage. Queries use a separately published immutable snapshot." desktopHeight={250} mobileHeight={485}>{({ mobile, arrowId }) => mobile ? <>
    <DiagramNode x={75} y={55} icon="config" label="Repositories" detail="registered source roots" />
    <DiagramWire d="M 119 55 H 241" arrowId={arrowId} label="source files" x={180} y={39} />
    <DiagramNode x={285} y={55} icon="code" label="Language engines" detail="resolve code relationships" />
    <DiagramWire d="M 285 133 C 285 194 75 158 75 219" arrowId={arrowId} label="normalize" x={180} y={157} />
    <DiagramNode x={75} y={250} icon="graph" label="Semantic facts" detail={['symbols, edges', 'identity + provenance']} />
    <DiagramWire d="M 119 250 H 241" arrowId={arrowId} label="persist" x={180} y={234} />
    <DiagramNode x={285} y={250} icon="storage" label="LadybugDB" detail={['canonical graph', 'not the query path']} />
    <text x="180" y="440" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">Code relationships, not inferred network traffic.</text>
  </> : <>
    <DiagramNode x={90} y={85} icon="config" label="Repositories" detail="registered source roots" />
    <DiagramWire d="M 140 85 H 270" arrowId={arrowId} label="source files" x={205} y={69} />
    <DiagramNode x={320} y={85} icon="code" label="Language engines" detail="resolve code relationships" />
    <DiagramWire d="M 370 85 H 500" arrowId={arrowId} label="normalize" x={435} y={69} />
    <DiagramNode x={550} y={85} icon="graph" label="Semantic facts" detail={['symbols, edges', 'identity + provenance']} />
    <DiagramWire d="M 600 85 H 740" arrowId={arrowId} label="persist" x={670} y={69} />
    <DiagramNode x={790} y={85} icon="storage" label="LadybugDB" detail={['canonical graph', 'not the query path']} />
    <text x="450" y="225" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">Code relationships, not inferred network traffic.</text>
  </>}</DiagramCanvas>
}

const languageEngines = [
  { name: 'Go', engine: 'go/types', detail: 'Compiler type information', note: 'Go resolves declarations and relationships using compiler type information, not matching names.' },
  { name: 'TypeScript', engine: 'TypeScript checker', detail: 'Bundled Node.js worker', note: 'The TypeScript worker uses the checker to resolve symbols and relationships across the project.' },
  { name: 'Rust', engine: 'rust-analyzer', detail: 'Semantic language server', note: 'Rust analysis uses rust-analyzer; the release bundle includes the analyzer, and indexing also needs Cargo.' },
  { name: 'Python', engine: 'AST / Pyright', detail: 'Fallback or exact mode', note: 'The bundled AST fallback marks inferred references CANDIDATE. Exact Python mode needs an installed Pyright or BasedPyright server.' },
  { name: 'Dart', engine: 'Dart Analysis Server', detail: 'Installed Dart / Flutter SDK', note: 'Dart uses the Analysis Server supplied by the installed Dart or Flutter SDK.' },
]

export function KivgraphEngineDiagram() {
  const [selected, setSelected] = useState(0)
  const language = languageEngines[selected]
  return <div>
    <div role="group" aria-label="Language engine" className="mb-5 flex flex-wrap justify-center gap-2">{languageEngines.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => setSelected(index)} className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${selected === index ? 'border-accent/40 bg-soft text-heading' : 'border-line text-muted hover:text-heading'}`}>{item.name}</button>)}</div>
    <DiagramCanvas title={`${language.name} analysis adapter`} description={language.note} desktopHeight={225} mobileHeight={400}>{({ mobile, arrowId }) => <>
      <DiagramNode x={mobile ? 75 : 120} y={65} icon="file" label={`${language.name} source`} detail="registered repository" />
      <DiagramWire d={mobile ? 'M 119 65 H 241' : 'M 180 65 H 370'} arrowId={arrowId} label="analyze" x={mobile ? 180 : 275} y={49} />
      <DiagramNode x={mobile ? 285 : 450} y={65} icon="code" label={language.engine} detail={language.detail} />
      <DiagramWire d={mobile ? 'M 285 143 C 285 199 180 168 180 224' : 'M 530 65 H 720'} arrowId={arrowId} label="normalize facts" x={mobile ? 170 : 625} y={mobile ? 169 : 49} />
      <DiagramNode x={mobile ? 180 : 790} y={mobile ? 255 : 65} icon="graph" label="Canonical model" detail={['language-independent facts', 'confidence stays explicit']} />
    </>}</DiagramCanvas>
    <p aria-live="polite" className="m-0 text-center text-xs leading-relaxed text-muted">{language.note}</p>
  </div>
}

export function KivgraphQueryDiagram() {
  const [source, setSource] = useState(false)
  return <div>
    <div role="group" aria-label="Query data path" className="mb-5 flex justify-center gap-2">{[false, true].map(value => <button key={String(value)} type="button" aria-pressed={source === value} onClick={() => setSource(value)} className={`cursor-pointer rounded-full border px-3 py-1 text-xs ${source === value ? 'border-accent/40 bg-soft text-heading' : 'border-line text-muted hover:text-heading'}`}>{value ? 'get_source' : 'Graph relationships'}</button>)}</div>
    <DiagramCanvas title={source ? 'Source retrieval resolves symbols, then reads current files' : 'MCP relationship queries traverse the published snapshot'} description={source ? 'get_source resolves indexed symbols, reads repository files and compares their current digest with indexed content. Stale reanchoring is heuristic, not a fresh semantic index.' : 'Client-facing STDIO reaches a local server or a shared daemon through a relay. Relationship tools query immutable snapshot adjacency and return located rows with confidence and completeness.'} desktopHeight={410} mobileHeight={source ? 690 : 540}>{({ mobile, arrowId }) => <>
      <DiagramNode x={mobile ? 75 : 100} y={65} icon="agent" label="Coding agent" detail="MCP client" />
      <DiagramWire d={mobile ? 'M 119 65 H 241' : 'M 150 65 H 300'} arrowId={arrowId} label="STDIO" x={mobile ? 180 : 225} y={49} />
      <DiagramNode x={mobile ? 285 : 350} y={65} icon="kivgraph" label="Kivgraph" detail={['local serve or relay', 'to shared daemon']} />
      <DiagramWire d={mobile ? 'M 285 162 V 225' : 'M 400 65 H 710'} arrowId={arrowId} label="resolve + query" x={mobile ? 215 : 555} y={mobile ? 204 : 49} />
      <DiagramNode x={mobile ? 285 : 790} y={mobile ? 255 : 65} icon="snapshot" label="Published snapshot" detail={['symbol identities', 'indexed relationships']} />
      {source ? <>
        <DiagramWire d={mobile ? 'M 285 352 C 285 400 75 374 75 423' : 'M 790 162 V 265'} arrowId={arrowId} label="get_source" x={mobile ? 170 : 720} y={mobile ? 377 : 215} />
        <DiagramNode x={mobile ? 75 : 790} y={mobile ? 455 : 300} icon="file" label="Current files" detail={['read bytes + compare hash', 'stale bodies are explicit']} />
        <DiagramWire d={mobile ? 'M 119 455 H 241' : 'M 735 300 H 415'} arrowId={arrowId} label="source text" x={mobile ? 180 : 575} y={mobile ? 439 : 284} />
      </> : <DiagramWire d={mobile ? 'M 285 352 C 285 400 75 374 75 423' : 'M 790 162 C 790 250 350 181 350 269'} arrowId={arrowId} label="located rows" x={mobile ? 170 : 550} y={mobile ? 377 : 197} />}
      <DiagramNode x={mobile ? source ? 285 : 75 : 350} y={mobile ? 455 : 300} icon={source ? 'code' : 'graph'} label={source ? 'Source response' : 'Graph response'} detail={source ? ['current declaration body', 'freshness / trim notices'] : ['repository, path, range', 'confidence + completeness']} />
    </>}</DiagramCanvas>
  </div>
}

export function KivgraphIdentityDiagram() {
  return <DiagramCanvas title="A cross-repository edge requires a proven owner and indexed target" description="A consumer occurrence is resolved using its language engine and provider identity. A target must belong to the registered provider and exist in the merged corpus. Missing or ambiguous proof yields an unresolved record, not a guessed edge." desktopHeight={410} mobileHeight={715}>{({ mobile, arrowId }) => <>
    <DiagramNode x={mobile ? 180 : 100} y={55} icon="code" label="Consumer occurrence" detail={['a use inside a declaration', 'consumer owns the evidence']} />
    <DiagramWire d={mobile ? 'M 180 152 V 216' : 'M 165 55 H 380'} arrowId={arrowId} label="language resolution" x={mobile ? 260 : 272} y={mobile ? 191 : 39} />
    <DiagramNode x={mobile ? 180 : 450} y={mobile ? 247 : 55} icon="config" label="Resolve provider" detail={['registered repository identity', 'package / module / crate mapping']} />
    <DiagramWire d={mobile ? 'M 180 344 V 408' : 'M 520 55 H 735'} arrowId={arrowId} label="verify target" x={mobile ? 245 : 628} y={mobile ? 384 : 39} />
    <DiagramNode x={mobile ? 180 : 800} y={mobile ? 439 : 55} icon="scan" label="Merged corpus" detail={['owning declaration indexed?', 'identity actually present?']} />
    <DiagramWire d={mobile ? 'M 180 536 C 180 576 75 551 75 591' : 'M 800 152 C 800 226 300 207 300 281'} arrowId={arrowId} label="proven" x={mobile ? 104 : 550} y={mobile ? 553 : 205} />
    <DiagramWire d={mobile ? 'M 180 536 C 180 576 285 551 285 591' : 'M 800 152 V 281'} arrowId={arrowId} label="otherwise" x={mobile ? 263 : 742} y={mobile ? 553 : 230} dashed />
    <DiagramNode x={mobile ? 75 : 300} y={mobile ? 622 : 312} icon="graph" label="Resolved edge" detail="explicit proof grade" />
    <DiagramNode x={mobile ? 285 : 800} y={mobile ? 622 : 312} icon="file" label="Unresolved fact" detail="reason, not a guessed target" />
  </>}</DiagramCanvas>
}

export function KivgraphViewerDiagram() {
  return <DiagramCanvas title="The graph viewer is a separate read-only HTTP surface" description="The browser uses kivgraph ui HTTP APIs, not MCP. Graph tiles and neighborhoods use a published snapshot; topology also reads published source observations and invalidation metadata. Mismatched generation pins are rejected." desktopHeight={455} mobileHeight={650}>{({ mobile, arrowId }) => <>
    <DiagramNode x={mobile ? 75 : 100} y={65} icon="browser" label="Browser" detail="read-only 3D viewer" />
    <DiagramWire d={mobile ? 'M 119 65 H 241' : 'M 150 65 H 380'} arrowId={arrowId} label="GET / HEAD" x={mobile ? 180 : 265} y={49} />
    <DiagramNode x={mobile ? 285 : 450} y={65} icon="kivgraph" label="kivgraph ui" detail={['HTTP API + web assets', 'not an MCP client']} />
    <DiagramWire d={mobile ? 'M 285 162 V 225' : 'M 520 65 H 735'} arrowId={arrowId} label="graph reads" x={mobile ? 225 : 628} y={mobile ? 205 : 49} />
    <DiagramNode x={mobile ? 285 : 800} y={mobile ? 255 : 65} icon="snapshot" label="Published snapshot" detail={['symbols + graph tiles', 'generation-pinned layout']} />
    <DiagramNode x={mobile ? 75 : 450} y={mobile ? 455 : 305} icon="file" label={['Publication metadata']} detail={['source manifest + profiles', 'invalidation / freshness']} />
    <DiagramWire d={mobile ? 'M 75 423 V 210 Q 75 190 95 190 H 235 Q 255 190 255 170 V 162' : 'M 450 272 V 162'} arrowId={arrowId} label="topology" x={mobile ? 115 : 510} y={mobile ? 330 : 230} />
    <text x={mobile ? 180 : 450} y={mobile ? 600 : 435} textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">Use an explicit loopback bind for a private local viewer.</text>
  </>}</DiagramCanvas>
}
