import { randomBytes } from 'node:crypto'
import { createServer } from 'node:http'
import { chmod, readFile, writeFile } from 'node:fs/promises'

const clientId = process.env.SPOTIFY_CLIENT_ID
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET
if (!clientId || !clientSecret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.')
  process.exit(1)
}

const redirectUri = 'http://127.0.0.1:8888/callback'
const state = randomBytes(32).toString('hex')
let exchanging = false
const server = createServer(async (request, response) => {
  response.setHeader('Cache-Control', 'no-store')
  response.setHeader('Referrer-Policy', 'no-referrer')
  const url = new URL(request.url, redirectUri)
  if (request.method !== 'GET' || url.pathname !== '/callback') {
    response.writeHead(404).end('Not found')
    return
  }
  if (url.searchParams.get('state') !== state || exchanging) {
    response.writeHead(400).end('Invalid authorization state. Use the link printed in your terminal.')
    return
  }
  if (url.searchParams.has('error') || !url.searchParams.get('code')) {
    response.writeHead(400).end('Authorization was not granted. You can rerun the setup command.')
    console.error('Spotify authorization was not granted.')
    process.exitCode = 1
    server.close()
    return
  }
  exchanging = true
  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code'), redirect_uri: redirectUri }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!tokenResponse.ok) throw new Error('Spotify rejected authorization. Check the app credentials and redirect URI.')
    const token = await tokenResponse.json()
    if (!token.refresh_token || !token.scope?.split(' ').includes('user-read-currently-playing')) {
      throw new Error('Spotify did not grant a refresh token with the required permission.')
    }
    let environment = ''
    try { environment = await readFile('.env.local', 'utf8') } catch (error) { if (error.code !== 'ENOENT') throw error }
    const entry = `SPOTIFY_REFRESH_TOKEN=${token.refresh_token}`
    environment = /^SPOTIFY_REFRESH_TOKEN=.*$/m.test(environment)
      ? environment.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, entry)
      : `${environment.trimEnd()}\n${entry}\n`
    await writeFile('.env.local', environment, { mode: 0o600 })
    await chmod('.env.local', 0o600)
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Spotify connected. You can close this tab. Your refresh token is saved locally, not displayed here.')
    console.log('Authorization complete. Refresh token saved to .env.local; do not commit this file.')
  } catch (error) {
    response.writeHead(500).end('Authorization failed. Check your terminal and rerun the setup command.')
    console.error(error instanceof Error ? error.message : 'Spotify authorization failed')
    process.exitCode = 1
  } finally {
    server.close()
  }
})

server.on('error', () => {
  console.error('Could not start the callback server on 127.0.0.1:8888. Check that this port is available.')
  process.exitCode = 1
})
server.listen(8888, '127.0.0.1', () => {
  const query = new URLSearchParams({ client_id: clientId, response_type: 'code', redirect_uri: redirectUri, scope: 'user-read-currently-playing', state, show_dialog: 'true' })
  console.log(`Open this link in your browser to authorize your account:\nhttps://accounts.spotify.com/authorize?${query}`)
})
setTimeout(() => {
  console.error('Authorization timed out. Rerun the command when ready.')
  process.exitCode = 1
  server.close()
}, 5 * 60_000).unref()
