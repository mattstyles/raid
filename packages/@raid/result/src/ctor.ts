import type { Result } from './result'
import { Err, Ok } from './result'
import type { IfError } from './types'

export function err<E extends Error>(e: E): Result<never, E> {
  return Err.of(e)
}

export function ok<T>(value: T): Result<T, never> {
  return Ok.of(value)
}

/**
 * Converts a value in to a Result with correct type matching.
 * @TODO do we ever need to expose this function? or ok/err only?
 */
export function result<T = unknown, E extends Error = Error>(
  value: T | E,
): Result<IfError<T, unknown, T>, E> {
  if (value instanceof Error) {
    return err(value)
  }

  return ok(value)
}

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
