
import type {IfNever, IfUnknown} from 'type-fest'
import type {IfVoid} from './types'

export interface Option<T> {
  // static of
  // isNone
  // isSome
  // map
  // flatMap
  // match

  /**
   * Unwraps an Option and will conditionally run the supplied functions based on the type of the Option.
   */
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U): U | T
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome: (v: T) => U): IfVoid<U, undefined, U>
}

export class Some<T> implements Option<T> {
  static of<T>(value: T) {
    return new Some(value)
  }

  value: T

  constructor(value: T) {
    this.value = value
  }

  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U> | T {
    return onSome == null ? this.value : onSome(this.value)
  }
}

export class None implements Option<never> {
  static of() {
    return new None()
  }

  match<U>(onNone: () => U): U {
    return onNone()
  }
}