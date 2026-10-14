export const kivgraphRevision = '259fb0081ebbd5f07faa703a77d7a0c86c35978c'
export type KivgraphDiagramKind = 'indexing' | 'engines' | 'publication' | 'queries' | 'identity' | 'viewer'

export const kivgraphDiagramSources: Record<KivgraphDiagramKind, { label: string; path: string; line: number; endLine: number }[]> = {
  indexing: [
    { label: 'Source observation and full indexing', path: 'internal/indexing/full.go', line: 449, endLine: 559 },
    { label: 'Analysis units and corpus merge', path: 'internal/indexer/full.go', line: 433, endLine: 607 },
    { label: 'Reusable, validated analysis facts', path: 'internal/indexer/factcache.go', line: 307, endLine: 391 },
    { label: 'Canonical loading', path: 'internal/storage/ladybug/canonical_load_native.go', line: 59, endLine: 146 },
  ],
  engines: [
    { label: 'Typed Go loading', path: 'internal/goloader/loader.go', line: 24, endLine: 40 },
    { label: 'Native TypeScript API', path: 'ts-worker/src/language-service.ts', line: 186, endLine: 200 },
    { label: 'Rust semantic analysis', path: 'internal/indexer/rust_unit.go', line: 126, endLine: 167 },
    { label: 'Python fallback and exact modes', path: 'internal/pythonloader/loader.go', line: 64, endLine: 166 },
    { label: 'Dart navigation and unresolved targets', path: 'internal/dartloader/loader.go', line: 614, endLine: 695 },
  ],
  publication: [
    { label: 'Snapshot construction and validation gates', path: 'internal/rebuild/rebuild.go', line: 294, endLine: 471 },
    { label: 'Durable generation publication', path: 'internal/storage/generation/store.go', line: 45, endLine: 158 },
    { label: 'Atomic reader snapshot replacement', path: 'internal/hotsnapshot/publication.go', line: 409, endLine: 452 },
    { label: 'Following external generations', path: 'internal/indexing/follow.go', line: 115, endLine: 167 },
    { label: 'Source watcher and reconciliation', path: 'internal/indexing/sourcewatch.go', line: 51, endLine: 201 },
  ],
  queries: [
    { label: 'Serve and optional daemon relay', path: 'cmd/kivgraph/main.go', line: 298, endLine: 464 },
    { label: 'MCP tool registration and STDIO', path: 'internal/mcp/server.go', line: 155, endLine: 329 },
    { label: 'Snapshot-backed reference queries', path: 'internal/mcp/tools/find_references.go', line: 614, endLine: 800 },
    { label: 'Answer completeness', path: 'internal/mcp/tools/completeness.go', line: 12, endLine: 179 },
    { label: 'Current source reads and freshness checks', path: 'internal/mcp/tools/get_source.go', line: 326, endLine: 510 },
    { label: 'Indexing consent gate', path: 'internal/mcp/tools/index_project.go', line: 207, endLine: 263 },
    { label: 'Asynchronous operation lifecycle', path: 'internal/mcp/tools/index_jobs.go', line: 18, endLine: 247 },
  ],
  identity: [
    { label: 'Go provider identity', path: 'internal/goloader/crossrepo.go', line: 150, endLine: 247 },
    { label: 'TypeScript provider-owned targets', path: 'ts-worker/src/imported-symbol-resolver.ts', line: 985, endLine: 1138 },
    { label: 'Rust provider and version matching', path: 'internal/rustloader/crossrepo.go', line: 209, endLine: 279 },
    { label: 'Confidence and unresolved evidence', path: 'internal/facts/semantic.go', line: 341, endLine: 453 },
    { label: 'Merged target closure', path: 'internal/indexer/full.go', line: 1151, endLine: 1245 },
  ],
  viewer: [
    { label: 'Independent UI process and exposure warning', path: 'cmd/kivgraph/main.go', line: 298, endLine: 464 },
    { label: 'Read-only HTTP routes', path: 'internal/webapi/handler.go', line: 79, endLine: 119 },
    { label: 'Generation-pinned graph tiles', path: 'internal/webapi/handler.go', line: 686, endLine: 739 },
    { label: 'Topology inputs and generation consistency', path: 'internal/webapi/topology.go', line: 1070, endLine: 1221 },
  ],
}
