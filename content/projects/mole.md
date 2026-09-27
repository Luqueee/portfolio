## Remote development, local URLs

A development server on another machine is useful until every new port becomes another SSH command. Mole makes that workflow feel local: when a service starts on the remote host, you can reach it at the same port on `localhost` without managing a separate tunnel for each one.

## One connection, changing ports

Mole opens one SSH connection and multiplexes the forwarded TCP ports through it. In auto-discovery mode it checks the remote machine's TCP listeners with `ss` or `netstat`, then rescans every 15 seconds. If listener enumeration is unavailable, it probes a configured list of ports instead. You can also skip discovery and forward explicit ports.

SSH aliases from `~/.ssh/config` work as remote targets, so the same host settings and keys you already use with SSH can be reused here. A background daemon keeps the forwarder running, reconnects when the tunnel drops, and exposes status and logs locally.

```text
mole up --remote dev --auto-discover -d
mole status
mole logs -f
mole down
```

Here, `dev` is an example SSH host alias. The `-d` flag runs Mole in the background; `mole down` stops it.

## Where it draws the line

Mole forwards **TCP**, not UDP. Auto-discovery skips reserved ports such as 22 by default. The daemon verifies SSH host keys, and remote ports that disappear are pruned when listeners can be enumerated; explicitly configured ports remain pinned. Those boundaries matter more than pretending every service should be forwarded automatically.

The result is a small, single-binary tool for a specific job: making remote development ports available on your laptop without turning port forwarding into a checklist.

[Explore Mole's documentation](https://mole.luqueee.dev/) · [Read the source and full CLI reference](https://github.com/Luqueee/mole)
