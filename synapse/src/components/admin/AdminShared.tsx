// ─── Shared Admin UI primitives ─────────────────────────────────────────────
import { clsx } from 'clsx'
import type { ReactNode, InputHTMLAttributes } from 'react'

export function AdminLabel({ children }: { children: ReactNode }) {
  return <label className="block text-white/50 text-xs uppercase tracking-wider mb-1.5">{children}</label>
}

export function AdminInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        'w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-white',
        'placeholder-white/25 focus:outline-none focus:border-blue-500/50 focus:bg-white/8',
        'transition-colors duration-150',
        className
      )}
      {...props}
    />
  )
}

export function AdminTextarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        'w-full bg-white/5 border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-white',
        'placeholder-white/25 focus:outline-none focus:border-blue-500/50 focus:bg-white/8',
        'transition-colors duration-150 resize-none',
        className
      )}
      {...props}
    />
  )
}

export function AdminSelect({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select
      className={clsx(
        'w-full bg-[#18181f] border border-white/12 rounded-xl px-3.5 py-2.5 text-sm text-white',
        'focus:outline-none focus:border-blue-500/50 transition-colors duration-150',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export function AdminToggle({ enabled, onChange, label, description }: {
  enabled: boolean; onChange: () => void; label: string; description?: string
}) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/6 last:border-0">
      <div>
        <div className="text-white/80 text-sm">{label}</div>
        {description && <div className="text-white/30 text-xs mt-0.5">{description}</div>}
      </div>
      <button
        onClick={onChange}
        className={clsx(
          'relative w-10 h-5.5 rounded-full transition-all duration-300 flex-shrink-0',
          enabled ? 'bg-blue-500' : 'bg-white/15'
        )}
        style={{ height: 22 }}
      >
        <div className={clsx(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300',
          enabled ? 'left-5.5' : 'left-0.5'
        )} style={{ left: enabled ? 22 : 2 }} />
      </button>
    </div>
  )
}

export function AdminCard({ children, title, className }: { children: ReactNode; title?: string; className?: string }) {
  return (
    <div className={clsx('bg-white/3 border border-white/8 rounded-2xl overflow-hidden', className)}>
      {title && (
        <div className="px-5 py-3 border-b border-white/6 flex items-center justify-between">
          <span className="text-white/70 text-sm font-semibold">{title}</span>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}

export function AdminSaveBar({ onSave, onReset, saved, dirty }: {
  onSave: () => void; onReset: () => void; saved: boolean; dirty: boolean
}) {
  return (
    <div className={clsx(
      'sticky bottom-0 flex items-center justify-between px-4 py-3 border-t border-white/8 transition-all',
      'bg-[#0D0D10]/95 backdrop-blur-xl',
      dirty ? 'opacity-100' : 'opacity-40 pointer-events-none'
    )}>
      <div className="text-white/40 text-xs">{saved ? '✓ Saved' : 'Unsaved changes'}</div>
      <div className="flex gap-2">
        <button
          onClick={onReset}
          className="px-4 py-1.5 rounded-xl text-sm text-white/50 hover:text-white border border-white/10 hover:bg-white/8 transition-all"
        >
          Reset
        </button>
        <button
          onClick={onSave}
          className="px-5 py-1.5 rounded-xl text-sm text-white bg-blue-500 hover:bg-blue-400 transition-colors shadow-[0_0_12px_rgba(59,130,246,0.4)]"
        >
          Save Changes
        </button>
      </div>
    </div>
  )
}

export function StatPill({ label, value, color = 'blue' }: { label: string; value: string | number; color?: 'blue' | 'green' | 'amber' | 'red' }) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    green: 'text-green-400 bg-green-500/10 border-green-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
  }
  return (
    <div className={clsx('px-3 py-1.5 rounded-xl border text-center', colors[color])}>
      <div className="text-sm font-bold">{value}</div>
      <div className="text-[10px] opacity-70">{label}</div>
    </div>
  )
}
