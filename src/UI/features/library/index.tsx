import { useEffect } from 'react'
import { useAudioStore } from '../../stores/audio.store'

/**
 * Library — Liber Azathoth (Tela de Início)
 *
 * Central audio asset management. Import local files (drag-and-drop) or
 * search/download from external sources. Non-destructive editing (volume,
 * trim points). Auto-analysis: BPM + key on import.
 */
export default function Library() {
  const { assets, setAssets } = useAudioStore()

  useEffect(() => {
    window.api.getAllAssets().then(setAssets)
  }, [setAssets])

  const handleImport = async (filePath: string, title: string) => {
    const analysis = await window.api.analyzeAudio(filePath)
    const asset = await window.api.importAsset({
      title,
      file_path: filePath,
      spotify_uri: null,
      type: 'music',
      volume: 1.0,
      start_ms: 0,
      end_ms: null,
      bpm: analysis.bpm,
      key: analysis.key
    })
    useAudioStore.getState().addAsset(asset)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files)
    files.forEach((file) => handleImport(file.path ?? file.name, file.name.replace(/\.[^.]+$/, '')))
  }

  return (
    <div
      className="feature-library"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <h2>Liber Azathoth</h2>
      {/* TODO: AssetGrid, AssetCard, WaveformEditor, BPMBadge, SpotifySearch, DownloadQueue */}
      <p style={{ opacity: 0.5 }}>{assets.length} assets carregados</p>
    </div>
  )
}
