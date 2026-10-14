import { useState } from 'react'
import { DiagramCanvas, DiagramNode, DiagramWire } from './diagram-primitives'

export function MoleProcessDiagram() {
  return <DiagramCanvas title="Starting one local Mole process" description="The shell launches Mole. Optional detach re-executes the same binary. The process loads configuration, establishes SSH and owns its local listeners and background loops." desktopHeight={340} mobileHeight={540}>{({ mobile, arrowId }) => mobile ? <>
    <DiagramNode x={70} y={42} label="Your shell" detail="mole up -d" icon="terminal" />
    <DiagramWire d="M 115 42 H 245" arrowId={arrowId} label="re-exec" x={180} y={31} />
    <DiagramNode x={290} y={42} label="Mole process" detail="same executable" icon="process" />
    <DiagramWire d="M 290 116 C 290 158 180 136 180 178" arrowId={arrowId} label="load, then connect" x={180} y={133} />
    <DiagramNode x={180} y={208} label="Configuration + SSH" detail={['one selected YAML + flags', 'identities, agent and known_hosts']} icon="config" />
    <DiagramWire d="M 180 300 C 180 343 65 320 65 363 M 180 300 V 363 M 180 300 C 180 343 295 320 295 363" arrowId={arrowId} />
    <DiagramNode x={65} y={393} label="Listeners" detail="TCP ports" icon="server" />
    <DiagramNode x={180} y={393} label="Discovery" detail="every 15s" icon="scan" />
    <DiagramNode x={295} y={393} label="Watchdog" detail="every 10s" icon="clock" />
    <text x="180" y="510" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">Everything above runs on your machine.</text>
  </> : <>
    <DiagramNode x={75} y={80} label="Your shell" detail="mole up -d" icon="terminal" />
    <DiagramWire d="M 115 80 H 245" arrowId={arrowId} label="re-exec" x={180} y={66} />
    <DiagramNode x={290} y={80} label="Mole process" detail="same executable" icon="process" />
    <DiagramWire d="M 335 80 H 465" arrowId={arrowId} label="load inputs" x={400} y={66} />
    <DiagramNode x={510} y={80} label="Configuration" detail="one YAML + flags" icon="config" />
    <DiagramWire d="M 555 80 H 720" arrowId={arrowId} label="verify + authenticate" x={638} y={66} />
    <DiagramNode x={770} y={80} label="SSH ready" detail="direct or ProxyJump" icon="lock" />
    <DiagramWire d="M 770 154 C 770 211 290 166 290 223 M 770 154 C 770 204 510 176 510 223 M 770 154 V 223" arrowId={arrowId} />
    <DiagramNode x={290} y={250} label="Local listeners" detail="one per forwarded port" icon="server" />
    <DiagramNode x={510} y={250} label="Port discovery" detail="optional · every 15s" icon="scan" />
    <DiagramNode x={770} y={250} label="SSH watchdog" detail="every 10s" icon="clock" />
  </>}</DiagramCanvas>
}

export function MoleDiscoveryDiagram() {
  const [fallback, setFallback] = useState(false)
  return <div>
    <div className="mb-[8px] flex justify-end"><button type="button" aria-pressed={fallback} onClick={() => setFallback(value => !value)} className="cursor-pointer border-b border-line pb-[4px] text-[11px] text-muted hover:border-accent hover:text-heading">{fallback ? 'Show listener enumeration' : 'What if ss / netstat are unavailable?'}</button></div>
    <DiagramCanvas title={fallback ? 'Fallback discovery only adds listeners' : 'Authoritative listener discovery reconciles local ports'} description={fallback ? 'A temporary SSH transport probes configured candidates. Responsive ports are added; failed probes never remove local listeners.' : 'Every 15 seconds Mole enumerates remote listeners with ss or netstat. Eligible ports are added and absent unpinned listeners are removed.'} desktopHeight={420} mobileHeight={555}>{({ mobile, arrowId }) => {
      const cx = mobile ? 180 : 450
      return <>
        <DiagramNode x={mobile ? 65 : 110} y={55} label="Discovery" detail="every 15s" icon="scan" />
        <DiagramWire d={mobile ? 'M 105 55 H 242' : 'M 155 55 H 390'} arrowId={arrowId} label="SSH" x={mobile ? 175 : 270} y={40} />
        <DiagramNode x={mobile ? 290 : 450} y={55} label={fallback ? ['Candidate', 'probes'] : ['Remote', 'listeners']} detail={fallback ? 'temporary transport' : 'ss / netstat'} icon="server" />
        <DiagramWire d={mobile ? 'M 290 151 C 290 195 180 172 180 216' : 'M 450 151 V 205'} arrowId={arrowId} label={fallback ? 'bounded to 5s' : 'eligible port numbers'} x={mobile ? 170 : 530} y={mobile ? 164 : 188} />
        <text x={cx} y={mobile ? 246 : 230} textAnchor="middle" fill="var(--color-heading)" fontSize="14" fontWeight="600">{fallback ? 'Only successful probes add ports' : 'Reconcile the local listener set'}</text>
        <DiagramWire d={mobile ? 'M 180 267 C 180 314 75 290 75 337 M 180 267 C 180 314 285 290 285 337' : 'M 450 249 C 450 285 260 263 260 299 M 450 249 C 450 285 650 263 650 299'} arrowId={arrowId} />
        <DiagramNode x={mobile ? 75 : 260} y={mobile ? 367 : 326} label="New port" detail="create listener" icon="app" />
        <DiagramNode x={mobile ? 285 : 650} y={mobile ? 367 : 326} label="Missing port" detail={fallback ? 'keep existing listener' : 'prune if not pinned'} icon="app" />
        {!mobile && <><DiagramWire d="M 510 55 H 735" arrowId={arrowId} label={fallback ? 'discover_ports' : 'loopback / wildcard binds'} x={625} y={41} dashed /><DiagramNode x={795} y={55} label="Remote services" detail=":3000 · :5173 · …" icon="app" /></>}
        {mobile && <text x="180" y="506" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">{fallback ? 'No pruning from failed probes.' : 'Excluded ports are skipped. Pins are protected.'}</text>}
      </>
    }}</DiagramCanvas>
    <p aria-live="polite" className="mt-[8px] mb-0 text-[12px] leading-[1.8] text-muted">{fallback ? 'Separate probe transport · configured candidates · add only. The persistent forwarding connection is left alone.' : 'A successful inventory is authoritative—even when empty. Explicitly configured ports stay pinned.'}</p>
  </div>
}

export function MoleRecoveryDiagram() {
  return <DiagramCanvas title="One shared reconnect owner" description="A failed dial and the ten-second watchdog enter the same serialized reconnect path. One replacement SSH client serves the existing local listeners; lost streams are not replayed." desktopHeight={320} mobileHeight={550}>{({ mobile, arrowId }) => mobile ? <>
    <DiagramNode x={80} y={45} label="Failed dial" detail="transport error" icon="terminal" />
    <DiagramNode x={280} y={45} label="Watchdog" detail="10s session check" icon="clock" />
    <DiagramWire d="M 80 121 C 80 154 180 121 180 152 M 280 121 C 280 154 180 121 180 152" arrowId={arrowId} arrow="none" />
    <DiagramWire d="M 180 152 V 181" arrowId={arrowId} />
    <DiagramNode x={180} y={210} label="Shared reconnect" detail={['one owner replaces SSH', 'waiting callers reuse the new client']} icon="merge" />
    <DiagramWire d="M 180 305 V 366" arrowId={arrowId} label="new transport" x={245} y={345} />
    <DiagramNode x={180} y={396} label="New connections work" detail={['local listeners stay bound', 'old streams are not replayed']} icon="lock" />
  </> : <>
    <DiagramNode x={100} y={45} label="Failed dial" detail="transport error" icon="terminal" />
    <DiagramNode x={100} y={215} label="Watchdog" detail="10s session check" icon="clock" />
    <DiagramWire d="M 145 45 C 225 45 195 125 225 125 M 145 215 C 225 215 195 125 225 125" arrowId={arrowId} arrow="none" />
    <DiagramWire d="M 225 125 H 415" arrowId={arrowId} />
    <DiagramNode x={450} y={125} label="Shared reconnect" detail={['one owner replaces SSH', 'waiting callers reuse the new client']} icon="merge" />
    <DiagramWire d="M 510 125 H 675" arrowId={arrowId} label="new transport" x={590} y={110} />
    <DiagramNode x={760} y={125} label="New connections work" detail={['local listeners stay bound', 'old streams are not replayed']} icon="lock" />
    <text x="450" y="295" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">A refused service port fails that request—not the SSH transport.</text>
  </>}</DiagramCanvas>
}

export function MoleOperationsDiagram() {
  return <DiagramCanvas title="Local control and observability are separate from TCP traffic" description="Status and live port commands use optional admin HTTP. The proxy updates atomic stats. Background process output goes to a log file that the logs command reads independently." desktopHeight={430} mobileHeight={660}>{({ mobile, arrowId }) => mobile ? <>
    <DiagramNode x={75} y={40} label="status / ports" detail="CLI commands" icon="terminal" />
    <DiagramWire d="M 119 40 H 240" arrowId={arrowId} label="local HTTP" x={180} y={25} />
    <DiagramNode x={290} y={40} label="Admin API" detail="optional · :9999" icon="server" />
    <DiagramWire d="M 290 117 C 290 171 75 131 75 185" arrowId={arrowId} label="read / control" x={181} y={137} />
    <DiagramNode x={75} y={215} label="Listeners" detail="live port set" icon="app" />
    <DiagramNode x={290} y={215} label="Atomic stats" detail="connection hooks" icon="clock" />
    <DiagramWire d="M 290 185 V 117" arrowId={arrowId} arrow="none" />
    <path d="M 20 338 H 340" stroke="var(--color-line)" strokeDasharray="3 5" />
    <DiagramNode x={75} y={400} label="Mole process" detail="stderr → log file" icon="process" />
    <DiagramWire d="M 119 400 H 240" arrowId={arrowId} label="background mode" x={180} y={385} />
    <DiagramNode x={290} y={400} label="mole.log" detail="text / logfmt" icon="file" />
    <DiagramWire d="M 290 477 C 290 524 180 498 180 545" arrowId={arrowId} label="read / follow" x={181} y={499} />
    <DiagramNode x={180} y={575} label="mole logs -f" detail="formatted terminal output" icon="terminal" />
  </> : <>
    <DiagramNode x={100} y={50} label="status / ports" detail="CLI commands" icon="terminal" />
    <DiagramWire d="M 147 50 H 375" arrowId={arrowId} label="local HTTP" x={265} y={35} />
    <DiagramNode x={450} y={50} label="Admin API" detail="optional · localhost:9999" icon="server" />
    <DiagramWire d="M 450 127 C 450 177 275 145 275 195 M 450 127 C 450 177 700 145 700 195" arrowId={arrowId} label="read / control" x={565} y={135} />
    <DiagramNode x={275} y={225} label="Local listeners" detail="current port set" icon="app" />
    <DiagramNode x={700} y={225} label="Atomic stats" detail="proxy connection hooks" icon="clock" />
    <DiagramNode x={90} y={375} label="mole logs -f" icon="terminal" />
    <DiagramWire d="M 140 375 H 375" arrowId={arrowId} label="read / follow" x={260} y={358} />
    <DiagramNode x={450} y={375} label="mole.log" icon="file" />
    <DiagramWire d="M 760 375 H 520" arrowId={arrowId} label="stderr in background mode" x={640} y={358} />
    <DiagramNode x={810} y={375} label="Mole process" icon="process" />
  </>}</DiagramCanvas>
}

export function MoleClipboardDiagram() {
  return <DiagramCanvas title="Clipboard images use a separate private HTTP path" description="The macOS watcher uploads PNGs to its local clipboard server. A command on another machine initiates a private-network GET and writes its own downloaded PNG. This does not use the SSH forwarding transport." desktopHeight={310} mobileHeight={620}>{({ mobile, arrowId }) => mobile ? <>
    <text x="180" y="19" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.3">SERVING MACHINE</text>
    <DiagramNode x={75} y={65} label="Pasteboard" detail="macOS watcher" icon="clipboard" />
    <DiagramWire d="M 117 65 H 240" arrowId={arrowId} label="PUT /clip" x={180} y={49} />
    <DiagramNode x={290} y={65} label="clip serve" detail="latest PNG cache" icon="server" />
    <path d="M 20 208 H 340" stroke="var(--color-line)" strokeDasharray="3 5" />
    <text x="180" y="245" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.3">PULLING MACHINE</text>
    <DiagramNode x={75} y={300} label="clip pull" detail="one-shot request" icon="terminal" />
    <DiagramWire d="M 75 277 V 210 Q 75 190 95 190 H 270 Q 290 190 290 170 V 148" arrowId={arrowId} label="private HTTP GET" x={180} y={178} dashed />
    <DiagramWire d="M 290 148 V 350 Q 290 370 270 370 H 95 Q 75 370 75 390 V 397" arrowId={arrowId} label="PNG response" x={242} y={359} />
    <DiagramNode x={75} y={430} label="Downloaded PNG" detail="timestamped temp file" icon="file" />
    <text x="180" y="569" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">Separate from the tunnel. No endpoint auth.</text>
  </> : <>
    <path d="M 470 20 V 280" stroke="var(--color-line)" strokeDasharray="3 5" />
    <text x="220" y="32" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.3">SERVING MACHINE</text>
    <text x="685" y="32" textAnchor="middle" fill="var(--color-muted)" fontSize="10" letterSpacing="1.3">PULLING MACHINE</text>
    <DiagramNode x={85} y={115} label="Pasteboard" detail="macOS watcher" icon="clipboard" />
    <DiagramWire d="M 128 115 H 285" arrowId={arrowId} label="PUT /clip" x={205} y={99} />
    <DiagramNode x={340} y={115} label="clip serve" detail="latest PNG cache" icon="server" />
    <DiagramNode x={610} y={115} label="clip pull" detail="one-shot request" icon="terminal" />
    <DiagramWire d="M 560 100 H 392" arrowId={arrowId} label="private HTTP GET" x={476} y={82} dashed />
    <DiagramWire d="M 392 135 H 560" arrowId={arrowId} label="PNG response" x={476} y={157} />
    <DiagramWire d="M 660 115 H 755" arrowId={arrowId} />
    <DiagramNode x={810} y={115} label="PNG file" detail="local temp path" icon="file" />
    <text x="450" y="270" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">Private-network HTTP, not SSH. No endpoint authentication.</text>
  </>}</DiagramCanvas>
}

export function MoleDeliveryDiagram() {
  return <DiagramCanvas title="The website and installers are independent of the running tunnel" description="The Astro website supplies install instructions. Platform installers produce a local Go executable. The update command fetches and re-runs the installer for that executable; it does not restart the daemon." desktopHeight={285} mobileHeight={530}>{({ mobile, arrowId }) => mobile ? <>
    <DiagramNode x={70} y={50} label="Astro website" detail="install instructions" icon="browser" />
    <DiagramWire d="M 115 50 H 240" arrowId={arrowId} label="you run" x={180} y={35} />
    <DiagramNode x={290} y={50} label="Installer" detail="shell / PowerShell" icon="download" />
    <DiagramWire d="M 290 126 C 290 185 180 151 180 210" arrowId={arrowId} label="build or verify / extract" x={180} y={149} />
    <DiagramNode x={180} y={240} label="Local Go binary" detail="mole" icon="terminal" />
    <DiagramWire d="M 130 240 H 55 Q 35 240 35 260 V 385 Q 35 405 55 405 H 125" arrowId={arrowId} label="mole update" x={83} y={389} dashed />
    <DiagramNode x={180} y={405} label="Re-run installer" detail="replace current executable" icon="download" />
  </> : <>
    <DiagramNode x={95} y={70} label="Astro website" detail="install instructions" icon="browser" />
    <DiagramWire d="M 145 70 H 365" arrowId={arrowId} label="you run the install command" x={255} y={54} />
    <DiagramNode x={430} y={70} label="Platform installer" detail="build or verify / extract" icon="download" />
    <DiagramWire d="M 495 70 H 720" arrowId={arrowId} label="install executable" x={605} y={54} />
    <DiagramNode x={790} y={70} label="Local Go binary" detail="mole" icon="terminal" />
    <DiagramWire d="M 790 148 V 200 Q 790 220 770 220 H 450 Q 430 220 430 200 V 148" arrowId={arrowId} label="mole update · re-run installer for current path" x={610} y={208} dashed />
    <text x="450" y="275" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">Replacing the executable does not restart a running daemon.</text>
  </>}</DiagramCanvas>
}
