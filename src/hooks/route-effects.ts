import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router'

export function useScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [pathname])
}

export function useScrollReveal() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: IntersectionObserver | undefined
    let frame: number | undefined

    const stop = () => {
      observer?.disconnect()
      if (frame !== undefined) cancelAnimationFrame(frame)
      document.documentElement.classList.remove('motion-ready')
    }
    const start = () => {
      stop()
      if (preference.matches) return

      observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement
            target.dataset.visible = 'true'
            observer?.unobserve(entry.target)
          }
        }
      }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' })

      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight - 50) {
          element.dataset.visible = 'true'
        } else {
          delete element.dataset.visible
          observer?.observe(element)
        }
      })
      frame = requestAnimationFrame(() => document.documentElement.classList.add('motion-ready'))
    }

    start()
    preference.addEventListener('change', start)
    return () => {
      stop()
      preference.removeEventListener('change', start)
    }
  }, [pathname])
}
