import { describe, it, expect, vi } from 'vitest'

vi.mock('axios', () => {
  return {
    default: {
      create: (opts: any) => {
        const instance: any = {
          interceptors: {
            request: { use: () => {} },
            response: { use: () => {} }
          },
          _count: 0,
          get: (url: string, config: any) => {
            instance._count++
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                if (instance._count < 3) return reject(new Error('network'))
                resolve({ data: 'ok' })
              }, 0)
            })
          },
          post: () => Promise.resolve({ data: null }),
          put: () => Promise.resolve({ data: null }),
          delete: () => Promise.resolve({ data: null })
        }
        return instance
      }
    }
  }
})

describe('retry behavior', () => {
  it('retries failed requests up to retry count', async () => {
    const { vAxios } = await import('../src')
    const client: any = vAxios()
    const res = await client.get('/ping', {}, { retry: 2 })
    expect(res.data).toBe('ok')
  })
})
