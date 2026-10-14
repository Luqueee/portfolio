import { useId, type ReactNode } from 'react'
import { AppWindow, Bot, Braces, Clipboard, Clock3, Database, Download, FileText, FolderCog, GitMerge, Globe2, Layers3, Laptop, LockKeyhole, Network, ScanLine, Server, Terminal, type LucideIcon } from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  browser: AppWindow, terminal: Terminal, server: Server, app: Globe2, clock: Clock3,
  scan: ScanLine, file: FileText, lock: LockKeyhole, clipboard: Clipboard,
  download: Download, merge: GitMerge, process: Laptop, config: FolderCog,
  agent: Bot, code: Braces, storage: Database, snapshot: Layers3, graph: Network,
}

type DiagramLayout = { mobile: boolean; arrowId: string }
type CanvasProps = {
  title: string
  description: string
  desktopHeight: number
  mobileHeight: number
  children: (layout: DiagramLayout) => ReactNode
}

export function DiagramCanvas({ title, description, desktopHeight, mobileHeight, children }: CanvasProps) {
  const id = useId().replaceAll(':', '')
  return <>
    {[false, true].map(mobile => {
      const suffix = mobile ? 'mobile' : 'desktop'
      const arrowId = `diagram-${id}-${suffix}-arrow`
      return <svg key={suffix} role="img" aria-labelledby={`diagram-${id}-${suffix}-title diagram-${id}-${suffix}-description`} viewBox={`0 0 ${mobile ? 360 : 900} ${mobile ? mobileHeight : desktopHeight}`} className={mobile ? 'mx-auto block h-auto w-full max-w-[440px] text-foreground min-[801px]:hidden' : 'hidden h-auto w-full text-foreground min-[801px]:block'}>
        <title id={`diagram-${id}-${suffix}-title`}>{title}</title>
        <desc id={`diagram-${id}-${suffix}-description`}>{description}</desc>
        <defs>
          <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 2 2 L 8 5 L 2 8" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></marker>
          <linearGradient id={`${arrowId}-surface`} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="var(--color-accent)" stopOpacity=".16" />
            <stop offset="1" stopColor="var(--color-accent)" stopOpacity=".025" />
          </linearGradient>
        </defs>
        {children({ mobile, arrowId })}
      </svg>
    })}
  </>
}

export function DiagramNode({ x, y, label, detail, icon = 'terminal', muted = false }: { x: number; y: number; label: string | string[]; detail?: string | string[]; icon?: string; muted?: boolean }) {
  const Icon = icons[icon] ?? Terminal
  const labels = Array.isArray(label) ? label : [label]
  const details = detail ? Array.isArray(detail) ? detail : [detail] : []
  return <g transform={`translate(${x} ${y})`} opacity={muted ? .45 : 1}>
    <rect x="-22" y="-22" width="44" height="44" rx="13" fill="var(--color-soft)" fillOpacity=".7" stroke="var(--color-accent)" strokeOpacity=".22" />
    {icon === 'process' || icon === 'kivgraph' ? <image href={icon === 'kivgraph' ? '/kivgraph-icon.svg' : '/mole-icon.webp'} x="-19" y="-19" width="38" height="38" /> : icon === 'browser' || icon === 'app' ? <g fill="none" stroke="var(--color-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-14" y="-11" width="28" height="23" rx="4" />
      <path d="M -14 -4 H 14" strokeOpacity=".5" />
      <circle cx="-9" cy="-7.5" r="1" fill="var(--color-accent)" stroke="none" /><circle cx="-5" cy="-7.5" r="1" fill="var(--color-accent)" fillOpacity=".45" stroke="none" />
      {icon === 'app' ? <path d="m -5 1 -4 3 4 3 M 5 1 l 4 3 -4 3" /> : <><rect x="-9" y="1" width="6" height="6" rx="1" fill="var(--color-accent)" fillOpacity=".25" stroke="none" /><path d="M 1 2 H 9 M 1 6 H 6" strokeOpacity=".7" /></>}
    </g> : icon === 'server' ? <g fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
      {[-11, 2].map(top => <g key={top}><rect x="-14" y={top} width="28" height="10" rx="3" /><circle cx="-8" cy={top + 5} r="1.5" fill="var(--color-accent)" stroke="none" /><path d={`M 2 ${top + 5} H 9`} strokeLinecap="round" strokeOpacity=".55" /></g>)}
    </g> : <Icon x={-13} y={-13} width={26} height={26} strokeWidth={1.7} className="text-accent" />}
    <text textAnchor="middle" fill="var(--color-heading)" fontSize="14" fontWeight="600">{labels.map((line, index) => <tspan key={index} x="0" y={38 + index * 19}>{line}</tspan>)}</text>
    {!!details.length && <text textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">{details.map((line, index) => <tspan key={index} x="0" y={labels.length * 19 + 42 + index * 17}>{line}</tspan>)}</text>}
  </g>
}

export function DiagramWire({ d, arrowId, label, x, y, dashed = false, active = true, arrow = 'end' }: { d: string; arrowId: string; label?: string; x?: number; y?: number; dashed?: boolean; active?: boolean; arrow?: 'end' | 'both' | 'none' }) {
  return <g>
    {d.split(/(?=M )/).filter(Boolean).map((segment, index) => <path key={index} d={segment} fill="none" stroke={active ? 'var(--color-accent)' : 'var(--color-line)'} strokeWidth={active ? '1.6' : '1.3'} strokeOpacity={active ? .68 : .75} strokeDasharray={dashed ? '2 6' : undefined} strokeLinecap="round" strokeLinejoin="round" markerEnd={arrow !== 'none' ? `url(#${arrowId})` : undefined} markerStart={arrow === 'both' ? `url(#${arrowId})` : undefined} />)}
    {label && <text x={x} y={y} textAnchor="middle" fill="var(--color-muted)" fontSize="11.5">{label}</text>}
  </g>
}
