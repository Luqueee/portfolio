## Beyond searching for names

Search is great when you already know what to look for. It is less useful when the question is *who calls this symbol, what implements it, or what changes across repositories if it moves?* Kivgraph answers those questions from a local semantic code graph and exposes the results to coding agents through MCP.

## A graph with provenance

Kivgraph indexes registered repositories into a canonical graph. It resolves relationships with language-aware tooling rather than matching identical names, and returns repository, file, qualified symbol name and line range alongside an answer. Queries cover references, implementations, outward dependencies, cross-repository consumers and change impact. An immutable published snapshot serves reads while indexing prepares the next graph.

That distinction matters for an empty result. An exact reference query can say that no indexed callers were found; a text search can only say that a particular spelling was not found. Kivgraph also marks unresolved or inferred relationships instead of presenting them as exact edges.

## A research result, not a promise

Kivgraph started as an experiment in reducing how much context coding agents need to inspect. Individual graph queries can use fewer tokens than searching and reading files, but the project's **end-to-end agent benchmarks did not demonstrate a reliable net token saving over long conversations**. A rare name in a small repository may still be cheaper to find with a simple search.

The lasting value is structured navigation and impact analysis across repositories, not a blanket claim that a graph always beats `grep`.

## Using it

Kivgraph runs locally as an MCP server. After registering and indexing repositories, an agent can ask for references or a blast radius without repeatedly opening unrelated files. The project also includes a read-only graph viewer for exploring the published graph.

[Read the user documentation](https://kivgraph.dev/) · [Explore the source and benchmarks](https://github.com/Luqueee/kivgraph)
