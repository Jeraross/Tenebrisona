import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  // --- Investigations ---
  getInvestigations: () => ipcRenderer.invoke('investigation:getAll'),
  createInvestigation: (data: { title: string; type: 'oneshot' | 'campaign' }) =>
    ipcRenderer.invoke('investigation:create', data),
  updateInvestigation: (id: number, data: object) =>
    ipcRenderer.invoke('investigation:update', id, data),
  archiveInvestigation: (id: number) => ipcRenderer.invoke('investigation:archive', id),

  // --- Investigators ---
  getInvestigators: (investigationId: number) =>
    ipcRenderer.invoke('investigator:getByInvestigation', investigationId),
  upsertInvestigator: (data: object) => ipcRenderer.invoke('investigator:upsert', data),

  // --- Assets (Library) ---
  importAsset: (data: object) => ipcRenderer.invoke('asset:import', data),
  getAllAssets: () => ipcRenderer.invoke('asset:getAll'),
  updateAsset: (id: number, data: object) => ipcRenderer.invoke('asset:update', id, data),
  deleteAsset: (id: number) => ipcRenderer.invoke('asset:delete', id),

  // --- Playlists ---
  createPlaylist: (data: object) => ipcRenderer.invoke('playlist:create', data),
  getPlaylists: (investigationId: number) =>
    ipcRenderer.invoke('playlist:getByInvestigation', investigationId),
  addPlaylistItem: (data: object) => ipcRenderer.invoke('playlist:addItem', data),
  removePlaylistItem: (itemId: number) => ipcRenderer.invoke('playlist:removeItem', itemId),

  // --- Audio ---
  analyzeAudio: (filePath: string) => ipcRenderer.invoke('audio:analyze', filePath),
  downloadAudio: (uri: string) => ipcRenderer.invoke('audio:download', uri),

  // --- Spotify ---
  loginSpotify: () => ipcRenderer.invoke('spotify:login'),
  searchSpotify: (query: string) => ipcRenderer.invoke('spotify:search', query),
  onSpotifyToken: (cb: (token: string) => void) =>
    ipcRenderer.on('spotify:token', (_event, token) => cb(token)),

  // --- Session Log ---
  logEvent: (data: object) => ipcRenderer.invoke('session:log', data),
  getSessionLog: (investigationId: number) =>
    ipcRenderer.invoke('session:getLog', investigationId)
})
