import type { Investigation, Investigator, Asset, Playlist, PlaylistItem, SessionLog } from '../renderer/src/types/investigation.types'
import type { AudioAnalysis } from '../renderer/src/types/audio.types'

export interface TenebrisonaAPI {
  // Investigations
  getInvestigations: () => Promise<Investigation[]>
  createInvestigation: (data: { title: string; type: 'oneshot' | 'campaign' }) => Promise<Investigation>
  updateInvestigation: (id: number, data: Partial<Investigation>) => Promise<void>
  archiveInvestigation: (id: number) => Promise<void>

  // Investigators
  getInvestigators: (investigationId: number) => Promise<Investigator[]>
  upsertInvestigator: (data: Omit<Investigator, 'id'> & { id?: number }) => Promise<Investigator>

  // Assets
  importAsset: (data: Omit<Asset, 'id'>) => Promise<Asset>
  getAllAssets: () => Promise<Asset[]>
  updateAsset: (id: number, data: Partial<Asset>) => Promise<void>
  deleteAsset: (id: number) => Promise<void>

  // Playlists
  createPlaylist: (data: Omit<Playlist, 'id'>) => Promise<Playlist>
  getPlaylists: (investigationId: number) => Promise<Playlist[]>
  addPlaylistItem: (data: Omit<PlaylistItem, 'id'>) => Promise<PlaylistItem>
  removePlaylistItem: (itemId: number) => Promise<void>

  // Audio
  analyzeAudio: (filePath: string) => Promise<AudioAnalysis>
  downloadAudio: (uri: string) => Promise<{ filePath: string; title: string }>

  // Spotify
  loginSpotify: () => Promise<void>
  searchSpotify: (query: string) => Promise<unknown>
  onSpotifyToken: (cb: (token: string) => void) => void

  // Session Log
  logEvent: (data: Omit<SessionLog, 'id' | 'timestamp'>) => Promise<void>
  getSessionLog: (investigationId: number) => Promise<SessionLog[]>
}

declare global {
  interface Window {
    api: TenebrisonaAPI
  }
}
