import { describe, it, expect } from 'vitest'
import { stableStringify } from '../utils'

describe('stableStringify', () => {
  it('serializes plain objects with stable ordering', () => {
    const a = { b: 2, a: 1 }
    const b = { a: 1, b: 2 }
    expect(stableStringify(a)).toBe(stableStringify(b))
  })

  it('handles arrays and dates consistently', () => {
    expect(stableStringify([1,2,3])).toBe('[1,2,3]')
    const d = new Date('2020-01-01')
    expect(stableStringify(d)).toContain('Date(')
  })

  it('handles circular references gracefully', () => {
    const a: any = { }
    a.self = a
    expect(stableStringify(a)).toContain('[Circular]')
  })

  it('handles FormData-like objects', () => {
    const fd: any = { entries: () => [['b','2'], ['a','1']] }
    expect(stableStringify(fd)).toBe('{"a":"1","b":"2"}' .replace(/"/g, '"'))
  })
})
