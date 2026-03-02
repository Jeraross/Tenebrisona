import type { SpotifyPlayerState, SpotifyTrack } from '../types/spotify.types'

type StateListener = (state: SpotifyPlayerState) => void

/**
 * SpotifyPlayer — wraps the Spotify Web Playback SDK.
 *
 * Initialized once in App.tsx after the OAuth token is received via IPC.
 * Keeps its own state and notifies React via registered listeners (no direct
 * React state coupling — the spotify.store subscribes here).
 */
class SpotifyPlayerClass {
  private static instance: SpotifyPlayerClass
  private player: Spotify.Player | null = null
  private listeners: StateListener[] = []
  state: SpotifyPlayerState = {
    isConnected: false,
    accessToken: null,
    currentTrack: null,
    isPlaying: false,
    positionMs: 0
  }

  private constructor() {}

  static getInstance(): SpotifyPlayerClass {
    if (!SpotifyPlayerClass.instance) {
      SpotifyPlayerClass.instance = new SpotifyPlayerClass()
    }
    return SpotifyPlayerClass.instance
  }

  init(token: string): void {
    if (this.player) return

    this.state.accessToken = token

    // Spotify SDK must be loaded via <script> in index.html
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.player = new Spotify.Player({
        name: 'Tenebrisona',
        getOAuthToken: (cb) => cb(token),
        volume: 0.8
      })

      this.player.addListener('ready', ({ device_id }) => {
        console.log('[SpotifyPlayer] Ready, device_id:', device_id)
        this.setState({ isConnected: true })
      })

      this.player.addListener('not_ready', () => {
        this.setState({ isConnected: false })
      })

      this.player.addListener('player_state_changed', (state) => {
        if (!state) return
        const track = state.track_window.current_track
        this.setState({
          isPlaying: !state.paused,
          positionMs: state.position,
          currentTrack: track as unknown as SpotifyTrack
        })
      })

      this.player.connect()
    }
  }

  onStateChange(listener: StateListener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private setState(partial: Partial<SpotifyPlayerState>): void {
    this.state = { ...this.state, ...partial }
    this.listeners.forEach((l) => l(this.state))
  }

  async togglePlay(): Promise<void> {
    await this.player?.togglePlay()
  }

  async seek(positionMs: number): Promise<void> {
    await this.player?.seek(positionMs)
  }

  async setVolume(fraction: number): Promise<void> {
    await this.player?.setVolume(fraction)
  }

  disconnect(): void {
    this.player?.disconnect()
    this.player = null
    this.setState({ isConnected: false })
  }
}

export const SpotifyPlayer = SpotifyPlayerClass.getInstance()
