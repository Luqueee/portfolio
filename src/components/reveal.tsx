import type { ReactNode } from 'react'

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal data-visible="false" className={`motion-ready:translate-y-[28px] motion-ready:opacity-0 motion-ready:blur-[5px] motion-ready:transition-[opacity,translate,filter] motion-ready:duration-750 motion-ready:ease-editorial motion-ready:data-[visible=true]:translate-y-0 motion-ready:data-[visible=true]:opacity-100 motion-ready:data-[visible=true]:blur-none motion-reduce:translate-y-0! motion-reduce:opacity-100! motion-reduce:blur-none! motion-reduce:transition-none ${className ?? ''}`}>
      {children}
    </div>
  )
}
