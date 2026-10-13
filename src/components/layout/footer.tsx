export function Footer() {
  return (
    <footer className="mx-auto flex w-[min(calc(100%_-_48px),700px)] justify-between gap-[18px] border-t border-line pt-[23px] pb-[32px] text-[11px] text-muted max-[641px]:flex-col max-[641px]:gap-[7px]">
      <span>© {new Date().getFullYear()} luqueee</span>
    </footer>
  )
}
