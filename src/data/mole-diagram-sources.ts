export const moleRevision = '8ceb33fe75b468efb86624685d8a4e4f4dd794ee'

export type MoleDiagramKind =
  | 'traffic'
  | 'process'
  | 'discovery'
  | 'recovery'
  | 'operations'
  | 'clipboard'
  | 'delivery'

export const moleDiagramSources: Record<
  MoleDiagramKind,
  { label: string; path: string; line: number; endLine?: number }[]
> = {
  traffic: [
    { label: 'Same-port loopback listeners', path: 'cmd/mole/main.go', line: 360, endLine: 385 },
    { label: 'Bidirectional byte forwarding', path: 'internal/proxy/proxy.go', line: 51, endLine: 104 },
    { label: 'SSH forwarding channels', path: 'internal/tunnel/tunnel.go', line: 204, endLine: 236 },
    { label: 'Optional authenticated jump chain', path: 'internal/tunnel/tunnel.go', line: 682, endLine: 748 },
  ],
  process: [
    { label: 'Detached re-execution', path: 'cmd/mole/daemon.go', line: 26, endLine: 79 },
    { label: 'Configuration and startup order', path: 'cmd/mole/main.go', line: 149, endLine: 211 },
    { label: 'Key and agent authentication', path: 'internal/tunnel/tunnel.go', line: 432, endLine: 489 },
    { label: 'OpenSSH alias resolution', path: 'internal/tunnel/tunnel.go', line: 785, endLine: 850 },
    { label: 'Known-host verification and first-use trust', path: 'internal/tunnel/hostkey.go', line: 113, endLine: 157 },
  ],
  discovery: [
    { label: 'Initial and periodic discovery', path: 'cmd/mole/main.go', line: 249, endLine: 273 },
    { label: 'Authoritative inventory reconciliation', path: 'cmd/mole/main.go', line: 480, endLine: 513 },
    { label: 'Remote listener enumeration', path: 'internal/discover/discover.go', line: 40, endLine: 125 },
    { label: 'Bounded candidate sweep', path: 'internal/discover/discover.go', line: 128, endLine: 197 },
    { label: 'Isolated discovery transport', path: 'internal/tunnel/tunnel.go', line: 270, endLine: 309 },
  ],
  recovery: [
    { label: 'Serialized reconnect and channel refusal', path: 'internal/tunnel/tunnel.go', line: 152, endLine: 236 },
    { label: 'SSH session watchdog', path: 'internal/tunnel/tunnel.go', line: 341, endLine: 373 },
    { label: 'Signal-driven runtime shutdown', path: 'cmd/mole/main.go', line: 308, endLine: 320 },
    { label: 'Unix graceful termination', path: 'cmd/mole/daemon_unix.go', line: 27, endLine: 35 },
    { label: 'Windows forced termination', path: 'cmd/mole/daemon_windows.go', line: 30, endLine: 36 },
  ],
  operations: [
    { label: 'Status, health and live port endpoints', path: 'internal/admin/admin.go', line: 101, endLine: 195 },
    { label: 'Disabled admin defaults and per-user paths', path: 'internal/config/config.go', line: 81, endLine: 147 },
    { label: 'Save configuration before live changes', path: 'cmd/mole/ports.go', line: 129, endLine: 172 },
    { label: 'Text log handler', path: 'cmd/mole/main.go', line: 542, endLine: 555 },
    { label: 'Daemon log viewer and follow mode', path: 'cmd/mole/logs.go', line: 32, endLine: 139 },
  ],
  clipboard: [
    { label: 'Separate HTTP server and bind boundary', path: 'cmd/mole/clip.go', line: 79, endLine: 169 },
    { label: 'PNG cache publication and retrieval', path: 'internal/clip/server.go', line: 75, endLine: 187 },
    { label: 'macOS image deduplication and upload', path: 'internal/clip/watcher_darwin.go', line: 91, endLine: 150 },
    { label: 'Timestamped image download', path: 'internal/clip/client.go', line: 57, endLine: 118 },
    { label: 'One-shot pull and no-image exit code', path: 'cmd/mole/clip.go', line: 192, endLine: 246 },
  ],
  delivery: [
    { label: 'Unix source build and installation', path: 'scripts/install.sh', line: 172, endLine: 246 },
    { label: 'Windows build or verified release', path: 'scripts/install.ps1', line: 120, endLine: 180 },
    { label: 'Installer-based executable update', path: 'cmd/mole/update.go', line: 122, endLine: 164 },
    { label: 'Static Astro output', path: 'landing/astro.config.mjs', line: 17, endLine: 26 },
    { label: 'Independent website deployment', path: '.github/workflows/ci-cd.yml', line: 148, endLine: 197 },
  ],
}
