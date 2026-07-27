/** Optional haptic feedback for supported mobile browsers / native shells. */

export function haptic(style: 'light' | 'medium' | 'success' = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  switch (style) {
    case 'light':
      navigator.vibrate(10)
      break
    case 'medium':
      navigator.vibrate(20)
      break
    case 'success':
      navigator.vibrate([12, 40, 18])
      break
  }
}
