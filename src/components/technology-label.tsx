import { technologies, type Technology } from '../data/profile'

export function TechnologyLabel({ name, inline = false }: { name: Technology; inline?: boolean }) {
  const appearance = inline
    ? 'rounded-[4px] px-[5px] py-[2px] text-[.9em] text-heading whitespace-nowrap'
    : 'rounded-[5px] px-[12px] py-[7px] text-[12px] font-semibold text-foreground transition-[translate,background-color] duration-300 ease-[cubic-bezier(.22,1,.36,1),ease] hover:-translate-y-[3px] hover:bg-[#38433a] motion-reduce:transition-none'
  const iconWidth = name === 'Go' ? 'w-[23px]' : 'w-[15px]'
  return (
    <span className={`inline-flex items-center gap-[5px] bg-soft align-baseline ${appearance}`}>
      <img className={`h-[15px] flex-none object-contain ${iconWidth}`} src={`https://svgl.app/library/${technologies[name]}`} alt="" aria-hidden="true" width="15" height="15" />
      {name}
    </span>
  )
}
