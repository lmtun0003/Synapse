import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function signInAnonymously() {
  const { data, error } = await supabase.auth.signInAnonymously()
  return { data, error }
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUpWithEmail(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function submitDailyScore(userId: string, puzzleDate: string, moveCount: number, timeMs: number) {
  const { data, error } = await supabase
    .from('daily_scores')
    .upsert({ user_id: userId, puzzle_date: puzzleDate, move_count: moveCount, time_ms: timeMs }, { onConflict: 'user_id,puzzle_date' })
  return { data, error }
}

export async function getDailyLeaderboard(puzzleDate: string, limit = 100) {
  const { data, error } = await supabase
    .from('daily_scores')
    .select('*, profiles(username, display_name, avatar_url)')
    .eq('puzzle_date', puzzleDate)
    .order('move_count', { ascending: true })
    .order('time_ms', { ascending: true })
    .limit(limit)
  return { data, error }
}

export async function getGlobalLeaderboard(limit = 100) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, elo, total_solved, total_perfect')
    .order('elo', { ascending: false })
    .limit(limit)
  return { data, error }
}

// ─── Puzzle Sharing ────────────────────────────────────────────────────────

export async function sharePuzzle(puzzle: object, authorId: string) {
  const shareCode = generateShareCode()
  const { data, error } = await supabase
    .from('community_puzzles')
    .insert({ puzzle_data: puzzle, author_id: authorId, share_code: shareCode })
  return { data, error, shareCode }
}

export async function getPuzzleByCode(shareCode: string) {
  const { data, error } = await supabase
    .from('community_puzzles')
    .select('*')
    .eq('share_code', shareCode)
    .single()
  return { data, error }
}

function generateShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// ─── Realtime Duel ───────────────────────────────────────────────────────────

export function subscribeToDuel(
  duelId: string,
  onProgress: (payload: { userId: string; moveCount: number; completed: boolean }) => void
) {
  return supabase
    .channel(`duel:${duelId}`)
    .on('broadcast', { event: 'progress' }, ({ payload }) => onProgress(payload as any))
    .subscribe()
}

export async function broadcastDuelProgress(
  duelId: string,
  userId: string,
  moveCount: number,
  completed: boolean
) {
  await supabase.channel(`duel:${duelId}`).send({
    type: 'broadcast',
    event: 'progress',
    payload: { userId, moveCount, completed },
  })
}
