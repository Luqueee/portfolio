import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createSimulation, simulationControls, simulationReducer, type SimulationState } from '../src/lib/mole-simulation'

function settle(initial: SimulationState) {
  let state = initial
  for (let step = 0; simulationControls(state).canStep && step < 20; step++) {
    state = simulationReducer(state, { type: 'next' })
  }
  assert.equal(simulationControls(state).canStep, false)
  return state
}

const ports = (state: SimulationState) => state.forwardedPorts.map(({ port }) => port)

test('authoritative discovery prunes a vanished service without treating its refusal as SSH loss', () => {
  let state = settle(createSimulation('auto'))
  state = simulationReducer(state, { type: 'remove-service' })
  state = simulationReducer(state, { type: 'next' })
  assert.equal(state.requestOutcome, 'refused')
  assert.equal(state.sshStatus, 'connected')
  assert.ok(ports(state).includes(8080))

  state = settle(state)
  assert.ok(!state.remotePorts.includes(8080))
  assert.deepEqual(ports(state), [3000])
  assert.equal(state.phase, 'running')
})

test('fallback probes retain stale listeners but still add a newly available candidate', () => {
  let state = settle(createSimulation('fallback'))
  state = settle(simulationReducer(state, { type: 'remove-service' }))
  assert.ok(!state.remotePorts.includes(8080))
  assert.deepEqual(ports(state), [3000, 8080])

  state = settle(simulationReducer(state, { type: 'add-service' }))
  assert.deepEqual(ports(state), [3000, 8080, 9090])
  assert.equal(state.requestPort, 9090)
  assert.equal(state.requestOutcome, 'forwarded')
})

test('explicit pins exist before their services and survive a remote service stopping', () => {
  let state = settle(createSimulation('manual'))
  const originalPins = state.forwardedPorts
  assert.deepEqual(originalPins, [{ port: 8080, pinned: true }, { port: 9090, pinned: true }])
  assert.ok(!state.remotePorts.includes(9090))

  state = settle(simulationReducer(state, { type: 'remove-service' }))
  assert.deepEqual(state.forwardedPorts, originalPins)
  assert.equal(state.sshStatus, 'connected')
  state = settle(simulationReducer(state, { type: 'add-service' }))
  assert.deepEqual(state.forwardedPorts, originalPins)
  assert.equal(state.requestPort, 9090)
  assert.equal(state.requestOutcome, 'forwarded')
})

test('transport recovery preserves listeners, while local shutdown closes them without stopping remote services', () => {
  let state = settle(createSimulation('auto'))
  const originalListeners = state.forwardedPorts
  const remoteServices = state.remotePorts
  state = simulationReducer(state, { type: 'drop-ssh' })
  assert.equal(state.sshStatus, 'dropped')
  assert.deepEqual(state.forwardedPorts, originalListeners)

  state = simulationReducer(state, { type: 'next' })
  assert.equal(state.sshStatus, 'reconnecting')
  state = simulationReducer(state, { type: 'next' })
  assert.equal(state.sshStatus, 'connected')
  assert.deepEqual(state.forwardedPorts, originalListeners)
  state = settle(state)
  assert.equal(state.requestOutcome, 'forwarded')

  state = simulationReducer(state, { type: 'stop' })
  assert.equal(state.processStatus, 'stopping')
  state = settle(state)
  assert.equal(state.phase, 'stopped')
  assert.deepEqual(state.forwardedPorts, [])
  assert.equal(state.sshStatus, 'closed')
  assert.deepEqual(state.remotePorts, remoteServices)
})

test('a consumer can request fresh traffic only on a running, connected transport without rebinding listeners', () => {
  const idle = createSimulation('auto')
  assert.equal(simulationReducer(idle, { type: 'request' }), idle)

  for (const scenario of ['auto', 'manual', 'fallback'] as const) {
    const running = settle(createSimulation(scenario))
    const listeners = running.forwardedPorts
    const remoteServices = running.remotePorts
    const requested = simulationReducer(running, { type: 'request' })
    assert.equal(requested.phase, 'request')
    assert.equal(requested.requestOutcome, 'forwarded')
    assert.equal(requested.requestPort, 8080)
    assert.equal(requested.sshStatus, 'connected')
    assert.equal(requested.forwardedPorts, listeners)
    assert.equal(requested.remotePorts, remoteServices)
    assert.equal(simulationReducer(requested, { type: 'request' }), requested)
    assert.equal(simulationReducer(requested, { type: 'next' }).phase, 'running')

    const dropped = simulationReducer(running, { type: 'drop-ssh' })
    assert.equal(simulationReducer(dropped, { type: 'request' }), dropped)
    const reconnecting = simulationReducer(dropped, { type: 'next' })
    assert.equal(simulationReducer(reconnecting, { type: 'request' }), reconnecting)
    const stopped = settle(simulationReducer(running, { type: 'stop' }))
    assert.equal(simulationReducer(stopped, { type: 'request' }), stopped)
  }
})

test('a fresh request can be refused on a retained pin without reconnecting or changing listeners', () => {
  const running = settle(simulationReducer(settle(createSimulation('manual')), { type: 'remove-service' }))
  const listeners = running.forwardedPorts
  const requested = simulationReducer(running, { type: 'request' })
  assert.equal(requested.phase, 'service-refused')
  assert.equal(requested.requestPort, 8080)
  assert.equal(requested.requestOutcome, 'refused')
  assert.equal(requested.sshStatus, 'connected')
  assert.equal(requested.forwardedPorts, listeners)
  assert.equal(simulationReducer(requested, { type: 'next' }).phase, 'running')
})
