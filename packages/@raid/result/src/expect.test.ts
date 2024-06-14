/**
 * Using Expect assertion
 * @see https://www.totaltypescript.com/how-to-test-your-types
 */
export type Expect<T extends true> = T
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T,
>() => T extends Y ? 1 : 2
  ? true
  : false
export type Not<T extends boolean> = T extends true ? false : true
