/**
 * Supabase client stub.
 *
 * Wire `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` to enable:
 * - Auth (Apple / Google / email)
 * - Realtime duels + ranked presence
 * - Leaderboards & cloud sync
 * - Puzzle sharing storage
 *
 * The game remains fully playable offline without these keys.
 */

export interface SynapseCloudClient {
  enabled: boolean
  url: string | null
}

export function getSupabaseConfig(): SynapseCloudClient {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
  return {
    enabled: Boolean(url && anon),
    url: url ?? null,
  }
}

export const cloud = getSupabaseConfig()
