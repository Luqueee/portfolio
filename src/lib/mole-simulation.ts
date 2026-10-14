// Illustrative control flow, not a network client or live telemetry.
// Source: Luqueee/mole main@8ceb33fe75b468efb86624685d8a4e4f4dd794ee.
// Startup, listener reconciliation and shutdown: cmd/mole/main.go:149-320,352-429,480-513.
// Detached process: cmd/mole/daemon.go:26-79. TCP bridge: internal/proxy/proxy.go:31-94.
// Shared reconnect and refused-channel distinction: internal/tunnel/tunnel.go:152-236,341-392.
// Temporary, add-only probes: internal/discover/discover.go:140-163 and main.go:488-503.

export type SimulationScenario = 'auto' | 'manual' | 'fallback'

export type SimulationAction =
  | { type: 'next' }
  | { type: 'request' }
  | { type: 'add-service' }
  | { type: 'remove-service' }
  | { type: 'drop-ssh' }
  | { type: 'stop' }
  | { type: 'reset'; scenario: SimulationScenario }

export type SimulationPhase =
  | 'idle'
  | 'configuration'
  | 'detached'
  | 'ssh'
  | 'discovery'
  | 'pinned-setup'
  | 'listeners'
  | 'request'
  | 'running'
  | 'service-added'
  | 'service-removed'
  | 'service-refused'
  | 'rediscovery'
  | 'transport-down'
  | 'reconnecting'
  | 'reconnected'
  | 'shutdown'
  | 'stopped'

export type SimulationEvent = {
  id: number
  title: string
  detail: string
  nodes: string[]
}

export type SimulationState = {
  scenario: SimulationScenario
  phase: SimulationPhase
  title: string
  detail: string
  forwardedPorts: { port: number; pinned: boolean }[]
  remotePorts: number[]
  activeNodeIds: string[]
  events: SimulationEvent[]
  sshStatus: 'disconnected' | 'connected' | 'dropped' | 'reconnecting' | 'closed'
  processStatus: 'idle' | 'running' | 'stopping' | 'stopped'
  pendingChange: 'add' | 'remove' | null
  recovery: 'none' | 'detected' | 'in-flight' | 'restored'
  requestPort: number | null
  requestOutcome: 'none' | 'forwarded' | 'refused'
  nextEventId: number
}

const eventLimit = 18
const pinnedPorts = [8080, 9090]
// This small illustrative subset is present in config.Default().DiscoverPorts.
const probeCandidates = [3000, 8080, 9090]

function transition(
  state: SimulationState,
  phase: SimulationPhase,
  title: string,
  detail: string,
  nodes: string[],
  changes: Partial<Omit<SimulationState, 'scenario' | 'phase' | 'title' | 'detail' | 'activeNodeIds' | 'events' | 'nextEventId'>> = {},
): SimulationState {
  return {
    ...state,
    ...changes,
    phase,
    title,
    detail,
    activeNodeIds: nodes,
    events: [...state.events, { id: state.nextEventId, title, detail, nodes }].slice(-eventLimit),
    nextEventId: state.nextEventId + 1,
  }
}

export function createSimulation(scenario: SimulationScenario): SimulationState {
  const title = 'Ready to illustrate Mole'
  const detail = 'A deterministic example starts with remote services on 3000 and 8080. No process, SSH connection, probe, request, or measurement is actually created. Step once to choose startup inputs.'
  return {
    scenario,
    phase: 'idle',
    title,
    detail,
    forwardedPorts: [],
    remotePorts: [3000, 8080],
    activeNodeIds: ['cli'],
    events: [{ id: 1, title, detail, nodes: ['cli'] }],
    sshStatus: 'disconnected',
    processStatus: 'idle',
    pendingChange: null,
    recovery: 'none',
    requestPort: null,
    requestOutcome: 'none',
    nextEventId: 2,
  }
}

export function simulationControls(state: SimulationState): {
  canStep: boolean
  canAddService: boolean
  canRemoveService: boolean
  canDropSsh: boolean
  canStop: boolean
} {
  const running = state.phase === 'running' && state.sshStatus === 'connected'
  return {
    canStep: state.phase !== 'running' && state.phase !== 'stopped',
    canAddService: running && !state.remotePorts.includes(9090),
    canRemoveService: running && state.remotePorts.includes(8080),
    canDropSsh: running,
    canStop: state.processStatus === 'running',
  }
}

function beginDiscovery(state: SimulationState): SimulationState {
  if (state.scenario === 'manual') {
    return transition(
      state,
      'pinned-setup',
      state.pendingChange ? 'Explicit pins do not rediscover' : 'Set up explicit pinned ports',
      'This example explicitly requests 8080 and 9090 with auto-discovery off. Each gets a local listener even when its remote service is absent. Remote service changes neither add nor prune these pins.',
      ['config', 'forwarder'],
    )
  }
  const phase = state.pendingChange ? 'rediscovery' : 'discovery'
  if (state.scenario === 'fallback') {
    return transition(
      state,
      phase,
      'Fall back to candidate probes',
      'In this example neither ss nor netstat is available. Probe the candidate ports 3000, 8080 and 9090 using one separate, temporary SSH transport for a bounded five-second sweep. A failed probe cannot prove disappearance; the sweep may add listeners but never prune them.',
      ['discovery', 'ssh', 'remote', 'services'],
    )
  }
  return transition(
    state,
    phase,
    state.pendingChange ? 'Rediscover authoritative listeners' : 'Enumerate remote TCP listeners',
    'Run ss -tlnH over an SSH exec session, with netstat -tln as the alternative. A successful enumeration is authoritative, including an empty result. Keep eligible loopback-reachable services and prune absent unpinned listeners; configured pins are protected.',
    ['discovery', 'ssh', 'remote', 'services', 'forwarder'],
  )
}

function listenersReady(state: SimulationState): SimulationState {
  let forwardedPorts: SimulationState['forwardedPorts']
  let detail: string
  if (state.scenario === 'manual') {
    forwardedPorts = pinnedPorts.map((port) => ({ port, pinned: true }))
    detail = state.pendingChange
      ? 'The existing listeners on 127.0.0.1:8080 and :9090 stay bound. Auto-discovery is disabled: remote service changes do not alter the explicit port list, and a missing service is not a reason to close a pinned listener.'
      : 'Bind 127.0.0.1:8080 and :9090, forwarding to the same port numbers on the remote loopback. Both are pinned. The 9090 listener can exist before its remote service starts; binding locally does not test the remote service.'
  } else if (state.scenario === 'fallback') {
    const successful = state.remotePorts.filter((port) => probeCandidates.includes(port))
    const ports = [...new Set([...state.forwardedPorts.map(({ port }) => port), ...successful])].sort((a, b) => a - b)
    forwardedPorts = ports.map((port) => ({ port, pinned: state.forwardedPorts.some((existing) => existing.port === port && existing.pinned) }))
    detail = state.pendingChange === 'remove'
      ? 'The 8080 probe no longer succeeds, but its local listener is retained. Fallback reconciliation only ensures successful candidates; it never calls pruning. Closing the temporary probe transport leaves the forwarding transport and existing listeners alone.'
      : 'Successful candidate probes add same-numbered listeners on 127.0.0.1. Existing listeners are reused, not rebound, and none are pruned. The sweep closes its own temporary SSH transport without closing the forwarding transport.'
  } else {
    const ports = [...new Set([
      ...state.remotePorts,
      ...state.forwardedPorts.filter(({ pinned }) => pinned).map(({ port }) => port),
    ])].sort((a, b) => a - b)
    forwardedPorts = ports.map((port) => ({ port, pinned: state.forwardedPorts.some((existing) => existing.port === port && existing.pinned) }))
    detail = state.pendingChange === 'remove'
      ? 'The authoritative result no longer contains 8080, so retain closes that unpinned local listener. Other listeners stay bound, and any explicitly configured pin would survive the same prune. Only listener acceptance ends here; pruning does not explicitly cancel already accepted connections.'
      : 'Ensure a same-numbered 127.0.0.1 listener for each eligible remote service. Already-bound listeners are reused. Reconcile the authoritative result by closing absent unpinned listeners, never configured pins.'
  }
  return transition(state, 'listeners', 'Local forwarders ready', detail, ['forwarder', 'proxy', 'services'], { forwardedPorts })
}

function request(state: SimulationState): SimulationState {
  const preferred = state.pendingChange === 'add' ? 9090 : 8080
  const preferredReady = state.remotePorts.includes(preferred) && state.forwardedPorts.some(({ port }) => port === preferred)
  const port = preferredReady
    ? preferred
    : state.forwardedPorts.find(({ port }) => state.remotePorts.includes(port))?.port ?? state.forwardedPorts[0]?.port
  if (port === undefined) return settle(state)
  if (!state.remotePorts.includes(port)) return refused(state, port)
  return transition(
    state,
    'request',
    `Illustrate a TCP request on ${port}`,
    `Accept a local connection on 127.0.0.1:${port}, then Manager.Dial opens an SSH TCP channel to remote 127.0.0.1:${port}. Two io.Copy operations bridge the byte streams and the handler waits for both directions. Half-close is attempted only for concrete *net.TCPConn peers, not arbitrary SSH channels. This is protocol-agnostic TCP, not a measured HTTP request.`,
    ['client', 'forwarder', 'proxy', 'ssh', 'remote', 'services', 'stats'],
    { requestPort: port, requestOutcome: 'forwarded' },
  )
}

function refused(state: SimulationState, port: number): SimulationState {
  return transition(
    state,
    'service-refused',
    `Remote service ${port} refuses a new channel`,
    `The local ${port} listener still accepts, but its absent remote service rejects the SSH channel open. Manager.Dial treats ssh.OpenChannelError as a service refusal, not a transport failure: it does not reconnect. The proxy ends only this request and invokes its dial-failure hook; SSH and the other listeners stay available.`,
    ['forwarder', 'proxy', 'ssh', 'services', 'stats'],
    { requestPort: port, requestOutcome: 'refused' },
  )
}

function settle(state: SimulationState): SimulationState {
  const mode = state.scenario === 'manual'
    ? 'Explicit 8080 and 9090 listeners remain pinned; there is no periodic discovery. A bound listener does not guarantee a live remote service.'
    : state.scenario === 'fallback'
      ? 'The real process schedules discovery every 15 seconds; here each remote-service event illustrates one sweep. Fallback sweeps remain add-only, so a stale listener may still refuse a new request.'
      : 'The real process schedules authoritative rediscovery every 15 seconds; here each remote-service event illustrates one sweep. Absent unpinned listeners can be pruned.'
  return transition(
    state,
    'running',
    'Stable running · playback settled',
    `${mode} The SSH watchdog checks every 10 seconds. This simulation waits for your next event instead of inventing background traffic or looping indefinitely.`,
    state.scenario === 'manual'
      ? ['lifecycle', 'forwarder', 'ssh', 'watchdog']
      : ['lifecycle', 'forwarder', 'ssh', 'watchdog', 'discovery'],
    { pendingChange: null, recovery: 'none' },
  )
}

function next(state: SimulationState): SimulationState {
  switch (state.phase) {
    case 'idle':
      return transition(
        state,
        'configuration',
        'Choose startup inputs',
        state.scenario === 'manual'
          ? 'Choose a remote SSH host and explicit ports 8080 and 9090; disable auto-discovery. This example selects optional -d background mode. It does not enable the optional admin HTTP server or invoke the separate clipboard commands. Configuration will be loaded by the child after detaching.'
          : `Choose a remote SSH host with auto-discovery enabled${state.scenario === 'fallback' ? ' and a candidate-probe fallback' : ''}. This example selects optional -d background mode. It does not enable the optional admin HTTP server or invoke the separate clipboard commands. Configuration will be loaded by the child after detaching.`,
        ['cli', 'config', 'settings'],
      )
    case 'configuration':
      return transition(
        state,
        'detached',
        'Optional detach creates the local process',
        'For mole up -d, re-execute the same binary with detach flags stripped and MOLE_DAEMONIZED=1. Record the child PID and redirect its output to the log file; the parent returns without waiting. Foreground mode would skip this re-exec, not require another forwarding component.',
        ['cli', 'lifecycle', 'state', 'logs'],
        { processStatus: 'running' },
      )
    case 'detached':
      return transition(
        state,
        'ssh',
        'Load configuration and open SSH',
        'The child finds and loads YAML, applies CLI overrides, and resolves the SSH target. Manager.New builds authentication and host-key verification and opens the persistent SSH transport. This example assumes a successful handshake and local binds, not a real connection. Start the shared manager’s 10-second watchdog.',
        ['config', 'settings', 'identity', 'ssh', 'remote', 'watchdog'],
        { sshStatus: 'connected' },
      )
    case 'ssh':
    case 'service-added':
      return beginDiscovery(state)
    case 'discovery':
    case 'rediscovery':
    case 'pinned-setup':
      return listenersReady(state)
    case 'listeners':
      return state.pendingChange === 'remove' ? settle(state) : request(state)
    case 'request':
      return settle(state)
    case 'service-removed':
      // Show refusal before the modeled next discovery tick prunes anything.
      return refused(state, 8080)
    case 'service-refused':
      return state.pendingChange === 'remove' ? beginDiscovery(state) : settle(state)
    case 'transport-down':
      return transition(
        state,
        'reconnecting',
        'Coordinate one transport reconnect',
        'A watchdog session check and concurrent TCP dials can observe the same dead SSH client. They share reconnectMu. One caller opens a replacement transport; waiting callers re-check the current client rather than initiating a reconnect for every forwarded port. Local listeners remain bound.',
        ['watchdog', 'ssh', 'identity', 'forwarder'],
        { sshStatus: 'reconnecting', recovery: 'in-flight' },
      )
    case 'reconnecting':
      return transition(
        state,
        'reconnected',
        'Install one replacement SSH transport',
        'Assume the single reconnect succeeds. Install the fresh client and close the old one; waiting callers reuse the replacement. The port listeners have not been closed or rebound. Broken in-flight byte streams are not replayed or guaranteed to survive; the next step illustrates a new request on an existing listener.',
        ['ssh', 'remote', 'forwarder', 'watchdog'],
        { sshStatus: 'connected', recovery: 'restored' },
      )
    case 'reconnected':
      return request(state)
    case 'shutdown':
      return transition(
        state,
        'stopped',
        'Stopped · listeners and SSH closed',
        'After cancellation, runUp returns and its deferred cleanup closes every local listener, then the SSH client and retained agent connection. The detached child removes its PID file on exit. The example has no admin server to shut down and no clipboard process to stop.',
        ['lifecycle', 'forwarder', 'ssh', 'state'],
        {
          forwardedPorts: [],
          sshStatus: 'closed',
          processStatus: 'stopped',
          pendingChange: null,
          recovery: 'none',
          requestPort: null,
          requestOutcome: 'none',
        },
      )
    case 'running':
    case 'stopped':
      return state
  }
}

export function simulationReducer(state: SimulationState, action: SimulationAction): SimulationState {
  if (action.type === 'reset') return createSimulation(action.scenario)
  const controls = simulationControls(state)
  switch (action.type) {
    case 'next':
      return controls.canStep ? next(state) : state
    case 'request':
      return state.phase === 'running' && state.sshStatus === 'connected' ? request(state) : state
    case 'add-service':
      if (!controls.canAddService) return state
      return transition(
        state,
        'service-added',
        'Start remote service 9090',
        state.scenario === 'manual'
          ? 'Illustrate a remote service starting on 9090. Its explicitly pinned local listener already exists; no discovery or new bind is required. Step to observe the unchanged listener set and a new request.'
          : 'Illustrate a remote service starting on 9090. Remote availability changes first; Mole does not receive a push notification. Step to model the next scheduled discovery sweep, then the new local listener and a request.',
        ['remote', 'services'],
        { remotePorts: [...state.remotePorts, 9090].sort((a, b) => a - b), pendingChange: 'add', requestPort: null, requestOutcome: 'none' },
      )
    case 'remove-service':
      if (!controls.canRemoveService) return state
      return transition(
        state,
        'service-removed',
        'Stop remote service 8080',
        'Illustrate the remote 8080 service stopping. This event does not instantly close its local listener or drop SSH. Step to model one new request being refused before the next discovery sweep; authoritative pruning, fallback retention and explicit pins then diverge.',
        ['remote', 'services', 'forwarder'],
        { remotePorts: state.remotePorts.filter((port) => port !== 8080), pendingChange: 'remove', requestPort: null, requestOutcome: 'none' },
      )
    case 'drop-ssh':
      if (!controls.canDropSsh) return state
      return transition(
        state,
        'transport-down',
        'Drop the forwarding SSH transport',
        'Illustrate loss of the persistent SSH transport, not a refused service. Local listener sockets remain bound; existing SSH-backed streams can fail. A watchdog check or a new dial can detect the drop. Step to coordinate one shared reconnect, with no per-port listener restart.',
        ['ssh', 'watchdog', 'proxy', 'forwarder'],
        { sshStatus: 'dropped', recovery: 'detected', requestPort: null, requestOutcome: 'none' },
      )
    case 'stop':
      if (!controls.canStop) return state
      return transition(
        state,
        'shutdown',
        'Signal shutdown and cancel background work',
        'Illustrate a handled stop signal: runUp cancels the context used by discovery and the watchdog. An enabled admin server would receive its own bounded shutdown, but it is optional and disabled here. Step once more to finish the deferred listener and SSH cleanup; this is not a promise to drain or replay every active stream.',
        ['cli', 'lifecycle', 'discovery', 'watchdog'],
        { processStatus: 'stopping', pendingChange: null, recovery: 'none' },
      )
  }
}
