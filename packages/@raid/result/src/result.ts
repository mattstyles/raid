import type { IfNever, IfUnknown } from 'type-fest'
import type { IfError, IfVoid, NonError } from './types'

export interface Result<T, E = Error> {
  // static of
  // isOk
  // isErr
  // ap -> unwrap fn and use it within map
  // map
  // flatMap
  // match

  isOk(): this is Result<T>
  isErr(): this is Result<never, E>

  map<U>(fn: (a: T) => U): Result<NonError<U>, E>

  // Add constraint for U is T if T is known
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onErr: (err: E) => U): U | T
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onErr: (err: E) => U, onResult: (value: T) => U): IfVoid<U, undefined, U>
}
