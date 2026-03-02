export interface Investigation {
  id: number
  title: string
  type: 'oneshot' | 'campaign'
  created_at: string
  archived: 0 | 1
}

export interface Investigator {
  id: number
  investigation_id: number
  player_name: string
  character_name: string
  sanity: number
  status: 'alive' | 'dead' | 'insane'
}

export interface Asset {
  id: number
  title: string
  file_path: string | null
  spotify_uri: string | null
  type: 'music' | 'ambience' | 'sfx' | 'voice'
  volume: number
  start_ms: number
  end_ms: number | null
  bpm: number | null
  key: string | null
}

export interface Playlist {
  id: number
  investigation_id: number
  name: string
  mode: 'loop' | 'oneshot'
}

export interface PlaylistItem {
  id: number
  playlist_id: number
  asset_id: number
  position: number
}

export interface SessionLog {
  id: number
  investigation_id: number
  timestamp: string
  event_type: SessionEventType
  payload_json: string | null
}

export type SessionEventType =
  | 'sanity_change'
  | 'threshold_crossed'
  | 'madness_triggered'
  | 'mythos_level_change'
  | 'track_played'
  | 'sfx_fired'
  | 'push_roll_start'
  | 'push_roll_success'
  | 'push_roll_fail'
  | 'session_start'
  | 'session_end'
