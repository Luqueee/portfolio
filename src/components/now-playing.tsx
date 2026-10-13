import { ArrowUpRight, Music2 } from 'lucide-react'
import { ExternalLink } from './external-link'
import { useNowPlaying } from '../hooks/use-now-playing'

export function NowPlaying() {
  const track = useNowPlaying()
  if (!track) return null

  return (
    <aside aria-label="Currently listening on Spotify" className="mt-8 [&+section]:mt-8">
      <ExternalLink href={track.url} className="group/listening inline-flex max-w-full items-center gap-4">
        {track.artwork ? (
          <img src={track.artwork} alt={`Album cover: ${track.album}`} width={56} height={56} className="size-14 flex-none rounded-sm" />
        ) : (
          <span aria-hidden="true" className="flex size-14 flex-none items-center justify-center rounded-sm bg-soft text-muted"><Music2 size={22} /></span>
        )}
        <span className="min-w-0">
          <span className="mb-1 block text-[10px] font-bold tracking-[.08em] text-accent uppercase">
            <img src="https://svgl.app/library/spotify.svg" alt="" aria-hidden="true" width={12} height={12} className="mr-1 inline size-3 align-[-2px]" />
            Listening to · Spotify
          </span>
          <span className="block truncate text-[14px] font-semibold text-heading">{track.title}</span>
          <span className="mt-1 block truncate text-[12px] text-muted">{track.artist}</span>
        </span>
        <ArrowUpRight size={15} aria-hidden="true" className="ml-1 flex-none text-muted group-hover/listening:text-accent" />
      </ExternalLink>
    </aside>
  )
}
