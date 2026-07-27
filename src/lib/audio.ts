/**
 * Lightweight Web Audio synth for subtle interaction SFX.
 * No external assets required — keeps the bundle tiny and offline-friendly.
 */

type SoundKind = 'tap' | 'signal' | 'success' | 'fail' | 'ui'

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let enabled = true
let volume = 0.45

function ensureCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
    masterGain = ctx.createGain()
    masterGain.gain.value = volume
    masterGain.connect(ctx.destination)
  }
  return ctx
}

export function setAudioEnabled(value: boolean): void {
  enabled = value
}

export function setAudioVolume(value: number): void {
  volume = Math.max(0, Math.min(1, value))
  if (masterGain) masterGain.gain.value = volume
}

export function playSound(kind: SoundKind): void {
  if (!enabled) return
  const audio = ensureCtx()
  if (!audio || !masterGain) return
  void audio.resume()

  const now = audio.currentTime
  const osc = audio.createOscillator()
  const gain = audio.createGain()
  osc.connect(gain)
  gain.connect(masterGain)

  switch (kind) {
    case 'tap':
      osc.type = 'sine'
      osc.frequency.setValueAtTime(520, now)
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.08)
      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
      osc.start(now)
      osc.stop(now + 0.11)
      break
    case 'signal':
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(660, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.16)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
      osc.start(now)
      osc.stop(now + 0.22)
      break
    case 'success':
      osc.type = 'sine'
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.setValueAtTime(554, now + 0.1)
      osc.frequency.setValueAtTime(659, now + 0.2)
      gain.gain.setValueAtTime(0.14, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45)
      osc.start(now)
      osc.stop(now + 0.5)
      break
    case 'fail':
      osc.type = 'sine'
      osc.frequency.setValueAtTime(220, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
      osc.start(now)
      osc.stop(now + 0.32)
      break
    case 'ui':
      osc.type = 'sine'
      osc.frequency.setValueAtTime(720, now)
      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)
      osc.start(now)
      osc.stop(now + 0.08)
      break
  }
}
