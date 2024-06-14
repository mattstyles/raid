import type { IfNever, IfUnknown } from 'type-fest'
import type { IfVoid } from './types'

export interface Result<T, E = Error> {
  // static of
  // isOk
  // isErr
  // ap -> unwrap fn and use it within map
  // map
  // flatMap
  // match

  // Add constraint for U is T if T is known
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onErr: (err: E) => U): U | T
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onErr: (err: E) => U, onResult: (value: T) => U): IfVoid<U, undefined, U>
}

export class Ok<T, E = never> implements Result<T, E> {
  static of<T>(value: T) {
    return new Ok<T>(value)
  }

  value: T

  constructor(value: T) {
    this.value = value
  }

  match<U>(onErr: (err: E) => U, onResult?: (value: T) => U) {
    return onResult == null ? this.value : onResult(this.value)
  }
}

export class Err<T = never, E = Error> implements Result<never, E> {
  static of<T = never, E = Error>(err: E) {
    return new Err<T, E>(err)
  }

  err: E

  constructor(err: E) {
    this.err = err
  }

  match<U>(onErr: (err: E) => U) {
    return onErr(this.err)
  }
}
