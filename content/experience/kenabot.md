Kenabot is a multipurpose Discord bot. It runs in more than 300,000 servers and reaches over 30 million users. Welcomes, levels and creator alerts are configured from a web dashboard.

Kenabot has been in development for more than four years, built by a team. I joined that team over two years ago, and I work across the frontend, the backend and the infrastructure.

## What Kenabot is

Kenabot gives a Discord server the tools it would otherwise need several different bots for. A server owner invites it once and turns on only the parts they want, each one set up from the web dashboard.

## Frontend

The dashboard is where server owners set Kenabot up, so most of the frontend work is forms: many modules, each with its own options, a live preview of what the bot will send, and an editor for building messages.

- **React 19 and React Router**, rendered on the server, with **Vite** as the build tool and **TypeScript** throughout.
- **Tailwind CSS** for styling, on top of **Radix UI** and **Base UI** primitives for accessible components.
- **TanStack Form**, **React Hook Form** and **Zod** for forms and validation.
- **Tiptap** for the rich text and mention editor, and **dnd-kit** for drag and drop when building messages.
- **Motion** for animation and **Recharts** for the stats charts.
- **Storybook**, **Vitest** and **Playwright** for building components in isolation and testing them in a real browser.
- **Biome** for linting and formatting.

## Architecture

Kenabot is not one program. It is a fleet of small services that each do one job, split by how fast they have to be and how much state they hold.

[kenabot-diagram:architecture]

**The bot runtime.** A worker process keeps the connection to Discord open and does nothing else: it receives events, publishes them, and executes the actions it is asked to run. Because it holds no feature logic, it can be restarted without losing anything, and the same runtime serves the main bots and the custom bots our premium users run.

**A gateway in the middle.** Features are separate modules (levels, welcomes, moderation, tickets, creator notifications and more), and none of them talk to the bot runtime directly. Events travel over a Redis pub/sub bus to a gateway, which routes them to the right module. When a module wants to act on Discord, it sends a gRPC request to the gateway, and the gateway forwards it to the runtime that owns that bot. Adding a feature means adding a module. Nothing else changes.

**Backend services.** Around that core sits a set of independent APIs, each written in the language that suits its job: TypeScript for the HTTP layer and integrations, Go for the data services, Rust for the parts where latency matters most. They handle configuration and data, translations, premium subscriptions, file storage and a CDN, metrics, and incoming webhooks from streaming platforms.

**Creator alerts.** Streaming platforms push their events to a dedicated intake service, which publishes them on the same bus. A notifier module picks them up and asks the runtime, through the gateway, to post the message in the right channels.

[kenabot-diagram:alerts]

**Data.** Server configuration and long-lived data live in MongoDB and PostgreSQL. Redis is used for caching and as the event bus.

[kenabot-diagram:dashboard]

**The dashboard.** The web dashboard is a React application that talks to the same backend through an HTTP API, so what a server owner changes there reaches the bots through the same path as everything else.

[kenabot-diagram:custom-bots]

**Deployment.** Everything runs in containers, and custom bots are started and stopped on demand by a dedicated service.
