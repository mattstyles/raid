import type { Result } from './model'
import { err, of, ok } from './model'
import type { IfError, NonError } from './types'

/**
 * Wraps a function to return a result
 */
export function fromThrowable<
  // biome-ignore lint/suspicious/noExplicitAny: needs any for TS casting
  Fn extends (...args: ReadonlyArray<any>) => any,
  E extends Error = Error,
>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    try {
      const res = fn(...args)
      // return ok(res) as Result<NonError<ReturnType<Fn>>, E>
      return of<ReturnType<Fn>>(res)
    } catch (e) {
      return err<E, ReturnType<Fn>>(e as E)
    }
  }
}
