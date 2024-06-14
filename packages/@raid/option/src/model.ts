import type { IfNever, IfUnknown } from 'type-fest'
import type { Option } from './option'
import type { IfVoid, NonNullish } from './types'

export function option<T>(value: T): Option<NonNullish<T>> {
  return value == null ? None.of() : Some.of(value as NonNullish<T>)
}

export class None implements Option<never> {
  static of() {
    return new None()
  }

  isSome() {
    return false
  }

  isNone() {
    return !this.isSome()
  }

  map<U>(fn: (a: never) => U) {
    return this
  }

  match<U>(onNone: () => U): U {
    return onNone()
  }
}

export class Some<T> implements Option<T> {
  static of<T>(value: T) {
    return new Some(value)
  }

  value: T

  constructor(value: T) {
    this.value = value
  }

  map<U>(fn: (value: T) => U) {
    return option(fn(this.value))
  }

  isSome() {
    return true
  }

  isNone() {
    return !this.isSome()
  }

  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U> | T {
    return onSome == null ? this.value : onSome(this.value)
  }
}
