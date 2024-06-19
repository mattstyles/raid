import type { IfNever, IfUnknown } from 'type-fest'
import type { IfError, IfVoid, NonError } from './types'

export interface Result<T, E extends Error = Error> {
  // static of
  // isOk
  // isErr
  // ap
  // map
  // flatMap
  // match

  isOk(): this is Result<T>
  isErr(): this is Result<never, E>

  ap<U, X extends Error = E>(
    res: Result<(value: T) => NonError<U>>,
  ): Result<NonError<U>, E | X>

  map<U, X extends Error = E>(
    fn: (value: T) => NonError<U>,
  ): Result<NonError<U>, E | X>

  flatMap<U, X extends Error = E>(
    fn: (value: T) => Result<NonError<U>, X>,
  ): Result<NonError<U>, E | X>

  orElse<U>(value: U): U | T

  // Add constraint for U is T if T is known
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onErr: (err: E) => U): U | T
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onErr: (err: E) => U, onResult: (value: T) => U): IfVoid<U, undefined, U>
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(
    onErr: (err: E) => U,
    onResult?: (value: T) => U,
  ): IfVoid<U, undefined, U> | T
}

export function err<E extends Error, T = never>(e: E): Result<T, E> {
  return Err.of(e)
}

export function ok<T, E extends Error = Error>(
  value: NonError<T>,
): Result<NonError<T>, E> {
  return Ok.of(value)
}

/**
 * Converts a value in to a Result with correct type matching.
 */
export function of<T = unknown, E extends Error = Error>(
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

  ap<U, X extends Error = E>(
    res: Result<(value: T) => NonError<U>>,
  ): Result<NonError<U>, E | X> {
    return res.map((fn) => fn(this.value)) as Result<NonError<U>, E | X>
  }

  map<U, X extends Error = E>(fn: (value: T) => NonError<U>) {
    try {
      const res = fn(this.value)
      return of<U, E>(res as U)
    } catch (err) {
      return of<U, X>(err as X)
    }
  }

  flatMap<U, X extends Error = E>(fn: (value: T) => Result<NonError<U>, X>) {
    try {
      const res = fn(this.value)
      return res
    } catch (err) {
      return of<U, X>(err as X)
    }
  }

  orElse<U>(value: U) {
    return this.value
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

  ap() {
    return this
  }

  map() {
    return this
  }

  flatMap<U, X extends Error = E>(
    fn: (value: never) => Result<NonError<U>, X>,
  ) {
    return this as Result<NonError<U>, E>
  }

  orElse<U>(value: U) {
    return value
  }

  match<U>(onErr: (err: E) => U) {
    return onErr(this.err)
  }
}
