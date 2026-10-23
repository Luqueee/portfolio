import { useId } from 'react'
import { DiagramCanvas, DiagramNode, DiagramWire } from './diagram-primitives'

export type KenabotDiagramKind = 'architecture' | 'dashboard' | 'alerts' | 'custom-bots'

type Step = { icon: string; logos?: string[]; wide?: boolean; label: string | string[]; detail?: string | string[] }
type Flow = {
  title: string
  description: string
  steps: Step[]
  /** One label per hop between consecutive steps. */
  hops: string[]
  /** A dashed path from the last step back to another one, drawn clear of the labels. */
  back?: { to: number; label: string }
}

const svgl = 'https://svgl.app/library/'

const flows: Record<KenabotDiagramKind, Flow> = {
  architecture: {
    title: 'How an event travels through Kenabot',
    description: 'Discord events reach a bot runtime, are published on an event bus, routed by a gateway to the right module, and the module sends its actions back through the gateway to the runtime.',
    steps: [
      { icon: 'app', logos: [svgl+'discord.svg'], label: 'Discord', detail: 'events and API' },
      { icon: 'kenabot', label: 'Bot runtime', detail: ['keeps the Discord', 'connection open'] },
      { icon: 'storage', logos: [svgl+'redis.svg'], label: 'Event bus', detail: 'Redis pub/sub' },
      { icon: 'graph', logos: ['/images/logos/grpc-white.svg'], wide: true, label: 'Gateway', detail: ['routes events', 'and requests'] },
      { icon: 'code', label: 'Modules', detail: ['levels, welcomes,', 'moderation…'] },
    ],
    hops: ['events', 'publish', 'subscribe', 'route'],
    back: { to: 1, label: 'actions over gRPC, through the gateway' },
  },
  dashboard: {
    title: 'How a dashboard change reaches the bots',
    description: 'The web dashboard calls an HTTP API, which reads and writes through a data service backed by MongoDB, PostgreSQL and Redis. Modules read the same configuration.',
    steps: [
      { icon: 'browser', logos: [svgl+'react_dark.svg'], label: 'Dashboard', detail: 'React web app' },
      { icon: 'server', label: 'HTTP API', detail: 'auth and routing' },
      { icon: 'config', label: 'Data service', detail: ['configuration,', 'premium, translations'] },
      { icon: 'storage', logos: [svgl+'mongodb-icon-dark.svg', svgl+'postgresql.svg', svgl+'redis.svg'], label: 'Databases', detail: ['MongoDB, PostgreSQL,', 'Redis cache'] },
      { icon: 'code', label: 'Modules', detail: 'read the same settings' },
    ],
    hops: ['request', 'validate', 'persist', 'read'],
  },
  alerts: {
    title: 'How a creator alert becomes a Discord message',
    description: 'Streaming platforms send webhooks to an intake service, which publishes them on the event bus. A notifier module turns them into messages sent through the gateway.',
    steps: [
      { icon: 'app', logos: [svgl+'twitch.svg', svgl+'youtube.svg'], label: 'Streaming platform', detail: 'Twitch, YouTube…' },
      { icon: 'server', label: 'Webhook intake', detail: 'receives the events' },
      { icon: 'storage', logos: [svgl+'redis.svg'], label: 'Event bus', detail: 'Redis pub/sub' },
      { icon: 'code', label: 'Notifier module', detail: 'picks the channels' },
      { icon: 'kenabot', label: 'Bot runtime', detail: 'posts the message' },
    ],
    hops: ['webhook', 'event', 'consume', 'via gateway'],
  },
  'custom-bots': {
    title: 'How a custom bot is run for its owner',
    description: 'A server owner configures their custom bot in the dashboard. A management service starts and stops each custom bot, which then connects to Discord on its own.',
    steps: [
      { icon: 'browser', label: 'Owner', detail: 'dashboard' },
      { icon: 'server', label: 'HTTP API', detail: 'routing' },
      { icon: 'config', logos: [svgl+'docker.svg'], label: 'Bot manager', detail: ['starts and stops', 'custom bots'] },
      { icon: 'kenabot', label: 'Custom bot', detail: 'their own bot' },
      { icon: 'app', logos: [svgl+'discord.svg'], label: 'Discord', detail: 'their own application' },
    ],
    hops: ['configure', 'request', 'start', 'connect'],
  },
}

const captions: Record<KenabotDiagramKind, string> = {
  architecture: 'The event path · the runtime only talks to Discord, the modules only talk to the gateway.',
  dashboard: 'The configuration path · one API in front, shared storage behind it.',
  alerts: 'The notification path · creator events travel the same bus as everything else.',
  'custom-bots': 'The custom bot lifecycle · each custom bot connects to Discord on its own.',
}

function FlowDiagram({ flow }: { flow: Flow }) {
  const { steps, hops, back } = flow
  const last = steps.length - 1
  const step = 720 / last
  const desktopX = (i: number) => 90 + i * step
  const mobileY = (i: number) => 55 + i * 150
  return <DiagramCanvas title={flow.title} description={flow.description} desktopHeight={back ? 205 : 185} mobileHeight={mobileY(last) + 110}>{({ mobile, arrowId }) => <>
    {steps.map((item, i) => <DiagramNode key={i} x={mobile ? 110 : desktopX(i)} y={mobile ? mobileY(i) : back ? 100 : 80} icon={item.icon} logos={item.logos} wide={item.wide} label={item.label} detail={item.detail} />)}
    {hops.map((label, i) => mobile
      ? <DiagramWire key={i} d={`M 110 ${mobileY(i) + 88} V ${mobileY(i + 1) - 30}`} arrowId={arrowId} label={label} x={160} y={mobileY(i) + 113} />
      : <DiagramWire key={i} d={`M ${desktopX(i) + 50} ${back ? 100 : 80} H ${desktopX(i + 1) - 50}`} arrowId={arrowId} label={label} x={(desktopX(i) + desktopX(i + 1)) / 2} y={(back ? 100 : 80) - 16} />)}
    {back && (mobile
      ? <>
        <DiagramWire d={`M 150 ${mobileY(last)} H 330 V ${mobileY(back.to)} H 150`} arrowId={arrowId} dashed />
        <text x="318" y={(mobileY(last) + mobileY(back.to)) / 2} textAnchor="middle" transform={`rotate(-90 318 ${(mobileY(last) + mobileY(back.to)) / 2})`} fill="var(--color-muted)" fontSize="11.5">actions over gRPC</text>
      </>
      : <>
        <DiagramWire d={`M ${desktopX(last)} 76 V 34 H ${desktopX(back.to)} V 76`} arrowId={arrowId} dashed />
        <text x={(desktopX(last) + desktopX(back.to)) / 2} y="24" textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">{back.label}</text>
      </>)}
  </>}</DiagramCanvas>
}

export function KenabotArticleDiagram({ kind }: { kind: KenabotDiagramKind }) {
  const id = useId()
  return <figure data-kenabot-diagram={kind} aria-labelledby={id} className="my-[32px] border-y border-line py-[26px] max-[641px]:my-[26px] max-[641px]:py-[20px]">
    <FlowDiagram flow={flows[kind]} />
    <figcaption id={id} className="mt-[18px] text-[11px] leading-[1.8] text-muted">{captions[kind]}</figcaption>
  </figure>
}
