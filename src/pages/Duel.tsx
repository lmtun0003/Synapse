import { Link } from 'react-router-dom'
import { GlassPanel } from '@/components/ui/GlassPanel'
import { Button } from '@/components/ui/Button'

export function DuelPage() {
  return (
    <div className="py-6">
      <p className="text-xs uppercase tracking-[0.3em] text-faint">Duel</p>
      <h1 className="mt-2 text-3xl font-light tracking-tight">Two minds. One board.</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Solve simultaneously. See only opponent progress — never their solution path.
      </p>

      <GlassPanel className="mt-8" padding="lg">
        <h2 className="text-xl font-light">Private match</h2>
        <p className="mt-2 text-sm text-muted">
          Local duel simulation is ready. Realtime matchmaking hooks into Supabase Presence when configured.
        </p>
        <div className="mt-6">
          <Link to="/play/duel">
            <Button size="lg">Find opponent</Button>
          </Link>
        </div>
      </GlassPanel>
    </div>
  )
}
