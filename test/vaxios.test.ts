import { describe, expect, it } from 'vitest'
import * as v from '../src'

describe('vAxios basic export', () => {
  it('exports vAxios', () => {
    expect(typeof (v as any).vAxios).toBe('function')
  })
})
