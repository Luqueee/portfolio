export type NowPlayingTrack = {
  title: string
  artist: string
  album: string
  artwork: string | null
  url: string
}

export type NowPlayingResponse = { track: NowPlayingTrack | null }
