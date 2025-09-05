import { describe, it, expect } from 'vitest'
import { generateKey } from '../src/vAxios'

describe('generateKey stable behavior', () => {
  it('produces same key for objects with different key order', () => {
    const a = { b: 2, a: 1 }
    const b = { a: 1, b: 2 }
    const k1 = generateKey({ url: '/x', method: 'GET', params: a } as any)
    const k2 = generateKey({ url: '/x', method: 'get', params: b } as any)
    expect(k1).toBe(k2)
  })

  it('normalizes method case and differentiates get vs post', () => {
    const k1 = generateKey({ url: '/x', method: 'GET', params: { q: 1 } } as any)
    const k2 = generateKey({ url: '/x', method: 'post', data: { q: 1 } } as any)
    expect(k1).not.toBe(k2)
  })

  it('handles date and arrays consistently', () => {
    const k1 = generateKey({ url: '/x', method: 'post', data: { a: [1, 2], d: new Date('2020-01-01') } } as any)
    const k2 = generateKey({ url: '/x', method: 'POST', data: { d: new Date('2020-01-01'), a: [1, 2] } } as any)
    expect(k1).toBe(k2)
  })
})
