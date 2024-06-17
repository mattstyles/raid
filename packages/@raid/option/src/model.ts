import type { IfNever, IfUnknown } from 'type-fest'
import type { Option } from './option'
import type { IfVoid, MapFn, NonNullish } from './types'

export function option<T>(value: T): Option<NonNullish<T>> {
  return value == null ? None.of() : Some.of(value as NonNullish<T>)
}

export class None<T = never> implements Option<T> {
  static of<T = never>() {
    return new None<T>()
  }

  isSome() {
    return false
  }

  isNone() {
    return !this.isSome()
  }

  orElse<U>(value: U) {
    return value
  }

  ap<U>(opt: Option<(value: never) => U>) {
    return this
  }

  map<U>(fn: (value: never) => U) {
    return this
  }

  flatMap<U>(fn: (value: never) => Option<U>) {
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

  isSome() {
    return true
  }

  isNone() {
    return !this.isSome()
  }

  orElse<U>(value: U) {
    return this.value
  }

  ap<U>(opt: Option<(value: T) => U>): Option<NonNullish<U>> {
    return opt.map((fn) => fn(this.value))
  }

  map<U>(fn: (value: T) => U): Option<NonNullish<U>> {
    return option(fn(this.value))
  }

  flatMap<U>(fn: (value: T) => Option<NonNullish<U>>) {
    return this.map(fn).match(() => option(null))
  }

  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U> | T {
    return onSome == null ? this.value : onSome(this.value)
  }
}
