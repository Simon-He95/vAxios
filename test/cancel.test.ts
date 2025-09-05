import { describe, it, expect, vi } from 'vitest'

vi.mock('axios', () => {
  return {
    default: {
      create: (opts: any) => {
        const instance: any = {
          interceptors: { request: { use: () => {} }, response: { use: () => {} } },
          get: () => new Promise(() => {}), // never resolve/reject
          post: () => Promise.resolve({ data: null }),
          put: () => Promise.resolve({ data: null }),
          delete: () => Promise.resolve({ data: null })
        }
        return instance
      }
    }
  }
})

describe('cancel behavior', () => {
  it('aborts previous request when duplicate key is made', async () => {
    const RealAbort = (globalThis as any).AbortController
    let abortCalls = 0
    // fake AbortController to count abort calls
    class FakeAbortController {
      signal: any
      _cb: any
      constructor() {
        this.signal = { aborted: false, addEventListener: (n: any, cb: any) => { this._cb = cb } }
      }
      abort() { this.signal.aborted = true; abortCalls++; if (this._cb) this._cb() }
    }
    ;(globalThis as any).AbortController = FakeAbortController

    try {
      const { vAxios } = await import('../src')
      const client: any = vAxios()

      client.get('/users', { q: 1 })
      client.get('/users', { q: 1 })

      // Abort should have been called at least once
      expect(abortCalls).toBeGreaterThanOrEqual(1)
    }
    finally {
      ;(globalThis as any).AbortController = RealAbort
    }
  })
})
