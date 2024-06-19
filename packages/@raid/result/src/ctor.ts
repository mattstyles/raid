import type { Result } from './model'
import { err, ok } from './model'
import type { IfError, NonError } from './types'

/**
 * Wraps a function to return a result
 */
export function fromThrowable<
  // biome-ignore lint/suspicious/noExplicitAny: needs any for TS casting
  Fn extends (...args: ReadonlyArray<any>) => unknown,
  E extends Error = Error,
>(fn: Fn) {
  return (...args: Parameters<Fn>) => {
    try {
      const res = fn(...args)
      return ok(res) as Result<
        IfError<ReturnType<Fn>, unknown, ReturnType<Fn>>,
        E
      >
    } catch (e) {
      return err(e as E)
    }
  }
}
