import { None, Some, none, option, some } from './model'
import type { NonNullish } from './types'

// export function some<T>(value: NonNullable<T>) {
//   return Some.of(value)
// }

// export function none<T = never>() {
//   return None.of<T>()
// }

function isNonNullish<T>(x: T): x is NonNullable<T> {
  return x != null
}

export function fromNullable<
  // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
  Fn extends (...args: ReadonlyArray<any>) => unknown,
>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    const value = fn(...args)
    // if (value == null) {
    // if (isNonNullish(value)) {
    //   // return option(null)
    //   return some(value)
    //   // return none()
    // }
    // // return option<ReturnType<Fn>>(fn(...args) as ReturnType<Fn>)
    // // return option(value as ReturnType<Fn>)
    // // return some(value)
    // return none()
    return option(value)
  }
}

// type T = number | null
// type S = NonNullish<T>

// const inverse = (x: number) => {
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
