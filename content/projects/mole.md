## Remote development, without a tunnel checklist

Remote development moves the work off the laptop, but also moves its URLs. A frontend, an API and a preview server can each need a different SSH forwarding command. When services restart or change ports, that tunnel configuration becomes another thing to maintain.

Mole is a single Go binary for developers who already have SSH access and want remote development ports available locally. It forwards TCP connections; it does not start applications, synchronize files or create a VPN.

```sh
mole up --remote dev --auto-discover -d
```

Here, `dev` is an example SSH host alias. Mole watches for services in the background; a discovered server on port 5173 becomes reachable at `http://localhost:5173`, provided that local port is free.

## A local connection, carried through SSH

The browser stays on the laptop. Mole binds an IPv4 loopback listener for each forwarded port, then asks the remote SSH server to connect to `127.0.0.1` at the same port. Ordinary forwarding needs no Mole agent on the remote machine: the existing SSH server provides the other end.

[mole-diagram:traffic]

Each accepted connection gets a proxy handler; forwarding channels share a persistent Go SSH client. Two `io.Copy` operations carry bytes in opposite directions, and the handler waits for both. Best-effort half-close applies to concrete TCP sockets, not generally to SSH channels.

Mole neither routes HTTP nor terminates TLS. It does not forward UDP or remap ports. Local bind conflicts are logged and skipped rather than silently changing the URL.

## From command to running process

Before loading YAML, `up -d` launches the same executable without the detach flag. An environment marker identifies the child; the parent records its PID and returns to the shell. This is detachment, not a service manager.

[mole-diagram:process]

The child loads defaults, one selected YAML file, then non-empty value flags and enabling switches. An explicit path wins; otherwise project-local `mole.yaml` precedes user-global configuration. Those files are not merged. `init` writes configuration; `config edit` opens an editor.

A bare alias uses the system's `ssh -G` to resolve hostname, user, port, identity files and `ProxyJump`. Go's SSH client then connects, authenticating and verifying host keys at each jump. Explicit `user@host` targets bypass alias resolution and do not inherit jump settings.

Authentication tries resolved identity files, SSH-agent signers and default key files, in order—not interactive passwords. Host keys use `~/.ssh/known_hosts`: unfamiliar keys are trusted and recorded with a warning; changed keys are rejected. `--insecure` disables that protection.

## Finding services without guessing they disappeared

Auto-discovery runs at startup and every 15 seconds. It executes `ss`, then falls back to `netstat`, over an SSH session to find remote TCP listeners. Loopback and wildcard bindings qualify; configured exclusions omit ports such as SSH's own port 22.

[mole-diagram:discovery]

A successful inventory is authoritative even when empty. Mole can therefore remove local listeners for disappeared services, except explicitly configured ports, which stay pinned.

If enumeration fails, Mole probes configured candidates through one separate, temporary SSH transport, with a five-second deadline and at most four concurrent probes. Responsive ports can be added; failures never justify pruning. Closing this transport does not close the persistent forwarding connection.

Discovery also recognizes IPv6 listener rows, but forwarding still targets remote IPv4 loopback. Finding a port is not proof that an application connection will succeed.

## Recovering the transport, not the application

A watchdog opens and immediately closes an SSH session every ten seconds. If that fails, it shares the same reconnect path used by failed forwarding dials. Reconnection is serialized: callers check whether another caller has already replaced the broken client before opening another transport.

[mole-diagram:recovery]

A refused SSH channel is a destination failure, not evidence of a broken transport. Replacing a dead transport does not replay requests or restore lost TCP connections; applications must reconnect.

Signal-driven shutdown cancels background work and closes admin HTTP, listeners and SSH resources. `mole down` requests this through SIGTERM on Unix. Windows forcibly kills the process, so it cannot promise graceful cleanup. `restart` reloads configuration rather than reconstructing previous transient flags.

## Keeping control local

Optional admin HTTP exposes JSON status: uptime, forwarded ports, active connections, total accepts and failed remote dials. Accepts are counted before remote dialing succeeds; these are connection counters, not bandwidth or latency measurements. `/health` returns HTTP 200 without testing SSH or applications.

[mole-diagram:operations]

Admin HTTP is disabled in package defaults. YAML generated by `init` explicitly enables `127.0.0.1:9999`; otherwise it starts only when an address is configured. There is no authentication, so the bind address is an important exposure boundary.

Live port endpoints call the listener controller without saving YAML or replacing startup discovery candidates. The `ports` commands instead save candidate changes first, then attempt a best-effort live update. A saved change can therefore still require a restart.

Runtime logs are `slog` text/logfmt on stderr, not JSON. Detached execution appends to `mole.log`; `mole logs -f` follows it with terminal formatting. That file and `mole.pid` use per-user state storage: normally `~/.local/state/mole` on Unix, honoring XDG settings, or `%LOCALAPPDATA%/mole` on Windows. They record process state, not recoverable sessions.

## Clipboard images take a different route

Clipboard sharing is separate from `up` and SSH. `mole clip serve` runs unauthenticated HTTP, normally on `127.0.0.1:7777`. Remote use requires an explicitly reachable private address, such as Tailscale or WireGuard; Mole does not establish that network.

[mole-diagram:clipboard]

On macOS, a watcher reads PNG clipboard data using `osascript` and `xxd`, normally every 500 milliseconds. Hash deduplication avoids resending unchanged images; HTTP PUT publishes to one cache file. Other platforms can serve HTTP without this watcher.

On the receiving machine, `mole clip pull` fetches over HTTP, writes a timestamped temporary PNG and prints its path for shell tools. Publication and download write temporary files before renaming. No cached image produces exit code 3, distinct from network failures.

## A binary to install, a website to explain it

Distribution follows the platform rather than bundling a runtime service. The Unix installer builds the CLI from Go source. Windows can build a local checkout or download a release ZIP whose SHA-256 is checked against GitHub release metadata.

[mole-diagram:delivery]

`mole update` downloads the official platform installer and targets the current executable's resolved path. It does not automatically restart the daemon or migrate its existing SSH sessions.

The Astro landing site builds and deploys independently as static files. It explains the tool and installation, but is neither the forwarding runtime nor the admin server. The core stays focused: local TCP listeners carried through SSH, with discovery and recovery around them.

[Visit Mole's website](https://mole.luqueee.dev/) · [Read the source and CLI reference](https://github.com/Luqueee/mole)
