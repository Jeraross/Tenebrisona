import { BrowserWindow, net } from 'electron'

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID ?? ''
const REDIRECT_URI = 'http://localhost:8888/callback'
const SCOPES = ['streaming', 'user-read-playback-state', 'user-modify-playback-state', 'user-read-currently-playing']

let accessToken: string | null = null
let tokenRefreshCallback: ((token: string) => void) | null = null

export const SpotifyAuthService = {
  async startOAuth(mainWindow: BrowserWindow): Promise<void> {
    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        response_type: 'code',
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(' ')
      }).toString()

    const authWindow = new BrowserWindow({
      width: 500,
      height: 700,
      parent: mainWindow,
      modal: true,
      webPreferences: { nodeIntegration: false, contextIsolation: true }
    })

    authWindow.loadURL(authUrl)

    authWindow.webContents.on('will-redirect', (_event, url) => {
      if (url.startsWith(REDIRECT_URI)) {
        const code = new URL(url).searchParams.get('code')
        if (code) {
          SpotifyAuthService.exchangeCode(code).then((token) => {
            accessToken = token
            tokenRefreshCallback?.(token)
            authWindow.close()
          })
        }
      }
    })
  },

  async exchangeCode(code: string): Promise<string> {
    // Exchange auth code for access token via Spotify token endpoint.
    // Implementation requires SPOTIFY_CLIENT_SECRET set in env.
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI
    })

    const response = await net.fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
      },
      body: body.toString()
    })

    const data = (await response.json()) as { access_token: string }
    return data.access_token
  },

  async search(query: string): Promise<unknown> {
    if (!accessToken) throw new Error('Not authenticated with Spotify')
    const response = await net.fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,playlist&limit=20`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
    return response.json()
  },

  onTokenRefresh(callback: (token: string) => void): void {
    tokenRefreshCallback = callback
  }
}
