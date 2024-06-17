import type { IfAny, IfNull } from 'type-fest'

export type IsUndefined<T> = [T] extends [undefined] ? true : false
export type IfUndefined<T, A = true, B = false> = IsUndefined<T> extends true
  ? A
  : B

export type IsVoid<T> = IfUndefined<T, false, T extends void ? true : false>
export type IfVoid<T, A = true, B = false> = IsVoid<T> extends true ? A : B

export type IsNullish<T> = IfNull<T, true, IfUndefined<T, true, false>>
export type IfNullish<T, A = true, B = true> = IsNullish<T> extends true ? A : B

/**
 * Bans any, null and undefined.
 * Any -> unknown
 * Null -> never
 * Undefined -> never
 */
export type NonNullish<T> = IfAny<T, unknown, IfNullish<T, never, T>>

export type MapFn<A, B> = (value: A) => B

const fn: MapFn<number, number> = (x: number) => x
