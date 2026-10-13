import type { NowPlayingResponse } from '../src/types/now-playing'

const tokenUrl = 'https://accounts.spotify.com/api/token'
const playbackUrl = 'https://api.spotify.com/v1/me/player/currently-playing'
let accessToken: { value: string; expiresAt: number } | undefined
let refreshing: Promise<string> | undefined

type Playback = {
  is_playing: boolean
  currently_playing_type: string
  device?: { is_private_session: boolean }
  item: {
    type: string
    name: string
    is_local?: boolean
    artists: { name: string }[]
    album: { name: string; images: { url: string; width: number | null }[] }
    external_urls: { spotify?: string }
  } | null
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string) {
  if (accessToken && accessToken.expiresAt > Date.now()) return accessToken.value
  if (refreshing) return refreshing

  refreshing = (async () => {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
      signal: AbortSignal.timeout(5000),
    })
    if (!response.ok) throw new Error('Spotify authorization failed')
    const token = await response.json() as { access_token: string; expires_in: number }
    if (!token.access_token || !Number.isFinite(token.expires_in)) throw new Error('Invalid Spotify token response')
    accessToken = { value: token.access_token, expiresAt: Date.now() + Math.max(0, token.expires_in - 60) * 1000 }
    return token.access_token
  })()
  try {
    return await refreshing
  } finally {
    refreshing = undefined
  }
}

function playbackResponse(body: NowPlayingResponse) {
  return Response.json(body, { headers: { 'Cache-Control': 'public, max-age=0, s-maxage=15, must-revalidate' } })
}

export async function getNowPlaying(): Promise<Response> {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return Response.json({ error: 'spotify_not_configured' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }

  try {
    const token = await getAccessToken(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN)
    const response = await fetch(playbackUrl, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    })
    if (response.status === 204) return playbackResponse({ track: null })
    if (response.status === 401) accessToken = undefined
    if (response.status === 429) {
      return Response.json({ error: 'spotify_rate_limited' }, {
        status: 429,
        headers: { 'Cache-Control': 'no-store', 'Retry-After': response.headers.get('Retry-After') ?? '30' },
      })
    }
    if (!response.ok) throw new Error('Spotify playback unavailable')
    const playback = await response.json() as Playback
    const item = playback.item
    if (!playback.is_playing || playback.device?.is_private_session || playback.currently_playing_type !== 'track' || !item || item.type !== 'track' || item.is_local || !item.external_urls.spotify) {
      return playbackResponse({ track: null })
    }
    const images = item.album.images
    const artwork = images.find((image) => image.width !== null && image.width >= 64 && image.width <= 300) ?? images[0]
    return playbackResponse({ track: {
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(', '),
      album: item.album.name,
      artwork: artwork?.url ?? null,
      url: item.external_urls.spotify,
    } })
  } catch {
    // Never forward upstream bodies: token responses can contain credentials.
    return Response.json({ error: 'spotify_unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } })
  }
}
