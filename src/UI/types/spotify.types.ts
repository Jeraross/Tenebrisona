export interface SpotifyTrack {
  id: string
  uri: string
  name: string
  artists: Array<{ name: string }>
  album: { name: string; images: Array<{ url: string }> }
  duration_ms: number
}

export interface SpotifySearchResult {
  tracks: {
    items: SpotifyTrack[]
    total: number
  }
}

export interface SpotifyPlayerState {
  isConnected: boolean
  accessToken: string | null
  currentTrack: SpotifyTrack | null
  isPlaying: boolean
  positionMs: number
}
