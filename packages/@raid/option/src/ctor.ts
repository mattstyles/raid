import type { Option } from './model'
import { None, Some, none, of, some } from './model'
import type { NonNullish } from './types'

export function fromNullable<
  // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
  Fn extends (...args: ReadonlyArray<any>) => any,
>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    const value = fn(...args)
    return of<ReturnType<Fn>>(value)
  }
}

// const inverse = (x: number): number | null => {
//   if (x === 0) {
//     return null
//   }
//   return 1 / x
// }
// option<number>(inverse(12))
// const fn = fromNullable(inverse)
// const oo = fn(12)
// const o2 = option(12).flatMap(fn)
// const o3 = option(inverse(0))
