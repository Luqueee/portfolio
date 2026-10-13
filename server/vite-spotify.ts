import { loadEnv, type Connect, type Plugin } from 'vite'
import nowPlaying from '../api/now-playing'

export function spotifyApi(): Plugin {
  const middleware: Connect.NextHandleFunction = (request, response, next) => {
    if (request.url?.split('?')[0].replace(/\/$/, '') !== '/api/now-playing') return next()
    void nowPlaying.fetch(new Request('http://localhost/api/now-playing', { method: request.method })).then(async (result) => {
      response.writeHead(result.status, Object.fromEntries(result.headers))
      response.end(Buffer.from(await result.arrayBuffer()))
    }).catch(next)
  }

  return {
    name: 'portfolio-spotify-api',
    configResolved(config) {
      const values = loadEnv(config.mode, config.envDir, 'SPOTIFY_')
      for (const key of ['SPOTIFY_CLIENT_ID', 'SPOTIFY_CLIENT_SECRET', 'SPOTIFY_REFRESH_TOKEN']) {
        if (values[key]) process.env[key] ??= values[key]
      }
    },
    configureServer(server) { server.middlewares.use(middleware) },
    configurePreviewServer(server) { server.middlewares.use(middleware) },
  }
}
