import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router'
import { Reveal } from './reveal'

const kenabot = {
  path: '/experience/kenabot',
  banner: '/images/kenabot/banner.webp',
  role: 'Fullstack & infrastructure',
  period: '2+ years',
  metrics: [
    { value: '300k+', label: 'Discord servers' },
    { value: '30M+', label: 'Users reached' },
  ],
  description: 'A multipurpose Discord bot. Welcomes, levels and creator alerts are set up from its web dashboard.',
} as const

function Feature() {
  return (
    <div>
      <Link to={kenabot.path} viewTransition className="group/kenabot relative block">
        <div className="mb-[14px] flex flex-wrap items-baseline justify-between gap-x-[16px] gap-y-[4px]">
          <h2 className="m-0 inline-flex items-center gap-[8px] font-heading text-[23px] leading-[1.1] font-bold tracking-[-.045em] text-heading group-hover/kenabot:text-accent">
            Kenabot
            <ArrowUpRight size={20} className="text-accent motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover/kenabot:translate-x-px motion-safe:group-hover/kenabot:-translate-y-px" />
          </h2>
          <p className="m-0 text-[12px] text-muted">{kenabot.role} · {kenabot.period}</p>
        </div>
        <div className="aspect-[1922/818] overflow-hidden rounded-[10px] border border-line">
          <img src={kenabot.banner} alt="Kenabot" width={1922} height={818} className="size-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-editorial motion-safe:group-hover/kenabot:scale-[1.02]" />
        </div>
        <div className="mt-[22px] grid grid-cols-[auto_minmax(0,1fr)] gap-x-[48px] gap-y-[18px] max-[641px]:grid-cols-1">
          <dl className="m-0 flex items-center gap-[32px] self-center">
            {kenabot.metrics.map(({ value, label }) => (
              <div key={label} className="flex flex-col-reverse gap-[6px]">
                <dt className="text-[12px] text-muted">{label}</dt>
                <dd className="m-0 font-heading text-[clamp(38px,8vw,52px)] leading-[.9] font-extrabold tracking-[-.06em] text-accent tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="grid content-center gap-[12px] border-l border-line pl-[32px] max-[641px]:border-l-0 max-[641px]:pl-0">
            <p className="m-0 max-w-[560px] text-[14px] leading-[1.7] text-muted">{kenabot.description}</p>
            {work}
          </div>
        </div>
      </Link>
    </div>
  )
}

const work = (
  <p className="m-0 text-[14px] leading-[1.7] text-muted">
    As part of the team, I work across the <strong className="font-semibold text-heading">frontend</strong>, the <strong className="font-semibold text-heading">backend</strong> and the <strong className="font-semibold text-heading">infrastructure</strong>.
  </p>
)

export function KenabotFeature() {
  return (
    <Reveal className="mt-[44px]">
      <Feature />
    </Reveal>
  )
}
