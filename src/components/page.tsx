import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

type ContentProps = {
  children: ReactNode
  className?: string
}

type AnimatedProps = {
  children: ReactNode
  animate?: boolean
}

export function PageContent({ children, className }: ContentProps) {
  const spacing = className ?? 'mt-[93px] max-[641px]:mt-[71px]'
  return <main className={`mx-auto w-[min(calc(100%_-_48px),900px)] flex-1 ${spacing}`}>{children}</main>
}

export function PageHeading({ children, animate = false }: AnimatedProps) {
  const animation = animate ? 'motion-ready:motion-safe:animate-[rise-in_.85s_.08s_var(--ease-editorial)_both]' : ''
  return (
    <h1 className={`mt-[29px] mb-[13px] font-heading text-[clamp(40px,6.6vw,62px)] leading-[1.16] font-extrabold tracking-[-.068em] text-heading max-[641px]:mt-[26px] ${animation}`}>
      {children}<span className="text-period">.</span>
    </h1>
  )
}

export function Lead({ children, className, animate = false }: ContentProps & { animate?: boolean }) {
  const spacing = className ?? 'mb-[38px] max-[641px]:mb-[32px]'
  const animation = animate ? 'motion-ready:motion-safe:animate-[rise-in_.85s_.18s_var(--ease-editorial)_both]' : ''
  return <p className={`mt-0 max-w-[620px] text-[clamp(18px,2.2vw,22px)] leading-[1.55] tracking-[-.025em] text-muted ${spacing} ${animation}`}>{children}</p>
}

export function Eyebrow({ children, animate = false }: AnimatedProps) {
  const animation = animate ? 'motion-ready:motion-safe:animate-[rise-in_.65s_var(--ease-editorial)_both]' : ''
  const number = animate ? 'text-[12px] tracking-normal' : ''
  return (
    <div className={`flex items-center gap-[10px] text-[11px] font-bold tracking-[.12em] text-accent uppercase ${animation}`}>
      <span className={number}>/ 01</span> {children} <span className="ml-[10px] h-px flex-1 bg-line" />
    </div>
  )
}

export function BackLink({ to, children, className }: ContentProps & { to: string }) {
  return (
    <Link to={to} viewTransition className={`group/back inline-flex items-center gap-[8px] border-b border-line pb-[5px] text-[13px] font-bold text-heading hover:border-accent hover:text-accent motion-safe:transition-[color,translate,scale] motion-safe:duration-[200ms,250ms,120ms] motion-safe:ease-[ease,var(--ease-editorial),ease] motion-safe:active:scale-[.97] ${className ?? ''}`}>
      {children}<ArrowRight size={16} className="motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[ease] motion-safe:group-hover/back:translate-x-px motion-safe:group-focus-visible/back:translate-x-px" />
    </Link>
  )
}
