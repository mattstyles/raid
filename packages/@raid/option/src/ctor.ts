import { of } from './model'

/**
 * Maps from `a` to `a -> Option b`
 * @returns Option<T>
 */
export function fromPredicate<T>(fn: (v: T) => boolean) {
  return function withPredicate(v: T) {
    return of(fn(v) ? v : null)
  }
}

/**
 * Maps from `p -> b | null` to `p -> Option b`
 * @returns Option<T>
 */
export function fromNullable<
  // biome-ignore lint/suspicious/noExplicitAny: required for TS casting
  Fn extends (...args: ReadonlyArray<any>) => any,
>(fn: Fn) {
  return function withNullable(...args: Parameters<Fn>) {
    return of<ReturnType<Fn>>(fn(...args))
  }
}
