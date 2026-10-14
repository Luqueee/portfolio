import { useEffect, useReducer, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, StepForward } from 'lucide-react'
import { createSimulation, simulationControls, simulationReducer, type SimulationAction, type SimulationScenario, type SimulationState } from '../lib/mole-simulation'
import { DiagramCanvas, DiagramNode, DiagramWire } from './mole-diagram-primitives'

const scenarios: { value: SimulationScenario; label: string; description: string }[] = [
  { value: 'auto', label: 'Automatic discovery', description: 'Authoritative ss / netstat results add listeners and prune missing, unpinned ports.' },
  { value: 'manual', label: 'Explicit ports', description: '8080 and 9090 stay pinned, even when a remote service is absent. No rediscovery.' },
  { value: 'fallback', label: 'Probe fallback', description: 'Without ss or netstat, a temporary SSH sweep can add listeners, but never prune them.' },
]

function TrafficDiagram({ state, mobile, arrowId, reducedMotion }: { state: SimulationState; mobile: boolean; arrowId: string; reducedMotion: boolean }) {
  const port = state.pendingChange === 'add' ? 9090 : state.pendingChange === 'remove' ? 8080
    : state.requestPort !== null && state.forwardedPorts.some(listener => listener.port === state.requestPort) ? state.requestPort
      : state.forwardedPorts.find(listener => state.remotePorts.includes(listener.port))?.port ?? state.forwardedPorts[0]?.port ?? 8080
  const bound = state.forwardedPorts.some(listener => listener.port === port)
  const serviceAvailable = state.remotePorts.includes(port)
  const connected = state.sshStatus === 'connected'
  const request = state.phase === 'request'
  const refused = state.phase === 'service-refused'
  const restoring = state.phase === 'ssh' || state.phase === 'reconnected'
  const handshake = state.phase === 'reconnecting'
  const tunnelLabel = connected ? state.phase === 'reconnected' ? 'replacement connected' : 'connected'
    : handshake ? 'reconnecting…' : state.sshStatus === 'dropped' ? 'transport interrupted'
      : state.sshStatus === 'closed' ? 'transport closed' : 'not connected yet'
  const client = mobile ? { x: 98, y: 130 } : { x: 100, y: 160 }
  const mole = mobile ? { x: 98, y: 265 } : { x: 300, y: 160 }
  const sshd = mobile ? { x: 98, y: 505 } : { x: 600, y: 160 }
  const service = mobile ? { x: 98, y: 640 } : { x: 800, y: 160 }
  const localWire = mobile ? 'M 123 130 C 254 130 254 265 123 265' : 'M 126 160 C 175 140 225 180 274 160'
  const tunnel = mobile ? 'M 123 265 C 310 265 310 505 123 505' : 'M 326 160 C 410 188 490 132 574 160'
  const tunnelBeforeGap = mobile ? 'M 123 265 C 216 265 263 325 263 378' : 'M 326 160 C 360 172 390 170 425 164'
  const tunnelAfterGap = mobile ? 'M 263 402 C 263 455 216 505 123 505' : 'M 475 156 C 510 150 540 148 574 160'
  const serviceWire = mobile ? 'M 123 505 C 254 505 254 640 123 640' : 'M 626 160 C 675 140 725 180 774 160'
  const packetPath = mobile ? 'M 123 130 C 254 130 254 265 123 265 C 310 265 310 505 123 505 C 254 505 254 640 123 640'
    : 'M 126 160 C 175 140 225 180 274 160 L 326 160 C 410 188 490 132 574 160 L 626 160 C 675 140 725 180 774 160'
  const refusalPath = packetPath
  const gap = mobile ? { x: 263, y: 390 } : { x: 450, y: 160 }
  const listenerDetail = bound ? 'accepts local connections' : state.processStatus === 'stopped' || state.pendingChange === 'remove' ? 'local listener closed' : 'not bound yet'

  return <>
    <g fill={`url(#${arrowId}-surface)`} stroke="var(--color-accent)" strokeOpacity=".12">
      <rect x={mobile ? 24 : 20} y={mobile ? 90 : 100} width={mobile ? 252 : 360} height={mobile ? 286 : 200} rx="20" />
      <rect x={mobile ? 24 : 520} y={mobile ? 460 : 100} width={mobile ? 252 : 360} height={mobile ? 274 : 200} rx="20" />
    </g>
    <g fill="var(--color-muted)" fontSize="14" textAnchor="middle">
      <text x={mobile ? 150 : 200} y={mobile ? 72 : 76}>Your computer · local</text>
      <text x={mobile ? 150 : 700} y={mobile ? 441 : 76}>SSH host · remote</text>
    </g>

    <DiagramWire d={localWire} arrowId={arrowId} arrow="both" active={bound} label={`TCP · :${port}`} x={mobile ? 266 : 200} y={mobile ? 183 : 133} />
    <DiagramWire d={serviceWire} arrowId={arrowId} arrow={serviceAvailable ? 'both' : 'none'} active={connected && serviceAvailable} dashed={!serviceAvailable} label="same port" x={mobile ? 265 : 700} y={mobile ? 575 : 133} />
    {connected ? <DiagramWire d={tunnel} arrowId={arrowId} arrow="both" /> : <>
      <DiagramWire d={tunnelBeforeGap} arrowId={arrowId} arrow="none" active={false} dashed />
      <DiagramWire d={tunnelAfterGap} arrowId={arrowId} arrow="none" active={false} dashed />
      <g transform={`translate(${gap.x} ${gap.y})`} stroke="var(--color-muted)" strokeWidth="1.5" fill="none">
        {state.sshStatus === 'dropped' || state.sshStatus === 'closed'
          ? <path d="M -6 -6 L 6 6 M -6 6 L 6 -6" />
          : <><circle r="8" /><path d="M -3 0 H 3" /></>}
      </g>
    </>}
    <g textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">
      <text x={mobile ? 130 : 450} y={mobile ? 392 : 72}>One shared SSH transport</text>
      <text x={mobile ? 130 : 450} y={mobile ? 414 : 92}>{tunnelLabel}</text>
    </g>

    {restoring && !reducedMotion && <path key={`restore-${state.nextEventId}`} d={tunnel} fill="none" stroke="var(--color-heading)" strokeWidth="2" pathLength="1" strokeDasharray="1" strokeDashoffset="1">
      <animate begin="indefinite" attributeName="stroke-dashoffset" from="1" to="0" dur="0.8s" fill="freeze" />
      <animate begin="indefinite" attributeName="opacity" values="1;1;0" keyTimes="0;0.65;1" dur="1.1s" fill="freeze" />
    </path>}
    {handshake && !reducedMotion && <>
      <circle r="3.5" fill="var(--color-accent)">
        <animateMotion begin="indefinite" path={tunnelBeforeGap} dur="1s" fill="freeze" />
      </circle>
      <circle r="3.5" fill="var(--color-accent)">
        <animateMotion begin="indefinite" path={mobile ? 'M 123 505 C 216 505 263 455 263 402' : 'M 574 160 C 540 148 510 150 475 156'} dur="1s" fill="freeze" />
      </circle>
    </>}

    <DiagramNode {...client} icon="browser" label="Local client" detail="Browser, CLI, or other app" />
    <DiagramNode {...mole} icon="process" label={['Mole', 'TCP listener + proxy']} detail={[`127.0.0.1:${port}`, listenerDetail]} muted={state.processStatus === 'stopped'} />
    <DiagramNode {...sshd} icon="server" label="SSH server" detail="remote sshd" />
    <DiagramNode {...service} icon="app" label="TCP service" detail={[`127.0.0.1:${port}`, serviceAvailable ? 'remote service running' : 'remote service absent']} muted={!serviceAvailable} />

    {request && <g key={`packet-${state.nextEventId}`}>
      <path data-packet-path d={packetPath} fill="none" stroke="none" />
      <circle data-packet cx={reducedMotion ? service.x : client.x} cy={reducedMotion ? service.y : client.y} r="5" fill="var(--color-heading)" stroke="var(--color-background)" strokeWidth="2" />
      <text x={mobile ? 174 : 495} y={mobile ? 761 : 335} textAnchor="middle" fill="var(--color-heading)" fontSize="11.5">
        {reducedMotion ? `Bytes reach remote :${port}; response returns to the client.` : `Illustrative bytes · :${port} → remote → client`}
      </text>
    </g>}
    {refused && <g key={`refusal-${state.nextEventId}`}>
      <circle cx={reducedMotion ? service.x : 0} cy={reducedMotion ? service.y - 24 : 0} r="4" fill="var(--color-muted)">
        {!reducedMotion && <animateMotion begin="indefinite" path={refusalPath} dur="1.1s" fill="freeze" />}
      </circle>
      <text x={mobile ? 180 : 495} y={mobile ? 761 : 335} textAnchor="middle" fill="var(--color-heading)" fontSize="11.5">Channel refused · SSH stays connected</text>
    </g>}
  </>
}

export function MoleTrafficSimulation() {
  const [state, dispatch] = useReducer(simulationReducer, 'auto', createSimulation)
  const [playing, setPlaying] = useState(false)
  const [motionPaused, setMotionPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const packetClock = useRef({ event: -1, elapsed: 0 })
  const controls = simulationControls(state)
  const canRequest = state.phase === 'running' && state.sshStatus === 'connected'

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReducedMotion(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const pauseWhenHidden = () => {
      if (document.hidden) {
        setPlaying(false)
        setMotionPaused(true)
      }
    }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    return () => document.removeEventListener('visibilitychange', pauseWhenHidden)
  }, [])

  useEffect(() => {
    for (const svg of root.current?.querySelectorAll('svg[role="img"]') ?? []) {
      if (svg instanceof SVGSVGElement) {
        if (motionPaused) svg.pauseAnimations()
        else svg.unpauseAnimations()
      }
    }
  }, [motionPaused, state.phase])

  useEffect(() => {
    // Start against each SVG's existing timeline, rather than its page-load time.
    for (const animation of root.current?.querySelectorAll('svg[role="img"] animate, svg[role="img"] animateMotion') ?? []) {
      if (animation instanceof SVGAnimationElement) animation.beginElement()
    }
  }, [state.nextEventId, reducedMotion])

  useEffect(() => {
    if (state.phase !== 'request' || reducedMotion) return
    if (packetClock.current.event !== state.nextEventId) {
      packetClock.current = { event: state.nextEventId, elapsed: 0 }
    }
    if (motionPaused) return
    const tracks = Array.from(root.current?.querySelectorAll<SVGPathElement>('[data-packet-path]') ?? []).map(path => ({
      path,
      length: path.getTotalLength(),
      dot: path.parentElement?.querySelector<SVGCircleElement>('[data-packet]'),
    }))
    let previous = performance.now()
    let frame = 0
    const move = (now: number) => {
      packetClock.current.elapsed = Math.min(2600, packetClock.current.elapsed + now - previous)
      previous = now
      const progress = packetClock.current.elapsed / 2600
      const distance = progress <= 0.5 ? progress * 2 : (1 - progress) * 2
      for (const { path, length, dot } of tracks) {
        const point = path.getPointAtLength(length * distance)
        dot?.setAttribute('cx', String(point.x))
        dot?.setAttribute('cy', String(point.y))
      }
      if (progress < 1) frame = requestAnimationFrame(move)
    }
    frame = requestAnimationFrame(move)
    return () => cancelAnimationFrame(frame)
  }, [state.phase, state.nextEventId, motionPaused, reducedMotion])

  useEffect(() => {
    if (!playing) return
    if (!controls.canStep) {
      setPlaying(false)
      return
    }
    const delay = state.phase === 'request' ? 2800 : state.phase === 'reconnecting' ? 1500 : 1300
    const timer = window.setTimeout(() => {
      if (!document.hidden) dispatch({ type: 'next' })
    }, delay)
    return () => window.clearTimeout(timer)
  }, [playing, controls.canStep, state.phase, state.nextEventId])

  function act(action: SimulationAction) {
    setMotionPaused(false)
    setPlaying(action.type !== 'next' && action.type !== 'reset')
    dispatch(action)
  }

  function togglePlayback() {
    setMotionPaused(playing)
    setPlaying(!playing)
  }

  const buttonClass = 'inline-flex items-center justify-center gap-1.5 rounded-sm border border-line px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-heading disabled:cursor-not-allowed disabled:opacity-35'
  const activePorts = state.forwardedPorts.map(({ port, pinned }) => `${port}${pinned ? ' (pinned)' : ''}`).join(', ')
  const description = `Illustrative local and remote TCP traffic, not a network connection or live telemetry. ${state.title}. ${state.detail}`

  return <div ref={root}>
    <p className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
      <span>Illustrative simulation · no real network</span>
      <span>{scenarios.find(scenario => scenario.value === state.scenario)?.label}</span>
    </p>
    <DiagramCanvas title="Mole bridges local TCP to the same remote port over one shared SSH transport" description={description} desktopHeight={355} mobileHeight={782}>
      {({ mobile, arrowId }) => <TrafficDiagram state={state} mobile={mobile} arrowId={arrowId} reducedMotion={reducedMotion} />}
    </DiagramCanvas>

    <div className="mt-3 space-y-3 border-t border-line pt-4">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Simulation playback">
        <button type="button" className={buttonClass} onClick={togglePlayback} disabled={!controls.canStep} aria-label={playing ? 'Pause lifecycle' : 'Play lifecycle'}>
          {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}{playing ? 'Pause' : motionPaused ? 'Resume' : 'Play lifecycle'}
        </button>
        <button type="button" className={buttonClass} onClick={() => act({ type: 'next' })} disabled={!controls.canStep}><StepForward size={13} aria-hidden="true" />{state.phase === 'transport-down' ? 'Recover SSH' : 'Advance'}</button>
        <button type="button" className={buttonClass} onClick={() => act({ type: 'reset', scenario: state.scenario })}><RotateCcw size={13} aria-hidden="true" />Reset</button>
        <span className="text-xs text-muted" role="status" aria-live="polite">{state.title}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs" role="group" aria-label="Illustrative lifecycle events">
        <button type="button" className="text-accent underline decoration-line underline-offset-4 disabled:cursor-not-allowed disabled:text-muted disabled:no-underline disabled:opacity-40" onClick={() => act({ type: 'request' })} disabled={!canRequest}>Send request</button>
        <button type="button" className="text-muted underline decoration-line underline-offset-4 hover:text-heading disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40" onClick={() => act({ type: 'add-service' })} disabled={!controls.canAddService}>Start remote :9090</button>
        <button type="button" className="text-muted underline decoration-line underline-offset-4 hover:text-heading disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40" onClick={() => act({ type: 'remove-service' })} disabled={!controls.canRemoveService}>Stop remote :8080</button>
        <button type="button" className="text-muted underline decoration-line underline-offset-4 hover:text-heading disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40" onClick={() => act({ type: 'drop-ssh' })} disabled={!controls.canDropSsh}>Drop SSH</button>
        <button type="button" className="text-muted underline decoration-line underline-offset-4 hover:text-heading disabled:cursor-not-allowed disabled:no-underline disabled:opacity-40" onClick={() => act({ type: 'stop' })} disabled={!controls.canStop}>Stop Mole</button>
      </div>
      <p className="text-xs leading-relaxed text-muted">Active local ports: <span className="text-foreground">{activePorts || 'none'}</span>. Remote services: {state.remotePorts.map(port => `:${port}`).join(', ') || 'none'}.</p>
      {reducedMotion && <p className="text-xs leading-relaxed text-muted">Reduced motion: packets stay visible at their destination. Use Advance to read each transition without animation.</p>}
      <div className="flex flex-wrap items-start gap-x-6 gap-y-3 text-xs text-muted">
        <details className="min-w-0 max-w-xl">
          <summary className="cursor-pointer hover:text-heading">Try another setup</summary>
          <div className="mt-3 space-y-3">
            {scenarios.map(scenario => <label key={scenario.value} className="flex cursor-pointer items-start gap-2 leading-relaxed">
              <input type="radio" name="mole-traffic-scenario" value={scenario.value} checked={state.scenario === scenario.value} onChange={() => act({ type: 'reset', scenario: scenario.value })} className="mt-0.5 accent-accent" />
              <span><span className="text-foreground">{scenario.label}</span> — {scenario.description}</span>
            </label>)}
          </div>
        </details>
        <details className="min-w-0 max-w-xl">
          <summary className="cursor-pointer hover:text-heading">What happens at this step?</summary>
          <p className="mt-3 leading-relaxed">{state.detail}</p>
        </details>
      </div>
    </div>
  </div>
}
