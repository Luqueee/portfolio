## Beyond searching for names

A text search can find `validate`. It cannot, by itself, distinguish two unrelated declarations with that name, follow an implementation through an interface, or prove which other repositories depend on the declaration you want to change.

Kivgraph is a local code-intelligence server for coding agents. It analyzes registered repositories, gives symbols stable identities, and publishes a semantic graph that an agent can query through MCP. The goal is structured navigation and change-impact analysis—not a map of every HTTP request, queue or database connection in a running system.

## Source code becomes a canonical graph

The input is a configured corpus, not whatever files an agent happened to open. Repository registration identifies source roots; indexing discovers language-specific analysis units, runs their analyzers, normalizes the resulting facts, and merges the complete corpus.

[kivgraph-diagram:indexing]

Symbols, relationships, confidence and provenance enter a fresh **LadybugDB generation**, the canonical persisted graph. The database is not traversed for each MCP relationship query: a separate immutable snapshot is the read model.

Indexing is a full rebuild of the registered corpus. A validated fact cache can reuse unchanged analysis units, but that reuse is not an incremental mutation of the graph already serving readers. Cache admission checks analyzer compatibility and the recorded content, provider and registry inputs.

## Different languages, one fact contract

The language engine supplies meaning; the common model supplies consistent identities and relationships. Select a language below to see where its facts come from.

[kivgraph-diagram:engines]

Go uses `go/packages` with syntax and type information. TypeScript uses the native compiler's asynchronous Program/Checker API in a Node.js worker. Rust runs `rust-analyzer scip` for a Cargo workspace. Dart combines language-server symbols with Analysis Server navigation and semantic events. Python can use the bundled AST fallback or an explicitly selected Pyright-based exact mode.

These are not interchangeable guarantees. Python's inferred fallback references remain `CANDIDATE`; stronger proof receives explicit grades such as `EXACT_TYPECHECKED`, `EXACT_PACKAGE_MAPPED` or `STRUCTURAL_CERTAIN`. The dispatcher also supports configured Java and C# semantic adapters. Toolchain availability matters: an unavailable analyzer can leave a language without indexed facts, so coverage must be inspected rather than assumed.

## Crossing repositories requires an owner

An import name is not enough to establish a symbol-level relationship. Kivgraph has to identify the provider repository, map the resolved declaration into that provider, and verify that its target exists in the merged corpus.

[kivgraph-diagram:identity]

Go attribution follows module and workspace resolution. TypeScript resolves the owning provider project, including declaration-map or provider-export paths; a re-exporting package need not own the declaration. Rust checks crate identity and the requested version. Ambiguous providers, missing source mappings or unindexed target declarations must not turn into guessed exact edges.

The consumer owns the occurrence evidence; the provider owns the destination declaration. Failed resolution becomes a separate unresolved fact with a reason. A package-level dependency can be known even when a symbol-level edge cannot be proven.

## Prepare privately, publish a whole generation

The rebuild loads candidate canonical storage, derives a query snapshot from that stored graph, and checks integrity, counts, probes and source observations before publication. Source re-observation detects changes during indexing; it does not lock the repositories.

[kivgraph-diagram:publication]

Successful publication makes a durable generation current, then installs a strictly newer snapshot in the reader store. Existing readers can retain the old immutable snapshot while subsequent reads acquire its replacement. The controls above illustrate this boundary; they do not run Kivgraph or pretend to measure indexing progress.

A serving process can map a published `snapshot.kvsnap` after validating its graph-content digest. If that representation is unavailable or rejected, it can reconstruct the read model from readable canonical storage. That fallback is not a promise that a broken database remains queryable.

Generation following notices publication by another process. Optional source watching batches changes and marks stale profiles for another full rebuild; branch-change resynchronization is a separate trigger. Neither path edits the graph underneath an active query.

## What an agent actually reads

An agent talks STDIO to `kivgraph serve`. That entry can run the MCP server locally or relay to a shared daemon; a complete graph-owning process per client is not mandatory. Graph loading is deferred until needed, and a missing generation exposes repair/indexing controls rather than pretending relationship queries are available.

[kivgraph-diagram:queries]

Relationship tools resolve a selector against a snapshot, traverse its indexed adjacency, apply confidence rules and return addressable rows. References, implementations, outward dependencies, cross-repository consumers and blast radius answer different directions of the same graph. Symbol lookup, intent search, outlines and repository/status tools help an agent choose where to investigate next.

Rows carry repository, relative path, qualified symbol name and declaration range. That range identifies the containing declaration, not necessarily the precise reference token. Generation-bound cursors prevent a later page from silently mixing snapshots.

Answers also distinguish `COMPLETE` from `LOWER_BOUND` according to recorded unresolved references and unreadable scopes. “Complete” is about the indexed scope—not unregistered repositories or arbitrary live source changes. Search guidance accompanying a lower-bound answer is advice, not an automatically executed fallback search.

`get_source` takes a different path after symbol resolution: it reads current repository files and compares their bytes with the indexed digest. It enforces path restrictions and output limits, and reports stale or trimmed bodies. Stale reanchoring is a textual heuristic, not fresh semantic analysis and not a relationship update.

## Indexing is a separate, consent-gated operation

The MCP surface declares thirteen read-only tools and two mutations, `index_project` and `start_index_project`. The mutation tools request consent through client elicitation or explicit confirmation before repository registration and indexing. Registering a batch results in one full corpus rebuild in a child process.

The asynchronous path returns an operation ID; `get_index_status` reports progress and a terminal result. Its registry is process-local, with one active operation and bounded completed history—not a durable job queue. A shared daemon can share it across sessions. Indexing failure and failure attaching an already-published generation are distinct boundaries; publication is not simply undone because a later attachment failed.

## The viewer does not call MCP

`kivgraph ui` is another local surface with its own snapshot store and generation follower. The browser requests graph data over HTTP; it is not issuing MCP tool calls.

[kivgraph-diagram:viewer]

The HTTP API accepts GET/HEAD. Symbols, neighborhoods and binary graph tiles use the published snapshot, with layouts cached by generation. Topology additionally reads profile configuration, published source observations and invalidation metadata. A mismatched generation pin is rejected instead of quietly combining old and new graph data.

Read-only does not mean private: the viewer has no authentication and its default bind is network-wide. For local exploration, bind explicitly:

```sh
kivgraph ui --addr 127.0.0.1:7777
```

Release bundles package the Go server, native LadybugDB library, workers and optional viewer assets; language runtimes and SDK requirements still apply. The documentation/landing site deploys separately. Neither that site nor the 3D renderer owns semantic resolution.

## A research result, not a token-saving promise

Kivgraph began by asking whether semantic navigation could reduce the context coding agents need. Some isolated queries beat searching and reading files, but the project's **end-to-end agent benchmarks did not demonstrate reliable net token savings across long conversations**. Rare names in small repositories may still be cheaper to find with a simple search.

Its lasting value is precise navigation, explicit uncertainty and cross-repository impact analysis—not a claim that every graph query is cheaper or every empty result proves absence everywhere.

[Read the user documentation](https://kivgraph.dev/) · [Explore the source and benchmarks](https://github.com/Luqueee/kivgraph)
