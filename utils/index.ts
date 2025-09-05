export function stableStringify(v: any): string {
  if (v === null)
    return 'null'
  if (v === undefined)
    return 'undefined'
  const t = typeof v
  if (t === 'string' || t === 'number' || t === 'boolean')
    return JSON.stringify(v)
  if (v instanceof Date)
    return `Date(${v.toISOString()})`
  if (Array.isArray(v))
    return `[${v.map(stableStringify).join(',')}]`
  if (t === 'object') {
    // detect circular
    try {
      const seen = new Set<any>()
      const _rec = (x: any): string => {
        if (x === null)
          return 'null'
        if (x === undefined)
          return 'undefined'
        const tt = typeof x
        if (tt === 'string' || tt === 'number' || tt === 'boolean')
          return JSON.stringify(x)
        if (x instanceof Date)
          return `Date(${x.toISOString()})`
        if (Array.isArray(x))
          return `[${x.map(_rec).join(',')}]`
        if (tt === 'object') {
          if (seen.has(x))
            return '[Circular]'
          seen.add(x)
          // FormData-like
          if (typeof x.entries === 'function') {
            const entries = Array.from(x.entries()).map(([k, val]: any) => [k, String(val)])
            entries.sort((a: any, b: any) => String(a[0]).localeCompare(String(b[0])))
            return `{${entries.map((e: any) => `${_rec(e[0])}:${_rec(e[1])}`).join(',')}}`
          }
          const keys = Object.keys(x).sort()
          return `{${keys.map(k => `${_rec(k)}:${_rec(x[k])}`).join(',')}}`
        }
        return String(x)
      }
      return _rec(v)
    }
    catch (e) {
      return String(v)
    }
  }
  return String(v)
}
