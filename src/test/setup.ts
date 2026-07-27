import '@testing-library/jest-dom/vitest'

// jsdom does not implement performance.now densely enough for some paths — ensure present.
if (typeof performance === 'undefined') {
  // @ts-expect-error test polyfill
  globalThis.performance = { now: () => Date.now() }
}
