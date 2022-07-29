export type Merge<Obj1, Obj2> = {
  [Key in keyof Obj1 | keyof Obj2]?:
  Key extends keyof Obj2
    ? Obj2[Key]
    : Key extends keyof Obj1
      ? Obj1[Key]
      : never
}
