import { create } from 'zustand'
import type { Asset, Playlist } from '../types/investigation.types'

export type SessionMode = 'prep' | 'live'

interface AudioState {
  assets: Asset[]
  playlists: Playlist[]
  activePlaylist: Playlist | null
  currentTrack: Asset | null
  sessionMode: SessionMode
  isPlaying: boolean

  setAssets: (assets: Asset[]) => void
  addAsset: (asset: Asset) => void
  updateAsset: (id: number, data: Partial<Asset>) => void
  removeAsset: (id: number) => void

  setPlaylists: (playlists: Playlist[]) => void
  setActivePlaylist: (playlist: Playlist | null) => void
  setCurrentTrack: (track: Asset | null) => void
  setPlaying: (playing: boolean) => void
  setSessionMode: (mode: SessionMode) => void
}

export const useAudioStore = create<AudioState>((set) => ({
  assets: [],
  playlists: [],
  activePlaylist: null,
  currentTrack: null,
  sessionMode: 'prep',
  isPlaying: false,

  setAssets: (assets) => set({ assets }),
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  updateAsset: (id, data) =>
    set((state) => ({ assets: state.assets.map((a) => (a.id === id ? { ...a, ...data } : a)) })),
  removeAsset: (id) => set((state) => ({ assets: state.assets.filter((a) => a.id !== id) })),

  setPlaylists: (playlists) => set({ playlists }),
  setActivePlaylist: (playlist) => set({ activePlaylist: playlist }),
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setSessionMode: (mode) => set({ sessionMode: mode })
}))
