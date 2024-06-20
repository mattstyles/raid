import type { IfNever, IfUnknown } from 'type-fest'
import type { IfVoid } from './types'

export type Value<U> = IfUnknown<U, unknown, NonNullable<U>>

/**
 * Extracts a type from an Option
 */
export type Extract<T extends Option<unknown>> = T extends Option<infer U>
  ? U
  : never

export interface Option<T> {
  isSome(): this is Option<T>
  isNone(): this is Option<T>

  ap<U>(opt: Option<(value: T) => U>): Option<Value<U>>
  map<U>(fn: (value: T) => U): Option<Value<U>>
  chain<U>(fn: (value: T) => Option<Value<U>>): Option<Value<U>>

  // @alias chain
  flatMap<U>(fn: (value: T) => Option<Value<U>>): Option<Value<U>>

  orElse<U extends IfUnknown<T, unknown, T>>(value: U): U | T

  /**
   * Handle None and Some types.
   * match<U>(onNone: () => U, onSome?: () => U): U | T
   */
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome: (v: T) => U): IfVoid<U, undefined, U>
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U): IfVoid<U, undefined, U | T>
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U | T>
}

export function of<T>(value: T): Option<Value<T>> {
  if (value == null) {
    return none()
  }

  return some(value)
}

export function some<T extends {}>(value: T) {
  return Some.of(value)
}

export function none<T = never>() {
  return None.of<T>()
}

export class None<T = never> implements Option<T> {
  static of<T = never>() {
    return new None<T>()
  }

  isSome(): this is Option<T> {
    return false
  }

  isNone(): this is Option<T> {
    return !this.isSome()
  }

  orElse<U>(value: U) {
    return value
  }

  ap<U>(opt: Option<(value: never) => U>) {
    return this as unknown as None<NonNullable<U>>
  }

  map<U>(fn: (value: T) => U): None<NonNullable<U>> {
    return this as unknown as None<NonNullable<U>>
  }

  chain<U>(fn: (value: never) => Option<U>) {
    return this as unknown as None<NonNullable<U>>
  }
  flatMap = this.chain

  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U | T> {
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

  isSome(): this is Option<T> {
    return true
  }

  isNone(): this is Option<T> {
    return !this.isSome()
  }

  orElse<U>(value: U) {
    return this.value
  }

  // @TODO should this be (value: T) => Option<Value<U>> and use flatmap instead of map?
  ap<U>(o: Option<(value: T) => U>): Option<Value<U>> {
    return o.map((fn) => fn(this.value))
  }

  map<U>(fn: (value: T) => U) {
    return of(fn(this.value))
  }

  chain<U>(fn: (value: T) => Option<Value<U>>) {
    return this.map(fn).match(() => None.of())
  }

  flatMap = this.chain

  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U | T> {
    return onSome == null ? this.value : onSome(this.value)
  }
}
