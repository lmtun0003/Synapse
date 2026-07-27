import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useGameStore } from '@/store/gameStore'
import type { CommunityPuzzle, CommunityPuzzleSort } from '@/types/game'

// ─── Star Rating Display ─────────────────────────────────────────────────────

function StarRow({ rating, size = 14, interactive = false, onRate }: {
  rating: number
  size?: number
  interactive?: boolean
  onRate?: (stars: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  const display = interactive && hovered > 0 ? hovered : rating

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.round(display)
        return (
          <motion.button
            key={i}
            className={clsx(
              'leading-none select-none transition-colors duration-100',
              interactive ? 'cursor-pointer' : 'cursor-default',
              filled ? 'text-amber-400' : 'text-white/20',
            )}
            style={{ fontSize: size }}
            onMouseEnter={() => interactive && setHovered(i + 1)}
            onMouseLeave={() => interactive && setHovered(0)}
            onClick={() => interactive && onRate?.(i + 1)}
            whileHover={interactive ? { scale: 1.2 } : {}}
            whileTap={interactive ? { scale: 0.9 } : {}}
          >
            ★
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Difficulty Pill ─────────────────────────────────────────────────────────

const DIFF_CONFIG = {
  easy:   { label: 'Easy',   variant: 'green'  as const },
  medium: { label: 'Medium', variant: 'blue'   as const },
  hard:   { label: 'Hard',   variant: 'amber'  as const },
  expert: { label: 'Expert', variant: 'red'    as const },
}

// ─── Puzzle Card ─────────────────────────────────────────────────────────────

function PuzzleCard({ cp, delay, onPlay }: {
  cp: CommunityPuzzle
  delay: number
  onPlay: (cp: CommunityPuzzle) => void
}) {
  const { myRatings } = useGameStore()
  const alreadyRated = !!myRatings[cp.id]
  const diff = DIFF_CONFIG[cp.difficulty]

  return (
    <GlassCard
      padding="none"
      rounded="2xl"
      animate
      delay={delay}
      className="overflow-hidden"
    >
      {/* Mini grid preview */}
      <div className="relative h-20 flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)' }}
      >
        {cp.featured && (
          <span className="absolute top-2 left-2">
            <Badge variant="blue" size="xs" glow>Featured</Badge>
          </span>
        )}
        <MiniGridPreview puzzle={cp.puzzle} />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-white font-semibold text-sm leading-tight">{cp.title}</h3>
          <Badge variant={diff.variant} size="xs">{diff.label}</Badge>
        </div>
        {cp.description && (
          <p className="text-white/40 text-xs mb-2 line-clamp-2">{cp.description}</p>
        )}

        {/* Author & stats */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0">
            {cp.authorName[0]}
          </div>
          <span className="text-white/40 text-xs">{cp.authorName}</span>
          <span className="text-white/15 text-xs">·</span>
          <span className="text-white/30 text-xs">{cp.playCount.toLocaleString()} plays</span>
        </div>

        {/* Rating row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <StarRow rating={cp.averageRating} size={12} />
            <span className="text-white/50 text-xs">
              {cp.averageRating > 0 ? cp.averageRating.toFixed(1) : '—'}
            </span>
            <span className="text-white/25 text-xs">({cp.ratingCount})</span>
          </div>
          {alreadyRated && (
            <span className="text-green-400 text-[10px]">✓ Rated</span>
          )}
        </div>

        {/* Tags */}
        {cp.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {cp.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-white/30 text-[10px] bg-white/4 px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="w-full mt-3"
          onClick={() => onPlay(cp)}
        >
          Play →
        </Button>
      </div>
    </GlassCard>
  )
}

// ─── Mini Grid Preview ────────────────────────────────────────────────────────

function MiniGridPreview({ puzzle }: { puzzle: CommunityPuzzle['puzzle'] }) {
  const dotSize = Math.min(8, Math.floor(44 / Math.max(puzzle.rows, puzzle.cols)))
  const gap = dotSize + 3

  return (
    <div
      className="relative"
      style={{
        width: puzzle.cols * gap,
        height: puzzle.rows * gap,
      }}
    >
      {puzzle.grid.map(node => {
        const color =
          node.type === 'source'   ? '#3B82F6' :
          node.type === 'target'   ? '#10B981' :
          node.type === 'mirror'   ? '#8B5CF6' :
          node.type === 'teleport' ? '#EC4899' :
          node.type === 'relay'    ? '#A78BFA' :
          node.type === 'inverter' ? '#EF4444' :
          node.type === 'gravity'  ? '#F59E0B' :
          'rgba(255,255,255,0.3)'

        return (
          <div
            key={node.id}
            className="absolute rounded-sm"
            style={{
              left: node.col * gap,
              top: node.row * gap,
              width: dotSize,
              height: dotSize,
              background: color,
              boxShadow: node.type !== 'basic' ? `0 0 ${dotSize}px ${color}80` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Sort & Filter Bar ────────────────────────────────────────────────────────

const SORTS: { id: CommunityPuzzleSort; label: string }[] = [
  { id: 'top',      label: '⭐ Top Rated' },
  { id: 'new',      label: '🆕 Newest' },
  { id: 'trending', label: '🔥 Trending' },
  { id: 'easy',     label: '🌱 Easiest' },
  { id: 'hard',     label: '💀 Hardest' },
]

const DIFF_FILTERS = ['All', 'Easy', 'Medium', 'Hard', 'Expert']
const TAG_FILTERS  = ['All', 'beginner', 'mirrors', 'teleport', 'inverter', 'gravity', 'advanced']

// ─── Main Page ────────────────────────────────────────────────────────────────

export function CommunityPage() {
  const navigate = useNavigate()
  const { communityPuzzles, startGame } = useGameStore()
  const [sort, setSort] = useState<CommunityPuzzleSort>('top')
  const [diffFilter, setDiffFilter] = useState('All')
  const [tagFilter, setTagFilter] = useState('All')
  const [search, setSearch] = useState('')

  const sorted = useMemo(() => {
    let list = [...communityPuzzles]

    if (diffFilter !== 'All') {
      list = list.filter(cp => cp.difficulty === diffFilter.toLowerCase())
    }
    if (tagFilter !== 'All') {
      list = list.filter(cp => cp.tags.includes(tagFilter))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(cp =>
        cp.title.toLowerCase().includes(q) ||
        cp.authorName.toLowerCase().includes(q) ||
        cp.tags.some(t => t.includes(q))
      )
    }

    switch (sort) {
      case 'top':      return list.sort((a, b) => b.averageRating - a.averageRating)
      case 'new':      return list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      case 'trending': return list.sort((a, b) => b.playCount - a.playCount)
      case 'easy':     return list.filter(cp => cp.difficulty === 'easy' || cp.difficulty === 'medium')
      case 'hard':     return list.filter(cp => cp.difficulty === 'hard' || cp.difficulty === 'expert')
      default:         return list
    }
  }, [communityPuzzles, sort, diffFilter, tagFilter, search])

  const featured = communityPuzzles.filter(cp => cp.featured)

  const handlePlay = (cp: CommunityPuzzle) => {
    startGame({ ...cp.puzzle, id: cp.id }, 'campaign')
    navigate('/play')
  }

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-5"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => navigate('/creator')}
          className="w-9 h-9 glass rounded-xl flex items-center justify-center text-white/60 hover:text-white"
        >←</button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">Community</h1>
          <p className="text-white/40 text-xs">{communityPuzzles.length} puzzles published</p>
        </div>
        <button
          onClick={() => navigate('/creator')}
          className="glass rounded-xl px-3 py-1.5 text-white/60 hover:text-white text-xs font-medium transition-colors"
        >
          + Publish
        </button>
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative mb-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search puzzles, creators, tags…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-white/20 border border-white/8"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-xs"
          >
            ✕
          </button>
        )}
      </motion.div>

      {/* Featured strip */}
      {featured.length > 0 && !search && (
        <motion.div
          className="mb-5"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-white/50 text-xs uppercase tracking-widest">Featured</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
            {featured.map((cp, i) => (
              <motion.div
                key={cp.id}
                className="flex-shrink-0 w-56 snap-start"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
              >
                <div
                  className="glass rounded-2xl p-4 border border-white/10 cursor-pointer hover:bg-white/8 transition-colors"
                  onClick={() => handlePlay(cp)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="blue" size="xs" glow>Featured</Badge>
                    <Badge variant={DIFF_CONFIG[cp.difficulty].variant} size="xs">
                      {DIFF_CONFIG[cp.difficulty].label}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center h-12 mb-3">
                    <MiniGridPreview puzzle={cp.puzzle} />
                  </div>
                  <div className="text-white font-semibold text-sm mb-0.5">{cp.title}</div>
                  <div className="text-white/40 text-xs mb-2">by {cp.authorName}</div>
                  <div className="flex items-center gap-1.5">
                    <StarRow rating={cp.averageRating} size={11} />
                    <span className="text-white/40 text-xs">{cp.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sort tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
        {SORTS.map(s => (
          <button
            key={s.id}
            onClick={() => setSort(s.id)}
            className={clsx(
              'flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
              sort === s.id
                ? 'bg-white/12 border-white/25 text-white'
                : 'glass border-white/8 text-white/40 hover:text-white/70'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Difficulty filter */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
        {DIFF_FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setDiffFilter(f)}
            className={clsx(
              'flex-shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border',
              diffFilter === f
                ? 'bg-white/10 border-white/20 text-white'
                : 'border-transparent text-white/30 hover:text-white/60'
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div className="text-white/30 text-xs mb-3">
        {sorted.length} puzzle{sorted.length !== 1 ? 's' : ''}
        {diffFilter !== 'All' && ` · ${diffFilter}`}
      </div>

      {/* Puzzle grid */}
      <AnimatePresence mode="wait">
        {sorted.length === 0 ? (
          <motion.div
            key="empty"
            className="glass rounded-2xl p-10 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-4xl mb-3">🔍</div>
            <div className="text-white font-semibold mb-1">No puzzles found</div>
            <div className="text-white/40 text-sm">Try a different search or filter.</div>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            className="grid grid-cols-2 gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {sorted.map((cp, i) => (
              <PuzzleCard key={cp.id} cp={cp} delay={i * 0.04} onPlay={handlePlay} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
