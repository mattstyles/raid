import type { Option } from './model'
import { None, Some, none, of, some } from './model'
import type { NonNullish } from './types'

export function fromPredicate<T>(fn: (v: T) => boolean) {
  return function withPredicate(v: T) {
    return of(fn(v) ? v : null)
  }
}

/** Functional forms -> convert a function. */
/** Unnecessary by composing flow and accepting values */

// export function fromNullable<
//   // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
//   Fn extends (...args: ReadonlyArray<any>) => any,
// >(fn: Fn) {
//   return fromPredicate(fn, (x) => x != null)
// }

// export function fromPredicate<
//   // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
//   Fn extends (...args: ReadonlyArray<any>) => any,
// >(fn: Fn, predicate: (x: ReturnType<Fn>) => boolean) {
//   return (...args: Parameters<Fn>) => {
//     const value = fn(...args)
//     return of<ReturnType<Fn>>(predicate(value) ? value : null)
//   }
// }

// export function fromRefinement<
//   // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
//   Fn extends (arg: any) => any,
// >(fn: Fn, predicate: (x: Parameters<Fn>) => boolean) {
//   return (arg: Parameters<Fn>) => {
//     const input = predicate(arg)
//     return of(predicate(arg) ? fn(arg) : null)
//   }
// }

/** ------------------------------------------------------------------------ */

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
