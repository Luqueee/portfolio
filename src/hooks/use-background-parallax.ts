import { useEffect } from 'react'

export function useBackgroundParallax() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame: number | undefined

    function update() {
      frame = undefined
      // The repeated 17px pattern permits wrapping without growing the layer.
      document.body.style.setProperty('--background-offset', `${-(window.scrollY * 0.08 % 17)}px`)
    }
    function scroll() {
      if (frame === undefined) frame = requestAnimationFrame(update)
    }
    function configure() {
      window.removeEventListener('scroll', scroll)
      if (frame !== undefined) cancelAnimationFrame(frame)
      frame = undefined
      document.body.style.removeProperty('--background-offset')
      if (!preference.matches) {
        update()
        window.addEventListener('scroll', scroll, { passive: true })
      }
    }

    configure()
    preference.addEventListener('change', configure)
    return () => {
      window.removeEventListener('scroll', scroll)
      preference.removeEventListener('change', configure)
      if (frame !== undefined) cancelAnimationFrame(frame)
      document.body.style.removeProperty('--background-offset')
    }
  }, [])
}
