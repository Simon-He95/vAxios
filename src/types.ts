export type Merge<A, B> = {
  [K in keyof (A & B)]: K extends keyof B
    ? B[K]
    : K extends keyof A
      ? A[K]
      : never
}
