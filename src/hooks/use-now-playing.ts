import { useEffect, useState } from 'react'
import type { NowPlayingResponse, NowPlayingTrack } from '../types/now-playing'

export function useNowPlaying() {
  const [track, setTrack] = useState<NowPlayingTrack | null>(null)

  useEffect(() => {
    let controller: AbortController | undefined
    let timer: number | undefined
    let disposed = false

    async function update() {
      if (document.hidden || disposed) return
      controller?.abort()
      const request = new AbortController()
      controller = request
      let delay = 30_000
      try {
        const response = await fetch('/api/now-playing', { signal: request.signal })
        if (response.status === 429) {
          const seconds = Number(response.headers.get('Retry-After'))
          if (Number.isFinite(seconds) && seconds > 0) delay = Math.max(delay, seconds * 1000)
        }
        if (!response.ok) throw new Error('Now playing unavailable')
        const data = await response.json() as NowPlayingResponse
        if (!disposed && !request.signal.aborted) setTrack(data.track)
      } catch {
        // Do not keep advertising an old song when its live state is unknown.
        if (!disposed && !request.signal.aborted) setTrack(null)
      } finally {
        if (!disposed && !request.signal.aborted && !document.hidden) timer = window.setTimeout(() => void update(), delay)
      }
    }

    function visibilityChanged() {
      clearTimeout(timer)
      controller?.abort()
      if (!document.hidden) void update()
    }

    void update()
    document.addEventListener('visibilitychange', visibilityChanged)
    return () => {
      disposed = true
      clearTimeout(timer)
      controller?.abort()
      document.removeEventListener('visibilitychange', visibilityChanged)
    }
  }, [])

  return track
}
