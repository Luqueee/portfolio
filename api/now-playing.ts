import { getNowPlaying } from '../server/spotify.js'

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== 'GET') {
      return new Response(null, { status: 405, headers: { Allow: 'GET', 'Cache-Control': 'no-store' } })
    }
    return getNowPlaying()
  },
}
