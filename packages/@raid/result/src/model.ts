import type { Result } from './result'
import type { IfError, NonError } from './types'

/**
 * Converts a value in to a Result with correct type matching.
 * @TODO do we ever need to expose this function? or ok/err only?
 */
export function result<T = unknown, E extends Error = Error>(
  value: T | E,
): Result<NonError<T>, E> {
  if (value instanceof Error) {
    return Err.of(value)
  }

  return Ok.of(value)
}

export class Ok<T, E extends Error = never> implements Result<T, E> {
  static of<T>(value: T) {
    return new Ok<T>(value)
  }

  value: T

  constructor(value: T) {
    this.value = value
  }

  isOk() {
    return true
  }
  isErr() {
    return !this.isOk()
  }

  map<U, E extends Error = Error>(fn: (value: T) => U) {
    return result<U, E>(fn(this.value))
  }

  match<U>(onErr: (err: E) => U, onResult?: (value: T) => U) {
    return onResult == null ? this.value : onResult(this.value)
  }
}

export class Err<T = never, E extends Error = Error>
  implements Result<never, E>
{
  static of<T = never, E extends Error = Error>(err: E) {
    return new Err<T, E>(err)
  }

  err: E

  constructor(err: E) {
    this.err = err
  }

  isOk() {
    return false
  }
  isErr() {
    return !this.isOk()
  }

  map() {
    return this
  }

  match<U>(onErr: (err: E) => U) {
    return onErr(this.err)
  }
}
