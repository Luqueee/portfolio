import type { ReactNode } from 'react'
import { Reveal } from './reveal'

type SectionProps = {
  index: string
  title: string
  id: string
  children: ReactNode
  className?: string
}

export function Section({ index, title, id, children, className }: SectionProps) {
  return (
    <section aria-labelledby={id} className={`mt-[83px] max-[641px]:mt-[69px] ${className ?? ''}`}>
      <Reveal>
        <div className="flex items-baseline gap-[19px] border-t border-line pt-[21px]">
          <span className="font-heading text-[11px] font-bold tracking-[.03em] whitespace-nowrap text-accent">{index} /</span>
          <h2 id={id} className="m-0 font-heading text-[19px] leading-[1.45] font-bold tracking-[-.04em] text-heading">{title}</h2>
        </div>
        {children}
      </Reveal>
    </section>
  )
}
