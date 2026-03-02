import { useState } from 'react'

/**
 * Settings — Configurações do Guardião
 *
 * App-level settings: audio device selection, Spotify credentials,
 * yt-dlp path, default session mode, etc.
 */
export default function Settings() {
  const [spotifyClientId, setSpotifyClientId] = useState('')

  const handleSpotifyLogin = async () => {
    await window.api.loginSpotify()
  }

  return (
    <div className="feature-settings">
      <h2>Configurações</h2>

      <section>
        <h3>Spotify</h3>
        <input
          type="text"
          placeholder="Client ID"
          value={spotifyClientId}
          onChange={(e) => setSpotifyClientId(e.target.value)}
        />
        <button onClick={handleSpotifyLogin}>Conectar Spotify</button>
      </section>

      {/* TODO: AudioDeviceSelector, YtDlpPathConfig, DefaultModeToggle, ThemeSelector */}
    </div>
  )
}
