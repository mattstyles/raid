import type { IfNever, IfUnknown } from 'type-fest'
// import type { Option } from './option'
import type { IfVoid, MapFn, NonNullish } from './types'

type OValue<U> = IfUnknown<U, unknown, NonNullable<U>>

export interface Option<T> {
  // static of
  // isNone
  // isSome
  // ap
  // map
  // flatMap
  // match

  isSome(): this is Option<T>
  isNone(): this is Option<T>

  // ap<U>(opt: Option<(value: T) => U>): Option<NonNullish<U>>
  // map<U>(fn: (value: T) => U): Some<NonNullable<U>> | None<NonNullable<U>>
  map<U>(fn: (value: T) => U): Option<OValue<U>>
  // flatMap<U>(fn: (value: T) => Option<NonNullish<U>>): Option<NonNullish<U>>

  // orElse<U extends IfUnknown<T, unknown, T>>(value: U): U | T

  /**
   * Unwraps an Option and will conditionally run the supplied functions based on the type of the Option.
   */
  // match<
  //   U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  // >(onNone: () => U): U | T
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome: (v: T) => U): IfVoid<U, undefined, U>
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U): IfVoid<U, undefined, U | T>
  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U | T>

  // match<U extends T>(onNone: () => U, onSome?: (v: T) => U): U | T
}

export function option<T>(value: T): Option<OValue<T>> {
  // return value == null ? None.of() : Some.of(value)
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

// const s1 = some(null)
const s2 = some(12) // number

/** ------------------------------------------------------------------------ */

// const rnd = () => Math.random()
// const inv = (x: number) => (x == null ? null : 1 / x)
// // function inv(x: number) {
// //   if (x === 0) {
// //     return null
// //   }
// //   return 1 / x
// // }
// const on = option(rnd())
// on.match(
//   () => 42,
//   () => 12,
// )
// const mnon = none().match(() => 42)
// const non = some(42).map(inv)

// function double(o: Option<number>): Option<number> {
//   return o.map((x) => x * 2)
// }
// const nd = double(non)

// const v = some('str').match(
//   () => {},
//   () => {},
// )

// const r = option<unknown>('str').match(
//   () => false,
//   () => true,
// )

// const ou = option<unknown>(42)

/** ------------------------------------------------------------------------ */

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

  // orElse<U>(value: U) {
  //   return value
  // }

  // ap<U>(opt: Option<(value: never) => U>) {
  //   return this
  // }

  map<U>(fn: (value: T) => U): None<NonNullable<U>> {
    return this as unknown as None<NonNullable<U>>
  }

  // flatMap<U>(fn: (value: never) => Option<U>) {
  //   return this
  // }

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

  // orElse<U>(value: U) {
  //   return this.value
  // }

  // ap<U>(opt: Option<(value: T) => U>): Option<NonNullish<U>> {
  //   return opt.map((fn) => fn(this.value))
  // }

  map<U>(fn: (value: T) => U) {
    return option<U>(fn(this.value))
  }

  // flatMap<U>(fn: (value: T) => Option<NonNullish<U>>) {
  //   return this.map(fn).match(() => None.of())
  // }

  match<
    U extends IfVoid<U, void, IfNever<T, unknown, IfUnknown<T, unknown, T>>>,
  >(onNone: () => U, onSome?: (v: T) => U): IfVoid<U, undefined, U | T> {
    return onSome == null ? this.value : onSome(this.value)
  }
}
