import type { ReactNode } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Outlet } from 'react-router'
import { Header } from '../components/layout/header'
import { Footer } from '../components/layout/footer'
import { PageMetadata } from './page-metadata'
import { useScrollReveal, useScrollToTop } from '../hooks/route-effects'
import { useBackgroundParallax } from '../hooks/use-background-parallax'

export function SiteLayout({ children }: { children?: ReactNode }) {
  useScrollToTop()
  useScrollReveal()
  useBackgroundParallax()

  return (
    <>
      <PageMetadata />
      <div className="flex min-h-screen flex-col">
        <Header />
        {children ?? <Outlet />}
        <Footer />
      </div>
      <Analytics />
    </>
  )
}
