/** Safe localStorage helpers for offline progress + cloud-sync-ready snapshots. */

export function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return { ...fallback, ...JSON.parse(raw) } as T
  } catch {
    return fallback
  }
}

export function saveJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota or private mode — progress stays in-memory for the session.
  }
}

export const STORAGE_KEYS = {
  player: 'synapse.player.v1',
  settings: 'synapse.settings.v1',
  creator: 'synapse.creator.v1',
} as const
